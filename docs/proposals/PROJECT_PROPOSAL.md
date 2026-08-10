# PROJECT PROPOSAL: UniCore (Campus Operating Platform)

**Title of Proposal:**  
**UniCore: Centralized Campus Operating Platform & High-Concurrency Transaction Layer**

**Institutional Metadata:**  
**Institution:** Thapar Institute of Engineering & Technology, Patiala  
**Department:** Computer Science & Engineering Department (CSED)  
**Course:** UCS310 – Database Management Systems  
**Target Enrollment Scale:** 30,000+ Active Students  

**Project Team & Roles:**
- **Ankit Rath** (Roll No. 1024030458) — *Systems Architect & Concurrency Specialist*
- **Manan Kapoor** (Roll No. 1024030467) — *Database Schema & BCNF Normalization Specialist*
- **Abhinav Kumar Singh** (Roll No. 1024030440) — *API Middleware & PL/SQL Audit Pipeline Engineer*

---

## 1. Elevator Pitch & Executive Summary

- **The Gap:** Modern educational institutions run student academics, hostel allotment, library circulation, and examination scheduling as disconnected, standalone system silos. This fragmentation creates severe data duplication, drifting records, room double-booking race conditions during peak rushes, and zero forensic auditability.
- **The Solution:** UniCore provides a centralized, database-first operating platform built on PostgreSQL. It consolidates all institutional workflows under 8 domain schemas and 35+ Boyce-Codd Normal Form (BCNF) tables, governed by atomic row-level locks (`SELECT FOR UPDATE`), automated PL/SQL triggers, and immutable JSON audit ledgers.
- **The Impact:** UniCore eliminates administrative overhead, guarantees 100% ACID transaction safety during concurrent enrollment rushes, and achieves a target Time-To-Acknowledgement (TTA) of $\le 2$ hours for operational requests across 30,000+ students.

---

## 2. Introduction & Problem Statement

### Context & Operational Relevance
Modern university administrative workflows suffer from extreme fragmentation. Student profiles, residential hostel bed allocations, library book inventories, and exam marks are entered and managed in separate software tools. As campus enrollment scales past 30,000 students, manual inter-department coordination fails, yielding five recurring failure modes:

```
┌──────────────────────────────────────────────────────────┐
│             Disconnected System Silos                    │
└───────────┬──────────────┬──────────────┬────────────────┘
            │              │              │
            ▼              ▼              ▼
┌──────────────────┐┌──────────────┐┌──────────────┐┌──────────────┐
│ Data Duplication ││Inconsistency ││ Resource     ││ Transaction  │
│ (Address/Contact)││(Drifting Rec)││ Tracking Err ││ Hazards/Races│
└──────────────────┘└──────────────┘└──────────────┘└──────────────┘
```

1. **Data Duplication:** Redundant identity and address records entered separately across hostel, library, and student registrar databases.
2. **Data Inconsistency:** Mismatched student profiles when details update in one department portal but fail to propagate to others.
3. **Resource Tracking Errors:** Manual, error-prone tracking of bed availability, room statuses, and library book copies.
4. **Transaction Hazards (Race Conditions):** Concurrent HTTP requests during peak room-allotment windows result in double-allocating hostel beds or overbooking exam hall seats.
5. **Security & Audit Gaps:** Unscoped administrative permissions allow unauthorized modifications without traceable actor logs.

---

## 3. SMART Project Objectives

```
  Specific ──────► Centralized PostgreSQL platform with 8 domain BCNF schemas
  Measurable ───► Median TTA <= 2 hrs, 0 double-booking errors under load
  Attainable ───► 12-Week milestone plan with modular database-first architecture
  Relevant ─────► Solves campus operational fragmentation at 30k student scale
  Time-Bound ───► Phased deliverables with week-by-week verification benchmarks
```

### Primary Objective
To design, implement, and benchmark a unified, BCNF-normalized PostgreSQL database operating platform for 30,000+ active students that eliminates data redundancy, guarantees ACID transaction safety during peak concurrent rushes, and records immutable audit ledgers.

### Specific Sub-Goals
1. **BCNF Schema Normalization:** Decompose 35+ relational tables across 8 domain schemas (`Auth`, `Audit`, `Academic`, `Hostel`, `Library`, `Exam`, `Admin`, `Core`) strictly into Boyce-Codd Normal Form.
2. **Atomic Concurrency Control:** Enforce row-level locking (`SELECT FOR UPDATE`) and PostgreSQL advisory locks within PL/SQL stored procedures (`hostel_allot()`) to guarantee zero double-booking under 10,000+ concurrent requests.
3. **Automated Business Rules:** Implement PL/SQL `BEFORE INSERT` triggers to block invalid operations (e.g. blocking book issuance if unpaid fines exceed Rs. 500) and `AFTER` triggers to emit JSON before/after state diffs to an immutable `audit_logs` table.
4. **Empirical Performance Benchmarking:** Evaluate transaction throughput (TPS), latency percentiles (p95/p99), and write amplification under simulated high-concurrency loads using `pgBench`.

---

## 4. Engineering Methodology & System Architecture

UniCore follows a 3-tier engineering methodology tailored for robust software systems:

```
┌──────────────────────────────────────────────────────────┐
│                 Tier 1: Responsive Web UI                │
│    (Citizen/Student Portal, Staff Workflow, Admin)       │
└────────────────────────────┬─────────────────────────────┘
                             │ REST API (JSON / HTTPS)
                             ▼
┌──────────────────────────────────────────────────────────┐
│                 Tier 2: Backend REST API                 │
│      (Auth Middleware, RBAC Scoping, Business Logic)     │
└────────────────────────────┬─────────────────────────────┘
                             │ Connection Pooling (pg)
                             ▼
┌──────────────────────────────────────────────────────────┐
│            Tier 3: PostgreSQL 16 System of Record        │
│   (8 Schemas, 35+ BCNF Tables, PL/SQL Triggers, Locks)   │
└──────────────────────────────────────────────────────────┘
```

### 4.1 Module Breakdown & Domain Schematics
- **Auth Schema:** Unified identity, `users` super-type entity, password hashing, RBAC junction tables (`roles`, `permissions`, `user_roles`, `role_permissions`), session revocation.
- **Audit Schema:** Immutable forensic ledger (`audit_logs`), actor identity, UTC timestamps, JSON `change_details`, `login_logs`.
- **Academic Schema:** Department hierarchy, courses, student profiles, semester enrollments, grades, dynamic SGPA functions.
- **Hostel Schema:** Hostels, room types, bed capacities, allocations, warden assignments, maintenance work orders.
- **Library Schema:** Publishers, categories, book titles, physical copies, member borrowing, automated fine calculation.
- **Exam Schema:** Schedules, hall capacities, invigilator rosters, grading policies.
- **Admin & Core Schemas:** Staff leaves, asset maintenance, geographic hierarchy (`countries` -> `states` -> `cities` -> `addresses`), global settings.

### 4.2 Concurrency Safeguards & Isolation Matrix

| Operational Scenario | Isolation Level | Technical Mechanism | Enforced Guarantee |
| :--- | :--- | :--- | :--- |
| **Hostel Bed Allotment** | `SERIALIZABLE` | `SELECT FOR UPDATE` on room row | Zero double-booking of beds |
| **Exam Seat Registration** | `READ COMMITTED` | `pg_advisory_xact_lock(exam_id)` | Hall seat capacity never exceeded |
| **Library Book Circulation** | `READ COMMITTED` | In-transaction decrement | Copy count never drops below 0 |
| **Grade Record Updates** | `READ COMMITTED` | `UPSERT` (`ON CONFLICT DO UPDATE`) | Updates existing row; zero duplicate rows |

---

## 5. Project Timeline & Phase Deliverables

| Phase / Weeks | Technical Task Focus | Key Milestone & Deliverable |
| :--- | :--- | :--- |
| **Weeks 1–3** | Literature Review, Domain Requirements & ER Modeling | 8-Domain ER Schematic & Proposal Approval |
| **Weeks 4–6** | BCNF Normalization & PostgreSQL DDL Schema Setup | 35+ BCNF Tables Created with Foreign Key Constraints |
| **Weeks 7–8** | PL/SQL Triggers, Stored Procedures & Row Locking | `hostel_allot()`, `fine_block_trigger`, `audit_mutation()` |
| **Weeks 9–10** | REST API Integration & Concurrency Benchmarking | `pgBench` Concurrency Suite & TPS Latency Metrics |
| **Weeks 11–12** | End-to-End System Testing & Documentation | Final Evaluation Report & Staging Bundle |

---

## 6. Resources & Budget

- **Human Resources:**
  - *Ankit Rath:* Concurrency control, transaction isolation, and load benchmarking.
  - *Manan Kapoor:* Relational algebra, BCNF decomposition proofs, and schema normalization.
  - *Abhinav Kumar Singh:* REST API middleware, RBAC security scoping, and PL/SQL audit trigger integration.
- **Engine Availability & Infrastructure:** Mature, production-ready components are utilized (PostgreSQL 16 relational database engine, Node.js runtime, Git version control).
- **Budget:** **No external funding required.** All development, testing, and database execution run on existing university laboratory infrastructure and local computing resources.

---

## 7. Risk Assessment & Mitigation Strategies

| Identified Risk | Risk Impact | Proposed Mitigation Strategy |
| :--- | :--- | :--- |
| **High Lock Contention** | High (Transaction Retries) | Implement pessimistic `SELECT FOR UPDATE` under `READ COMMITTED` with short transaction boundaries. |
| **Data Privacy & Scope** | Medium (Unauthorized Access) | Enforce strict RBAC permission scoping at API middleware layer and soft-delete historical preservation. |
| **Measurement Ambiguity** | Medium (Evaluation Errors) | Instrument automated UTC timestamps in database `AFTER` triggers prior to execution. |
