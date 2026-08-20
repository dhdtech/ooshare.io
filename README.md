<p align="center">
  <img src="ui/public/favicon.svg" width="64" height="64" alt="Only Once Share" />
</p>

<h1 align="center">Only Once Share</h1>

<p align="center">
  Secure one-time secret, image &amp; file sharing with end-to-end encryption.<br/>
  Your data never touches the server unencrypted.
</p>

<p align="center">
  <a href="#how-it-works">How It Works</a> ·
  <a href="#deployment">Deployment</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#architecture">Architecture</a> ·
  <a href="#i18n">Internationalization</a> ·
  <a href="#license">License</a>
</p>

---

## How It Works

Only Once Share uses **client-side AES-256-GCM encryption** via the Web Crypto API. The server never sees plaintext — it only stores encrypted blobs. Secrets can contain text, images, PDFs, archives (ZIP, RAR, 7Z, TAR.GZ), or any combination.

```
CREATE:
  Browser  →  generate master key (AES-256) + secret ID (UUID)
  Browser  →  pack text + optional image into binary envelope
  Browser  →  derive per-secret key: HKDF-SHA-256(masterKey, secretId)
  Browser  →  encrypt: AES-256-GCM(derivedKey, iv=random96bit, aad=secretId)
  Browser  →  POST /api/secrets { ciphertext, ttl, id }
  Server   →  store ciphertext in Redis with TTL
  Server   →  generate 8-char alias, store alias → UUID mapping
  Server   →  return { id: uuid, alias: shortId }
  Browser  →  build link: /s/{alias}?lng=xx#{base64url(masterKey)}

RETRIEVE:
  Browser  →  open link, extract master key from URL fragment (never sent to server)
  Browser  →  GET /api/secrets/{alias}
  Server   →  resolve alias → UUID, fetch ciphertext with GETDEL (atomic delete)
  Server   →  return { ciphertext, id: uuid }
  Browser  →  derive key: HKDF-SHA-256(masterKey, uuid)
  Browser  →  decrypt: AES-256-GCM(derivedKey, iv, aad=uuid) → binary envelope
  Browser  →  unpack envelope → text and/or image
```

The encryption key lives in the **URL fragment** (`#key`), which browsers never send to the server. After one retrieval, the secret is permanently deleted.

## Encryption In Depth

### Cipher Suite

| Component | Algorithm | Detail |
|-----------|-----------|--------|
| **Symmetric cipher** | AES-256-GCM | 256-bit key, authenticated encryption with associated data |
| **IV** | Random 96-bit | Generated via `crypto.getRandomValues()`, unique per secret |
| **Key derivation** | HKDF-SHA-256 | Derives per-secret key from master key + secret ID |
| **Key transport** | URL fragment | `#base64url(masterKey)` — never sent to server by browsers |

### Key Derivation (HKDF)

The master key in the URL is **not** used directly for encryption. Instead, a unique key is derived per secret:

```
derivedKey = HKDF-SHA-256(
    ikm:  masterKey (256-bit AES key from URL fragment)
    salt: "only-once-share-v1"
    info: secretId (UUID)
) → 256-bit AES-GCM key
```

This means:
- Each secret has a **cryptographically independent** encryption key, even if the master key were somehow reused.
- The derived key is bound to the specific secret ID — it cannot decrypt any other secret.

### Authenticated Data (AAD)

The secret ID is passed as **Additional Authenticated Data** to AES-GCM:

```
ciphertext = AES-256-GCM.encrypt(
    key:  derivedKey
    iv:   random 96-bit
    aad:  secretId (UUID)
    data: binary envelope (text + optional image)
)
```

AAD is not encrypted but is authenticated by the GCM tag. This prevents:
- **Ciphertext swapping** — moving encrypted data between different secret IDs causes decryption to fail.
- **ID tampering** — changing the secret ID in the URL invalidates the GCM authentication tag.

### Ciphertext Format

The encrypted payload is a single binary blob encoded as base64:

```
┌─────────┬──────────────┬──────────────────────────────┐
│ Version │     IV       │  Ciphertext + GCM Auth Tag   │
│  1 byte │   12 bytes   │       variable length        │
└─────────┴──────────────┴──────────────────────────────┘
```

- **Version** (`0x01`): Enables future algorithm upgrades without breaking existing secrets.
- **IV**: 96-bit initialization vector (NIST recommended size for AES-GCM).
- **Ciphertext + Tag**: AES-GCM output including the 128-bit authentication tag.

### Plaintext Payload Format (Binary Envelope)

Before encryption, the plaintext is packed into a binary envelope that supports text, images, or both:

```
Text-only (type 0x00):
┌──────┬────────────────────┐
│ 0x00 │  text (UTF-8)      │
└──────┴────────────────────┘

Text + Image (type 0x01):
┌──────┬──────────────┬──────────────┬──────────┬──────────────┬─────────────────┐
│ 0x01 │ text_len (4B)│ text (UTF-8) │ mime_len │ mime (ASCII) │ image (raw)     │
│      │  uint32 BE   │              │  uint8   │              │                 │
└──────┴──────────────┴──────────────┴──────────┴──────────────┴─────────────────┘
```

- **Type `0x00`**: Text-only secret. Everything after the type byte is UTF-8 text.
- **Type `0x01`**: Text + image. Text length is encoded as a 4-byte big-endian uint32 (text can be empty). Image bytes follow the MIME type string.
- **Legacy**: Secrets created before the image feature have no type byte — decoded as raw UTF-8 text. Fully backwards compatible.
- **Accepted file types**: JPEG, PNG, GIF, WebP, PDF, ZIP, RAR, 7Z, TAR.GZ (max 25 MB). SVG is excluded to prevent XSS.
- The outer ciphertext format is unchanged — the server cannot distinguish text from images, PDFs, or archives.

### URL Structure

```
https://example.com/s/Kx7mP2nQ?lng=en#iZcjqbPIBnrWwHHkv_KDWeDcUr9hi3A0oMaVbgCVLrg
                     ├────────┤ ├───┤  ├──────────────────────────────────────────────┤
                     alias     lang    master key (base64url, 256-bit)
                     (8 char)          URL fragment — NEVER sent to server
```

- **Alias**: 8-character base62 short ID mapped to the real UUID in Redis. The UUID is the crypto binding — the alias is purely for shorter URLs.
- **Language**: Optional `?lng=` parameter so recipients see the page in the sender's language.
- **Master key**: The only secret material. Lives exclusively in the URL fragment, which browsers exclude from HTTP requests, server logs, and referrer headers.

### What the Server Knows

| Data | Server has it? | Notes |
|------|---------------|-------|
| Ciphertext | Yes | Encrypted blob, useless without the key |
| Secret ID (UUID) | Yes | Used as Redis key, but not secret |
| Alias | Yes | Maps to UUID, presentation-only |
| TTL | Yes | Expiration time |
| Master key | **No** | Lives in URL fragment, never transmitted |
| Derived key | **No** | Computed client-side from master key + UUID |
| Plaintext (text/files) | **No** | Only exists in the sender's and recipient's browser |
| Content type | **No** | Cannot distinguish text from images, PDFs, or archives |

## Security Model

| Layer | Detail |
|-------|--------|
| **Encryption** | AES-256-GCM with random 96-bit IV per secret |
| **Key derivation** | HKDF-SHA-256 derives a unique key per secret from master key + secret ID |
| **Authenticated data** | Secret ID bound as AES-GCM AAD — ciphertext cannot be swapped between secrets |
| **Key delivery** | URL fragment — never reaches the server |
| **File sharing** | JPEG, PNG, GIF, WebP, PDF, ZIP, RAR, 7Z, TAR.GZ up to 25 MB — encrypted identically to text |
| **Zero knowledge** | Server stores only ciphertext, cannot distinguish text from images, PDFs, or archives |
| **One-time view** | Secret is atomically deleted on first retrieval (`GETDEL`) |
| **Auto-expiry** | Redis TTL (1–72h) ensures secrets expire even if never viewed |
| **Versioned format** | Ciphertext includes version byte for future algorithm upgrades |
| **Short aliases** | 8-char base62 IDs (62^8 = 218 trillion), atomic collision-free generation |

## Deployment

Only Once Share can be used in two ways:

### Cloud (Hosted)

Start sharing secrets immediately at **[https://ooshare.io](https://ooshare.io)** — no setup required. The hosted version runs the same open-source code from this repository.

### On-Premise (Self-Hosted)

If your organization requires full control over the infrastructure — for compliance, data residency, or security policies — you can deploy Only Once Share on your own servers.

**What you need:**
- A container runtime (Docker, Kubernetes, ECS, etc.)
- A Redis instance (managed or self-hosted)
- A reverse proxy or load balancer for TLS termination

**Steps:**
1. Clone this repository
2. Build the API and UI Docker images (see [Getting Started](#getting-started))
3. Deploy a Redis instance and set the `REDIS_URL` environment variable on the API
4. Set `VITE_API_URL` to your API's URL when building the UI (or update the default in `ui/Dockerfile`)
5. Configure DNS and TLS for your domain

The architecture is stateless (aside from Redis), so it scales horizontally with no changes. All encryption happens client-side — the server never sees plaintext regardless of where it's deployed.

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose

### Run (Development)

```bash
git clone https://github.com/dhdtech/only-once-share.git
cd only-once-share
docker compose up --build
```

The app will be available at **http://localhost:8080**.

Hot reload is enabled — edit files in `ui/src/` and changes appear instantly.

### Run (Production)

For production, the UI Dockerfile builds static assets and serves them via nginx:

```bash
docker compose -f docker-compose.yml up --build
```

> **Note:** Update `docker-compose.yml` to use `Dockerfile` instead of `Dockerfile.dev` for the UI service in production.

## Architecture

```
┌─────────────────────────────────────────────┐
│                  Docker Compose              │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │  UI      │  │  API     │  │  Redis    │  │
│  │  React   │→ │  Flask   │→ │  Storage  │  │
│  │  :8080   │  │  :5000   │  │  :6379    │  │
│  └──────────┘  └──────────┘  └───────────┘  │
│                                              │
└─────────────────────────────────────────────┘
```

### UI — `ui/`

| Tech | Purpose |
|------|---------|
| React 19 | Component framework |
| TypeScript | Type safety |
| Vite 6 | Build tool with HMR |
| Web Crypto API | Client-side AES-256-GCM |
| react-i18next | Internationalization |
| Lucide React | Icon system |

### API — `api/`

| Tech | Purpose |
|------|---------|
| Flask 3 | HTTP framework |
| Redis 7 | Encrypted blob storage with TTL |
| Gunicorn | Production WSGI server |

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/secrets` | Store encrypted secret (max 40 MB), returns `{ id, alias }` |
| `GET` | `/api/secrets/:id` | Retrieve and delete encrypted secret (accepts UUID or alias), returns `{ ciphertext, id }` |
| `GET` | `/api/health` | Health check |

## CLI

`ooshare` — a single-binary command-line client (macOS, Linux, Windows) for creating
and viewing one-time secrets, with JSON output for scripts and CI. See `cli/README.md`.

## I18n

The app supports 6 languages out of the box:

| Language | Code |
|----------|------|
| English | `en` |
| 中文 (Chinese) | `zh` |
| Español (Spanish) | `es` |
| हिन्दी (Hindi) | `hi` |
| العربية (Arabic) | `ar` |
| Português (Portuguese) | `pt` |

Language selection is persisted in localStorage and embedded in share links (`?lng=xx`) so recipients see the secret page in the sender's language.

Translation files live in `ui/src/i18n/locales/`.

## Project Structure

```
only-once-share/
├── api/
│   ├── app.py              # Flask API (3 endpoints)
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile          # Production container
├── ui/
│   ├── src/
│   │   ├── pages/          # CreateSecret, ViewSecret, Security, About, FAQ, Blog
│   │   ├── components/     # Layout, SecurityModal, LanguageSelector, ImageModal
│   │   ├── lib/            # crypto.ts (AES-GCM + binary envelope), api.ts (fetch client)
│   │   └── i18n/           # i18next config + 6 locale files
│   ├── public/favicon.svg  # Shield favicon
│   ├── Dockerfile          # Production (nginx)
│   └── Dockerfile.dev      # Development (Vite HMR)
├── docker-compose.yml
├── LICENSE
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## License

This project is licensed under the [MIT License](LICENSE).
