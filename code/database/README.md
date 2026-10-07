# UniCore Database System of Record (PostgreSQL)

This directory contains the BCNF-normalized relational database schemas, DDL scripts, PL/SQL stored procedures, and automated triggers.

## 8 Domain Schemas
1. `auth` — Super-type users, RBAC junction tables.
2. `audit` — Immutable `audit_logs` and state diff ledger.
3. `academic` — Faculties, departments, courses, students, SGPA functions.
4. `hostel` — Hostels, rooms, bed capacities, allocation procedures (`hostel_allot()`).
5. `library` — Books, members, borrow records, fine enforcement triggers.
6. `exam` — Schedules, capacities, invigilation, grading policies.
7. `admin` — Staff, leaves, maintenance work orders.
8. `core` — Geographic hierarchy and global configuration settings.

## Test / Dummy Data
For development and UI testing purposes, dummy data can be inserted using the scripts provided. This allows developers to test the frontend dashboards without needing access to the production databases.

- **`dummy_data.sql`**: Contains sample inserts for the `students`, `hostels`, `enrollments`, and `library` tables.

*Note: For security reasons, never store production database connection strings, libSQL/Turso URLs, or Authentication Tokens in this repository.*
