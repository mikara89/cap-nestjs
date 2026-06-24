# Security Alert Triage

This note records the v2.1.1 dependency-alert handling.

| Package | Scope | Handling |
| --- | --- | --- |
| `multer` | runtime via `@nestjs/platform-express` | Fixed with an npm override to `2.2.0`. Do not mute runtime alerts for this package. |
| `undici` 6.x | development via `node-gyp` under release tooling | Fixed with a targeted npm override to `6.27.0`. |
| `undici` 8.x | development via `testcontainers` | Fixed with a targeted npm override to `8.5.0`. |
| `tar` | development via Lerna/npm tooling | Fixed with an npm override to `7.5.16`. |
| `js-yaml` | development via Lerna/Jest tooling | Fixed with an npm override to `4.2.0`. |
| `tmp` | development | Already fixed at `0.2.7`; no additional action unless the lockfile regresses. |
| `form-data` | development | Already fixed at `4.0.6`; no additional action unless the lockfile regresses. |

Recheck with:

```sh
npm explain multer
npm explain undici
npm explain tar
npm explain js-yaml
npm audit --omit=optional
```
