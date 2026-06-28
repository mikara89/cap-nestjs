# Changelog

## 2.2.0 (2026-06-27)

- Release the framework-free Prisma outbox and inbox adapter as a current
  first-party storage option.
- Use parameterized raw SQL with `Prisma.TransactionClient`, so applications do
  not need CAP models in their Prisma schema.
- Support PostgreSQL, MySQL/MariaDB, and SQLite schema initialization and pass
  the shared publish- and received-storage contract suites.
- Cover PostgreSQL and MySQL claim behavior with DB integration tests; keep
  SQLite as a local and single-process option.
- Keep shared SQL-core extraction deferred.
