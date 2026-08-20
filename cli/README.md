# ooshare — Only Once Share CLI

Create and view one-time secrets from the terminal, exactly like the web
(https://ooshare.io). A single static binary — nothing else to install.

## Install

Download the release for your platform from the [releases](https://github.com/dhdtech/ooshare.io/releases)
page. Releases are tagged `v*` and ship as `ooshare_<version>_<os>_<arch>.tar.gz` (`.zip` on Windows),
plus `.deb`/`.rpm` packages and a `SHA256SUMS` checksum file. macOS and Linux:

```bash
curl -fsSL https://github.com/dhdtech/ooshare.io/releases/download/v0.1.0/ooshare_0.1.0_linux_amd64.tar.gz -o ooshare.tgz
tar -xzf ooshare.tgz ooshare
sudo mv ooshare /usr/local/bin/
```

Note the tag keeps its leading `v` in the download path, but the asset filename uses the
version without it (e.g. tag `v0.1.0` → `ooshare_0.1.0_linux_amd64.tar.gz`).

## Create a secret

```bash
ooshare create --text "s3cr3t" --ttl 24        # prints the share URL
ooshare create --text "s3cr3t" --ttl 24 --json  # machine-readable JSON
echo -n "s3cr3t" | ooshare create --ttl 1        # read text from stdin (avoids shell history)
ooshare create --file contract.pdf --ttl 72      # attach a file (max 25 MB)
```

## Reveal a secret

```bash
ooshare view "https://ooshare.io/s/Kx7mP2nQ?lng=en#<key>"   # prints plaintext
ooshare view "https://…" --output /tmp                      # write an attachment to /tmp
ooshare view "https://…" --output - > secret.pdf            # stream binary to stdout
```

## GitHub Actions

See `examples/secret-exchange.yml`. The CLI is non-interactive, emits JSON with
`--json`, and uses exit codes `0`/`1`/`2` (success / runtime-error / usage-error).

## Configuration

| Flag | Env | Default |
|---|---|---|
| `--api-url` | `OOSHARE_API_URL` | `https://api.ooshare.io` |
| `--origin` | `OOSHARE_ORIGIN` | `https://ooshare.io` |

## Security

- The share URL **is** the secret — the master key lives in the URL fragment. Treat it as sensitive.
- Pipe text via stdin instead of `--text` for values you don't want in shell history.
- `--output` writes attachments with `0600` permissions.
