# ooshare CLI — directory & registry submissions

Discovery channels for the CLI. Status + how to submit.

## 1. terminaltrove.com (CLI showcase)
- URL: https://terminaltrove.com
- Submission: https://terminaltrove.com/submit  (web form)
- Blurb:
  > ooshare — create and reveal one-time secrets from the terminal. Single static
  > binary, end-to-end AES-256-GCM encryption identical to the web, zero-knowledge,
  > self-destructing links. Free, MIT. `brew install ooshare`, `apt install ooshare`,
  > `winget install dhdtech.ooshare`, or `go install github.com/dhdtech/ooshare.io/cli/cmd/ooshare@latest`.
- Repo: https://github.com/dhdtech/ooshare.io  ·  Page: https://ooshare.io/cli

## 2. awesome-cli-apps (GitHub list)
- URL: https://github.com/agarrharr/awesome-cli-apps
- Submission: fork + PR (add under "Development · Security" or a suitable section)
- Entry:
  ```markdown
  - [ooshare](https://github.com/dhdtech/ooshare.io) - One-time secret sharing from the terminal, end-to-end encrypted.
  ```

## 3. Homebrew core
- Status: formula ready at `cli/contrib/homebrew/ooshare.rb` (source build, audit-compliant).
- Submit to `Homebrew/homebrew-core` at `Formula/o/ooshare.rb` via fork + PR. Review is
  maintainer-gated (`brew audit --strict --new ooshare` + `brew tests`).
- Makes `brew install ooshare` work WITHOUT the tap.

## 4. Other candidates (lower priority)
- `awesomeshell` / `shellverse.com` — shell/CLI listing, web form
- GitHub topic search — already tagged (cli, secret-sharing, zero-knowledge, devtools, encryption, one-time-secret, command-line)
- `godoc` / pkg.go.dev — appears automatically once the Go module is indexed (module path `github.com/dhdtech/ooshare.io/cli`, tags `cli/v*`)
