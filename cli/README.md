# ooshare — Only Once Share CLI

Create and view one-time secrets from the terminal, exactly like the web
(https://ooshare.io). A single static binary — nothing else to install.

## Install

| Method | Command | Verify |
|---|---|---|
| Homebrew | `brew tap dhdtech/ooshare && brew install ooshare` | `ooshare version` |
| Scoop | `scoop bucket add ooshare https://github.com/dhdtech/scoop-ooshare && scoop install ooshare` | `ooshare version` |
| winget | `winget install dhdtech.ooshare` | `ooshare version` |
| apt (Debian/Ubuntu) | `sudo install -Dm644 <(curl -Ls https://dhdtech.github.io/packages-ooshare/apt/ooshare.gpg) /usr/share/keyrings/ooshare.gpg` then add `deb [signed-by=/usr/share/keyrings/ooshare.gpg] https://dhdtech.github.io/packages-ooshare/apt stable main` | `apt update && apt install ooshare` |
| yum/dnf (RHEL/Fedora) | add a `.repo` with `baseurl=https://dhdtech.github.io/packages-ooshare/rpm` and `gpgkey=https://dhdtech.github.io/packages-ooshare/rpm/ooshare.gpg` | `dnf install ooshare` |
| Release binary | download from [releases](https://github.com/dhdtech/ooshare.io/releases) | `sha256sum -c SHA256SUMS` |

Supply-chain verification: `cosign verify-blob --certificate-identity-regexp '…ooshare…' <artifact> --signature <artifact>.sig --certificate <artifact>.pem` and `slsa-verifier verify-artifact --source-builder 'https://github.com/dhdtech/ooshare.io/.github/workflows/release-cli.yaml@refs/tags/v*' --source-uri github.com/dhdtech/ooshare.io <artifact>`.

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
