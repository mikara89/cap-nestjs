# Changelog

## 2.3.0 (2026-06-27)

- Release the framework-free Knex outbox and inbox adapter as a current
  first-party storage option.
- Support PostgreSQL, MySQL/MariaDB, and SQLite schema initialization, explicit
  `Knex.Transaction` contexts, and operation-context publishing.
- Pass the shared publish- and received-storage contract suites; report SQLite
  conservatively as unsuitable for safe multi-instance claiming.
- Cover PostgreSQL and MySQL schema initialization, concurrent claiming,
  atomic inbox deduplication, transactions, rollback, capabilities, and expired
  claim release with Testcontainers.
- Keep shared SQL-core extraction deferred.

## 2.2.0

- add Knex publish and received storage adapter
- add Knex schema initialization helper
- add conservative storage capabilities and transaction manager
- run shared publish and received storage contract suites
