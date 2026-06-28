# Changelog

## 2.2.0 (2026-06-27)

- Release the framework-free Knex outbox and inbox adapter as a current
  first-party storage option.
- Support PostgreSQL, MySQL/MariaDB, and SQLite schema initialization, explicit
  `Knex.Transaction` contexts, and operation-context publishing.
- Pass the shared publish- and received-storage contract suites; report SQLite
  conservatively as unsuitable for safe multi-instance claiming.
- Keep shared SQL-core extraction deferred.
