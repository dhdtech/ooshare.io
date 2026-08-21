# Extension release bootstrap (one-time)

This runbook covers the one-time store setup required before the
`.github/workflows/release-extension.yaml` store-publish jobs can publish. Each
store has its own account plus a set of repo secrets that must exist before that
store's publish will run. Re-run any section only if the corresponding resource
needs to be recreated.

> **Where secrets live:** Actions/CI secrets are stored on the upstream repo
> `dhdtech/ooshare.io` (the same repo that houses the CLI release pipeline). Set
> them with `gh secret set <NAME> --repo dhdtech/ooshare.io` or in the repo
> Settings → Secrets and variables → Actions UI.

The release workflow triggers on tags matching `ext-v*`. The `build` job is
**required** — it builds all targets, packages the zips, generates `SHA256SUMS`,
and publishes a GitHub release. The four store jobs (`publish-chrome`,
`publish-firefox`, `publish-safari`, `publish-edge`) are best-effort: each is
gated on its own secrets being present, so the workflow stays green until an
account is provisioned and its secrets are set.

## Tagging convention

Push a tag of the form `ext-v<version>` (e.g. `ext-v1.0.0`) to `main` to trigger
the pipeline:

```bash
git tag ext-v1.0.0
git push origin ext-v1.0.0
```

- The `build` job runs on every push of an `ext-v*` tag and always succeeds or
  fails deterministically (it has no secret dependency).
- Each store job runs as a no-op (every publish step is skipped) until its
  secrets are configured; once configured, it performs the publish.
- Version is derived from the tag: `ooshare-chrome-<version>.zip`,
  `ooshare-firefox-<version>.zip`, plus a `source.tar.gz` and `SHA256SUMS`, all
  attached to the GitHub release.

## Chrome (Google Web Store)

The CI uses `chrome-webstore-upload-cli@4`, which reads exactly these env vars
(`CLIENT_ID`, `CLIENT_SECRET`, `REFRESH_TOKEN`, `PUBLISHER_ID`, `EXTENSION_ID`);
they are mapped from the repo secrets below.

1. Create the extension item in the **Chrome Web Store dashboard**
   (`https://chrome.google.com/webstore/devconsole/`) — "Add new item". Uploads
   there are required once before the API can publish. This gives you the
   **extension ID** and the **publisher ID** (both visible in the item's
   dashboard URL / account page).
2. To use the upload/publish API you need an OAuth client:
   - In **Google Cloud Console** (`https://console.cloud.google.com/`), create an
     OAuth **desktop** client ID and secret, and enable the **Chrome Web Store
     API**.
   - Run the OAuth dance to obtain a long-lived **refresh token** for those
     client credentials. Follow the canonical guide:
     `https://github.com/fregante/chrome-webstore-upload-keys`.
3. Set five repo secrets (`gh secret set <NAME> --repo dhdtech/ooshare.io`):
   - `CWS_CLIENT_ID` — OAuth client ID
   - `CWS_CLIENT_SECRET` — OAuth client secret
   - `CWS_REFRESH_TOKEN` — the refresh token from step 2
   - `CWS_PUBLISHER_ID` — the publisher ID from step 1
   - `CWS_EXTENSION_ID` — the extension's item ID from step 1
4. First publish is subject to **manual review** by Google. Subsequent tagged
   releases auto-upload and auto-publish (100% deploy) to the default target.

## Firefox (addons.mozilla.org)

1. Register the extension on **addons.mozilla.org** (`https://addons.mozilla.org/developers/`).
   The extension's ID must be fixed/registered for `web-ext sign` to attach to the
   right listing; for an unlisted build WXT's generated ID is sufficient for signing.
2. Generate API credentials under **Manage My Submissions → API Keys**
   (`https://addons.mozilla.org/developers/addon/api/key/`) — you get an
   `AMO_API_KEY` (JWT issuer) and an `AMO_API_SECRET` (JWT secret).
3. Set two repo secrets: `AMO_API_KEY`, `AMO_API_SECRET`.
4. The pipeline runs `web-ext sign ... --channel unlisted`, producing a signed,
   installable `.xpi`. Note the `.xpi` is **not** attached to the GitHub release:
   the `build` job creates the release with the artifacts it built (the unsigned
   Chrome/Firefox `.zip` builds, `source.tar.gz`, `SHA256SUMS`), and `web-ext sign`
   runs later in the `publish-firefox` job where the `.xpi` lands only in that
   job's `extension/dist/` directory. The unsigned `ooshare-firefox-<version>.zip`
   **is** in the release, but the signed `.xpi` is not uploaded anywhere by the
   workflow — retrieve it from the `publish-firefox` job's `dist/` artifact if you
   need to distribute it manually.
5. **For a public *listed* submission** (what most users install from AMO), the
   `web-ext sign --channel unlisted` step is NOT sufficient — replace it with the
   AMO submit API call. Add the extension to the AMO listing, then use the
   [AMO public submission API](https://addons.mozilla.org/en-US/developers/docs/addons/)
   to upload the versioned package to the listed channel, then submit for review.
   `web-ext sign` alone only ships an unlisted/installable build.

## Edge (Microsoft Edge Add-ons)

1. Register the listing in **Microsoft Edge Partner Center**
   (`https://partner.microsoft.com/en-us/dashboard/microsoftedge`).
   Easiest first import: the Partner Center can **"Import from Chrome Web Store"**,
   which copies the existing CWS listing, or upload `ooshare-chrome-*.zip` manually.
2. Edge's **Ports API** requires an **Azure AD app** with a client secret plus a
   product ID to authenticate publishing. Wire those up only if you want automated
   uploads — for v1 the workflow job just prints guidance and does not upload, so the
   release is still created green.
3. If automating, set the repo secret `EDGE_API_TOKEN` and extend the `publish-edge`
   job with the product-ID–scoped POST to the Partner Center Ports API.

## Safari (Apple App Store / App Store Connect)

1. Requires an **Apple Developer Program** account.
2. Create an **App ID** that includes the extension (via Certificates, Identifiers
   & Profiles in the developer portal).
3. Create/re-use a **distribution certificate** and a **provisioning profile** for
   the wrapper app. These must be present in the CI runner's keychain for
   `xcodebuild ... build` to succeed (the CI job does not currently import them,
   so install them in the GitHub runner keychain when wiring this job up).
4. Create an **App Store Connect API key** (`https://appstoreconnect.apple.com/access/api`):
   - Download the `AuthKey_<id>.p8` file.
   - Set `APPLE_API_KEY` to its **base64** content:
     `base64 < AuthKey_<KEY_ID>.p8`
   - Set `APPLE_API_KEY_ID` to the key ID.
   - Set `APPLE_API_ISSUER` to the issuer ID.
5. The pipeline runs `wxt prepare -b safari`, builds the wrapper app with
   `xcodebuild ... -configuration Release` into `extension/.output/safari/build/Release/`,
   packages `ooshare.app` into `ooshare-safari.zip` with `ditto`, then
   `xcrun notarytool submit ooshare-safari.zip ... --wait` and
   `xcrun altool --upload-app -f build/Release/ooshare.app -t macos ...` to upload
   the app to App Store Connect.
   (Note: `notarytool` accepts a `.zip`/`.dmg`/`.pkg`, not an `.xcarchive`, so the
   wrapper is packaged with `ditto` before submission; and `altool --upload-app`
   targets the app bundle at `build/Release/ooshare.app`, not the archive.)
6. **Hosted code-signing is required.** Both `notarytool submit` and
   `altool --upload-app` need a distribution signing identity (certificate +
   private key) present in the runner's keychain so `xcodebuild` can codesign the
   app, and the provisioning profile must cover the bundle ID. The workflow does
   **not** install these automatically — provisioning the macOS runner's keychain
   with the distribution cert/profile is a human step that must be done before the
   `publish-safari` job can run. AWS CodeBuild/EC2 macOS runners are the usual
   place this is wired up; see the Apple "Export a signing certificate" guide to
   export the `.p12` and install it in the runner keychain.

## Store CI secrets (on dhdtech/ooshare.io)

```bash
gh secret set GOOGLE_CLIENT_ID      --repo dhdtech/ooshare.io
gh secret set GOOGLE_CLIENT_SECRET  --repo dhdtech/ooshare.io
gh secret set GOOGLE_REFRESH_TOKEN  --repo dhdtech/ooshare.io
gh secret set EXTENSION_ITEM_ID     --repo dhdtech/ooshare.io
gh secret set AMO_API_KEY           --repo dhdtech/ooshare.io
gh secret set AMO_API_SECRET        --repo dhdtech/ooshare.io
gh secret set APPLE_API_KEY         --repo dhdtech/ooshare.io
gh secret set APPLE_API_KEY_ID      --repo dhdtech/ooshare.io
gh secret set APPLE_API_ISSUER      --repo dhdtech/ooshare.io
gh secret set EDGE_API_TOKEN        --repo dhdtech/ooshare.io
```

## Troubleshooting

- **A store job did nothing (all its steps skipped)** → the job's first step
  (`Check … credentials configured`) found one or more secrets empty, so every
  publish step was skipped. Set the missing secret(s) above and re-push the tag
  (or re-run the workflow) — the job will then perform the publish.
- **`web-ext sign` fails with a 401/403** → re-generate the AMO API key; the secret
  pair must match a currently active key.
- **CWS keeps the previous version** → ensure `EXTENSION_ITEM_ID` matches the item
  and that at least one publish has been accepted by review.
- **Safari archive refuses to sign** → confirm the distribution cert + profile are
  installed in the runner keychain and the bundle ID matches the App ID.
