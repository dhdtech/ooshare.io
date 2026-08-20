# Release playbook

1. `git tag v0.1.0 && git push origin v0.1.0`
2. GitHub Actions runs the `Release CLI` workflow:
   - `build`: GoReleaser → archives/deb/rpm/checksums, cosign keyless sign, SLSA attest, GitHub Release
   - `deploy-brew`, `deploy-scoop`, `deploy-apt`, `deploy-yum`: push to each destination
   - `deploy-winget`: opens a PR to `winget-pkgs` — **merge manually** (only manual step)
3. Smoke-test every channel (see smoke checklist below).

## First-release smoke checklist
- [ ] `gh release list` shows v0.1.0 with *.sig, *.pem, attestation.intoto.jsonl, SHA256SUMS, *.deb, *.rpm
- [ ] `cosign verify-blob --certificate-identity-regexp '…ooshare…' ooshare_0.1.0_linux_amd64.tar.gz --signature …sig --certificate …pem`
- [ ] `slsa-verifier verify-artifact --source-builder '…release-cli.yaml@refs/tags/v0.1.0' --source-uri github.com/dhdtech/ooshare.io ooshare_0.1.0_linux_amd64.tar.gz`
- [ ] macOS: `brew install dhdtech/tap/ooshare && ooshare version`
- [ ] Windows: `winget install dhdtech.ooshare` (after PR merge) and `scoop install ooshare`
- [ ] Debian container: add the apt line, `apt update && apt install ooshare && ooshare version`
- [ ] RHEL container: add the `.repo`, `dnf install ooshare && ooshare version`
- [ ] Reproducible: `git checkout v0.1.0 && go build -trimpath -o /tmp/ooshare ./cmd/ooshare` then `shasum -a 256 /tmp/ooshare` matches a release archive's binary
