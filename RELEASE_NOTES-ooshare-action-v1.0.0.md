# ooshare-action v1.0.0

> **Create and reveal one-time, self-destructing secrets directly from your GitHub Actions workflows** — with the same zero-knowledge, end-to-end encryption as [ooshare.io](https://ooshare.io).

A secret created in this action can be revealed by anyone with the link — in another workflow, in the CLI, or in the browser — exactly once. Then it is gone. Forever. Not even the ooshare servers can read it.

```yaml
- uses: dhdtech/ooshare-action@v1
  id: share
  with:
    command: create
    text: ${{ secrets.MY_SECRET }}   # always a GitHub secret, never a literal

- name: Hand the one-time link to your team
  run: echo "Share this privately: ${{ steps.share.outputs.url }}"
```

---

## What this action lets you do

### 🔐 Create one-time secrets

| Capability | How |
|---|---|
| **Share a secret string** | `text:` — reference a `${{ secrets.* }}` |
| **Attach a file** (up to 25 MB) | `file:` — PDF, images, ZIP, RAR, 7Z, TAR.GZ |
| **Text + file together** | both inputs at once |
| **Set a lifetime** | `ttl:` — 1 to 72 hours; the secret auto-expires |
| **Localize the reveal page** | `lang:` — `en`, `zh`, `es`, `hi`, `ar`, `pt` |
| **Point at your own API** | `api-url:` / `origin:` — self-hosted or staging |
| **Pin the CLI version** | `version:` — supply-chain-safe default `v1.0.3` |

### 👀 Reveal (consume) secrets

| Capability | How |
|---|---|
| **Reveal the text** | `command: view` + `url:` → `outputs.text` |
| **Write a file attachment to disk** | `output:` — a directory **or** an exact path |
| **Read attachment bytes in later steps** | `outputs.attachment` (path) + `outputs.attachment-mime` |
| **Consume only once** | the secret is atomically deleted on first reveal |

### 📦 Every output the action returns

| Output | Meaning |
|---|---|
| `url` | The one-time share link (**contains the decryption key — treat as sensitive**) |
| `id` | The secret ID |
| `has_attachment` | `true`/`false` — whether a file was attached |
| `text` | The revealed secret text (view) |
| `attachment` | Path where a decoded file was written (view) |
| `attachment-mime` | MIME type of the decoded file (view) |

---

## Why you can trust it — security on every side

This is a secrets product. Each layer is designed so that *no single compromise reveals anything*.

### 🔑 On your side — the server never sees your secret
- Secrets are **encrypted before they leave the action**: **AES-256-GCM**, with keys derived via **HKDF-SHA-256**.
- The master key **never crosses the network** — it travels only in the URL *fragment* (`#…`), which browsers and HTTP clients never send to a server.
- The ciphertext is **bound to the secret ID** (AAD), so a ciphertext can't be replayed against a different ID.
- The workflow's secret text flows to the CLI via **stdin/env, never the process argument list** — it doesn't show up in process listings or shell history.

### 🖥️ On the server side — there is nothing to steal
- The API stores **only ciphertext** — a database breach yields encrypted blobs and nothing else.
- Secrets are **atomically deleted on first retrieval** (`Redis GETDEL`) — reveal is a one-shot, race-free operation.
- Every secret has a **TTL (1–72 h)** with server-side auto-expiry — even an untouched secret dies on schedule.

### 📦 On the action itself — supply-chain safe
- The `ooshare` binary is downloaded **only after its SHA-256 matches the release `SHA256SUMS`** — a tampered or swapped artifact fails the step instead of running.
- Every CLI release is additionally **keyless-cosign-signed with SLSA provenance** — verifiable end-to-end build provenance.
- The CLI version is **pinned** (`version:`, default `v1.0.3`), not floating — you decide when to move.
- The action uses **no `GITHUB_TOKEN` and makes no API calls to GitHub** — there is no credential surface to leak, and no `permissions:` block you must add.

### ⏱️ Lifecycle guarantees
- **One-time:** after a successful reveal, a second attempt returns nothing.
- **Time-bounded:** TTL expiry even if never revealed.
- **Zero-knowledge end to end:** the same crypto runs in the [CLI](https://github.com/dhdtech/ooshare.io/tree/main/cli) and the [web app](https://ooshare.io) — a link created here opens anywhere, byte-for-byte compatible.

---

## Quick start

### Create and pass the link to a later job (or a human)

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dhdtech/ooshare-action@v1
        id: share
        with:
          command: create
          text: ${{ secrets.PRODUCTION_DB_URL }}
          ttl: 24

      # Post the one-time link to your team's private channel
      - run: |
          echo "DB URL (expires in 24h, viewable once): ${{ steps.share.outputs.url }}"
```

### Attach a file and reveal it in a later step

```yaml
- uses: dhdtech/ooshare-action@v1
  id: share
  with:
    command: create
    file: ./contract.pdf
    lang: es

# …much later, in a consuming job…
- uses: dhdtech/ooshare-action@v1
  id: reveal
  with:
    command: view
    url: ${{ needs.share.outputs.url }}
    output: ./attachments

- run: cat "${{ steps.reveal.outputs.attachment }}"   # the decrypted file bytes
```

### Secrets are strictly one-time

```yaml
# First reveal succeeds…
- uses: dhdtech/ooshare-action@v1
  with:
    command: view
    url: ${{ steps.share.outputs.url }}

# …a second reveal fails — the secret no longer exists on the server
- uses: dhdtech/ooshare-action@v1
  continue-on-error: true
  id: again
  with:
    command: view
    url: ${{ steps.share.outputs.url }}
- run: test "${{ steps.again.outcome }}" = "failure"
```

---

## Platform support

Linux · macOS · Windows — **amd64 and arm64** — the correct release binary is downloaded, checksum-verified, and run automatically for the runner.

## License

[MIT](https://github.com/dhdtech/ooshare-action/blob/main/LICENSE)

---

*Made with the [ooshare](https://ooshare.io) CLI — free, open source, zero-knowledge one-time secret sharing.*
