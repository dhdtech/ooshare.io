# ooshare — Only Once Share CLI

Create and reveal **one-time secrets from the terminal** — the same end-to-end
AES-256-GCM encryption as the web ([ooshare.io](https://ooshare.io)), in a single
static binary. Free, open source (MIT), zero-knowledge, no runtime. A secret
created in the CLI opens in the browser, and vice versa.

```
ooshare create --text "hello"                  # → one-time link
ooshare view "https://ooshare.io/s/…"          # → reveal it once, then it's gone
```

## Install

| Method | Command | Verify |
|---|---|---|
| macOS (Homebrew) | `brew tap dhdtech/ooshare && brew trust dhdtech/ooshare && brew install ooshare` | `ooshare version` |
| Linux (apt) | add `deb [signed-by=…/ooshare.gpg] https://dhdtech.github.io/packages-ooshare/apt stable main` then `sudo apt install ooshare` | `ooshare version` |
| Linux (dnf) | add a `.repo` with `baseurl=https://dhdtech.github.io/packages-ooshare/rpm` then `sudo dnf install ooshare` | `ooshare version` |
| Windows (winget) | `winget install dhdtech.ooshare` | `ooshare version` |
| Windows (Scoop) | `scoop bucket add ooshare https://github.com/dhdtech/scoop-ooshare && scoop install ooshare` | `ooshare version` |
| Go (any platform) | `go install github.com/dhdtech/ooshare.io/cli/cmd/ooshare@latest` | `ooshare version` |
| Release binary | download from [releases](https://github.com/dhdtech/ooshare.io/releases) | `sha256sum -c SHA256SUMS` |

Supply-chain verification: `cosign verify-blob --certificate-identity-regexp '…ooshare…' <artifact> --signature <artifact>.sig --certificate <artifact>.pem` and `slsa-verifier verify-artifact --source-builder 'https://github.com/dhdtech/ooshare.io/.github/workflows/release-cli.yaml@refs/tags/v*' --source-uri github.com/dhdtech/ooshare.io <artifact>`.

## Commands

```
ooshare create [flags]   Create a one-time secret, print the share URL
ooshare view <url>       Reveal a secret from its URL (deletes it)
ooshare version          Print version info
```

**Exit codes:** `0` success · `1` runtime/API error · `2` usage error

---

## Create — every way

### 1. Plain text
```bash
ooshare create --text "s3cr3t"
# → https://ooshare.io/s/Kx7mP2nQ?lng=en#<key>
```

### 2. From stdin (keeps the secret out of your shell history)
```bash
echo -n "s3cr3t" | ooshare create --ttl 1
cat key.txt | ooshare create --ttl 4
```

### 3. With a file attachment (image, PDF, ZIP, RAR, 7Z, TAR.GZ — up to 25 MB)
```bash
ooshare create --file contract.pdf --ttl 24
```

### 4. Text + file together
```bash
ooshare create --text "review by Friday" --file contract.pdf --ttl 48
printf 'caption' | ooshare create --file screenshot.png --ttl 12
```

### 5. Machine-readable JSON (for scripts and CI)
```bash
ooshare create --text "s3cr3t" --json
# {"schema":1,"id":"…","alias":"Kx7mP2nQ","url":"…","ttl_hours":24,"has_attachment":false}
ooshare create --text "s3cr3t" --json | jq -r .url
```

### 6. TTL and language
```bash
ooshare create --text "x" --ttl 1     # min 1h
ooshare create --text "x" --ttl 72    # max 72h
ooshare create --text "x" --lang es   # recipient sees the page in Spanish (en|zh|es|hi|ar|pt)
```

### 7. Quiet (bare URL only)
```bash
ooshare create --text "x" --quiet   # prints only the URL, no panel
```

---

## View — every way

### 1. Reveal plain text
```bash
ooshare view "https://ooshare.io/s/Kx7mP2nQ?lng=en#<key>"
# → prints the plaintext (the secret is now deleted)
```

### 2. With a file attachment → write to disk
```bash
ooshare view "$url"                                   # → ./secret.pdf
ooshare view "$url" --output /tmp/                    # → /tmp/secret.pdf
ooshare view "$url" --output ./keep/custom.bin        # → exact path
ooshare view "$url" --output - > out.pdf             # → raw bytes to stdout
```

### 3. Machine-readable
```bash
ooshare view "$url" --json
# {"schema":1,"text":"…","attachment":{"path":"secret.pdf","mime":"application/pdf","size":123}}
```

### 4. URL from a file, variable, or stdin
```bash
ooshare view < url.txt
URL="$(ooshare create --text hi --ttl 1)"; ooshare view "$URL"
echo "$URL" | ooshare view
```

### 5. Flags before OR after the URL (both work)
```bash
ooshare view "$url" --output /tmp
ooshare view --output /tmp "$url"
```

---

## In CI / GitHub Actions

```bash
# create a secret, capture the URL, share it
URL=$(ooshare create --text "$SECRET" --ttl 24 --json | jq -r .url)

# reveal it in a later step
ooshare view "$URL" > secret.txt
```

Or use the ready-made action:
```yaml
- uses: dhdtech/ooshare-action@v1
  id: share
  with:
    command: create
    text: ${{ secrets.MY_SECRET }}
```

See `examples/secret-exchange.yml` for a full create → consume workflow.

---

## Configuration

| Flag | Env | Default |
|---|---|---|
| `--api-url` | `OOSHARE_API_URL` | `https://api.ooshare.io` |
| `--origin` | `OOSHARE_ORIGIN` | `https://ooshare.io` |

## Security

- **The share URL is the secret** — the master key lives in the URL fragment
  (`#…`), never sent to the server. Treat any link as sensitive.
- **One-time:** the secret is atomically deleted on first `view` (Redis `GETDEL`).
- **Same crypto as the web:** AES-256-GCM + HKDF-SHA-256, byte-for-byte
  compatible — a CLI link opens in the browser and vice versa.
- Pipe text via stdin (not `--text`) for values you don't want in shell history.
- `--output` writes attachments with `0600` permissions.
