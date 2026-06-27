# npm Release Guide

CAP packages are public on npmjs at `https://registry.npmjs.org/`. Consumers can
install them without a token or custom `.npmrc`:

```sh
npm install @mikara89/cap-core
```

GitHub Packages is deprecated for this repository and receives no new releases.
Historical GitHub Packages versions are not claimed to have been removed.

## Release Policy

- Packages keep the `@mikara89/*` names and are versioned independently.
- A registry migration is not a reason to change a package version.
- The workflow publishes current manifest versions only. It does not bump
  versions, force-publish, create git tags, or create a repository-wide release.
- An existing npmjs name/version is skipped. Registry errors fail the run.
- `release-plan.json` is the fail-closed package and registry allowlist.
- `.github/workflows/release.yml` is the only publishing workflow. It runs only
  through `workflow_dispatch` and waits at the protected `npm-production`
  environment before its publish job starts.

Before enabling releases, configure required reviewers on the
`npm-production` GitHub environment. Keep the runner GitHub-hosted. The workflow
pins Node 22.14.0 and npm 11.5.1, satisfying npm trusted publishing's Node
22.14+ and npm 11.5.1+ requirements.

## First npm Bootstrap

The bootstrap is a one-time migration of all 14 current package manifests to
npmjs. It verifies exact discovery, public npm publish settings, lockfile
versions, repository metadata, every internal package range, and dependency
order. It publishes missing current versions with `--access public` and the
`latest` dist-tag. It does not modify versions or create tags.

1. Create a short-lived npm granular access token that can create and publish
   public packages in the `@mikara89` scope.
2. Add it to the `npm-production` GitHub environment as the `NPM_TOKEN` secret.
3. Open **Actions > Release > Run workflow** on the intended commit.
4. Set `bootstrap_npm` to `true`.
5. Enter the exact `bootstrap_confirmation` value `PUBLISH_ALL_TO_NPM`.
6. Approve the `npm-production` environment after reviewing the validation job
   and its 14-package candidate list.
7. Verify all packages and their `latest` dist-tags on npmjs.

If discovery differs from the 14 names in `release-plan.json`, confirmation is
not exact, an internal dependency is invalid, or npmjs cannot enumerate public
versions, the workflow stops before publishing. Packages already present at
their manifest version are skipped.

## Normal Independent Release

Normal runs are intentionally restricted to the five-package allowlist:

- `@mikara89/cap-nest`
- `@mikara89/cap-storage-mikro-orm`
- `@mikara89/cap-transport-azure-servicebus`
- `@mikara89/cap-transport-nestjs-microservices`
- `@mikara89/cap-dashboard`

Prepare and review the selected package's version, dependency ranges, and
changelog in a normal pull request. Do not bump unrelated packages. After that
change is merged, run the Release workflow with `bootstrap_npm` set to `false`
and choose `release_package`. The workflow verifies that required internal
versions exist publicly, then publishes only the selected current manifest
version with the `latest` dist-tag. It skips that release if the exact version
already exists. Ordinary independent releases do not use a global release tag.

## Move From the Bootstrap Token to Trusted Publishing

Initial publication uses:

```yaml
NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

The workflow never prints the token. After bootstrap, configure a trusted
publisher on every npm package with these exact values:

- Provider: GitHub Actions
- Organization or user: `mikara89`
- Repository: `cap-nodejs`
- Workflow filename: `release.yml`
- Environment: `npm-production`

The full workflow path in this repository is `.github/workflows/release.yml`.
It runs on a GitHub-hosted runner and grants the publish job `id-token: write`.
After all 14 trusted publishers are configured, remove `NPM_TOKEN` from GitHub
and revoke the temporary token on npm. Future runs then use npm OIDC trusted
publishing. Never keep both mechanisms longer than the migration requires.

## Validation

Run the same local gates before a release:

```sh
npm install
npm audit --omit=dev
npm run lint:check
npm run build
npm test -- --runInBand
npm run examples:check
npm run docs:api
npm run test:integration:db
npm run pack:dry-run
```

Review package dry-run output and confirm it contains only intended files. The
database gate uses PostgreSQL and MySQL containers and therefore requires a
working Docker-compatible container runtime.
