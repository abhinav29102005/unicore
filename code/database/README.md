# UniCore Database System of Record (PostgreSQL & Spring Data JPA)

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

## Canonical Schema DDL
- **`V001_to_V019.sql`**: Full PostgreSQL DDL specifying all schemas, tables, constraints, foreign keys, and indexes.
- **`schema.sql`**: Unified relational schema used for JPA entity mapping.
- **`dummy_data.sql`**: Sample inserts for testing students, hostels, enrollments, and library tables.

## Running Database Locally

### 1. PostgreSQL (via Docker Compose)
```bash
cd code && docker compose up -d
```
Exposes PostgreSQL 15 on port `5433` (database: `unicore`, user: `postgres`, password: `password`).

### 2. Spring Boot Integration
The Java Spring Boot backend connects to this PostgreSQL instance by default. It also provides an in-memory `h2` profile for zero-dependency execution. Seeding is available via the backend API:
```bash
curl -X POST http://localhost:8080/api/seed
```
