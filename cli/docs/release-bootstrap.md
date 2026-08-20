# Release bootstrap (one-time)

These steps were executed once to wire up the three distribution repos, the
dedicated GPG signing key, and the CI secrets for the `ooshare` CLI. Re-run any
section only if the corresponding resource needs to be recreated.

> **Repo naming note:** GitHub Actions for this project run on the upstream repo
> `dhdtech/ooshare.io` (the git remote `git@github.com:dhdtech/oos.git` resolves
> there). All actions/CI secrets are stored on `dhdtech/ooshare.io`.

## Repos (run once)

```bash
gh repo create dhdtech/homebrew-tap     --public --confirm
gh repo create dhdtech/scoop-bucket     --public --confirm
gh repo create dhdtech/ooshare-packages --public --confirm
```

## Enable GitHub Pages on the packages repo (serves /apt and /rpm)

The repo must already have a commit on `main` before Pages can be enabled.

```bash
gh api -X POST repos/dhdtech/ooshare-packages/pages \
  -f "source[branch]=main" -f "source[path]=/" --silent
```

## GPG signing key (dedicated, passphrase-protected)

```bash
gpg --batch --passphrase "$(openssl rand -hex 16)" \
  --quick-gen-key "ooshare@ooshare.io" rsa4096 sign 1y

# Private key → OOSHARE_GPG_PRIVATE_KEY (never commit; store via gh secret set)
gpg --batch --pinentry-mode loopback --passphrase "$PASSPHRASE" \
  --armor --export-secret-keys ooshare@ooshare.io | base64

# Public key → commit to dhdtech/ooshare-packages (as ooshare.gpg)
gpg --armor --export ooshare@ooshare.io > ooshare.gpg

# Fingerprint
gpg --with-colons --list-keys ooshare@ooshare.io | grep '^fpr' | cut -d: -f10
```

## Fine-grained PATs (GitHub UI — gh cannot mint them)

Create three PATs, each scope = `contents:write` on EXACTLY one repo:

- `TAP_REPO_TOKEN`      → `dhdtech/homebrew-tap`
- `BUCKET_REPO_TOKEN`   → `dhdtech/scoop-bucket`
- `PACKAGES_REPO_TOKEN` → `dhdtech/ooshare-packages`

## Store CI secrets (on dhdtech/ooshare.io)

```bash
gh secret set OOSHARE_GPG_PRIVATE_KEY --repo dhdtech/ooshare.io
gh secret set OOSHARE_GPG_PASSPHRASE   --repo dhdtech/ooshare.io
gh secret set TAP_REPO_TOKEN           --repo dhdtech/ooshare.io
gh secret set BUCKET_REPO_TOKEN        --repo dhdtech/ooshare.io
gh secret set PACKAGES_REPO_TOKEN      --repo dhdtech/ooshare.io
```

## Verify

```bash
gh secret list --repo dhdtech/ooshare.io
gh repo view dhdtech/ooshare-packages --json name,url
```
