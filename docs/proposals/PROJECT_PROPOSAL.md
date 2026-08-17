# PROJECT PROPOSAL: UniCore (Campus Operating Platform)

**Title of Proposal:**  
**UniCore: Centralized Campus Operating Platform & High-Concurrency Transaction Layer**

**Institutional Metadata:**  
**Institution:** Thapar Institute of Engineering & Technology, Patiala  
**Department:** Computer Science & Engineering Department (CSED)  
**Target Enrollment Scale:** 30,000+ Active Students  

**Project Team:**
- **Ankit Rath** (Roll No. 1024030458)
- **Manan Kapoor** (Roll No. 1024030467)
- **Abhinav Kumar Singh** (Roll No. 1024030440)

---

## 1. Elevator Pitch & Executive Summary

- **The Gap:** Modern educational institutions run student academics, residential hostel allotment, library circulation, and examination scheduling as disconnected, standalone system silos. This fragmentation creates severe data duplication, drifting records, room double-booking race conditions during peak rushes, and zero forensic auditability.
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

### 4.3 Unified Modeling Language (UML) Diagrams

#### 4.3.1 UML Use Case Diagram
The Use Case Diagram illustrates the interactions between primary system actors and core functional use cases provided by the UniCore platform:

```
                  ┌──────────────────────────────────────────────────────────────┐
                  │                 UniCore System Boundary                      │
                  │                                                              │
                  │   ┌───────────────────────┐      ┌───────────────────────┐   │
   ┌───────────┐  │   │ Enroll in Courses     │      │ Allot Hostel Bed      │   │
   │  Student  ├──┼──►│  (Academic Schema)    │      │    (Hostel Schema)    │◄──┼────┐───────────┐
   └───────────┘  │   └───────────────────────┘      └───────────────────────┘   │    │  Warden   │
                  │               ▲                              ▲               │    └───────────┘
                  │               │ <<include>>                  │ <<include>>   │
                  │   ┌───────────┴───────────┐      ┌───────────┴───────────┐   │
                  │   │ Verify Prerequisites  │      │ Lock Bed Capacity     │   │
                  │   └───────────────────────┘      └───────────────────────┘   │
                  │                                                              │
   ┌───────────┐  │   ┌───────────────────────┐      ┌───────────────────────┐   │  ┌─────────────┐
   │ Academic  ├──┼──►│ Post Semester Grades  │      │ Issue & Borrow Books  │◄──┼──┤ Library Off │
   │   Staff   │  │   │  (Academic Schema)    │      │   (Library Schema)    │   │  └─────────────┘
   └───────────┘  │   └───────────────────────┘      └───────────────────────┘   │
                  │               │                              │               │
                  │               │ <<include>>                  │ <<include>>   │
                  │               ▼                              ▼               │
                  │   ┌──────────────────────────────────────────────────────┐   │  ┌─────────────┐
                  │   │ Emit JSON Mutation Event to Audit Logs Ledger        │◄──┼──┤ System Admin│
                  │   │                   (Audit Schema)                     │   │  └─────────────┘
                  │   └──────────────────────────────────────────────────────┘   │
                  └──────────────────────────────────────────────────────────────┘
```

#### 4.3.2 UML Class & Data Entity Architecture Diagram
The Class Diagram models the core structural entities, domain attributes, and associations within the BCNF-normalized data layer:

```
┌─────────────────────────┐       1..* ┌─────────────────────────┐
│       User              │ ──────────►│      User_Role          │
├─────────────────────────┤            ├─────────────────────────┤
│ id: UUID                │            │ user_id: UUID           │
│ email: String           │            │ role_id: UUID           │
│ password_hash: String   │            └────────────┬────────────┘
│ user_type: Enum         │                         │ *..1
└──────────┬──────────────┘                         ▼
           │ 1..1                              ┌─────────────────────────┐
           ▼                                   │        Role             │
┌─────────────────────────┐                    ├─────────────────────────┤
│      Student            │                    │ id: UUID                │
├─────────────────────────┤                    │ name: String            │
│ id: UUID                │                    └─────────────────────────┘
│ roll_number: String     │
│ department_id: UUID     │
│ current_cgpa: Numeric   │
└──────────┬──────────────┘
           │
           ├─────────────────────────┬─────────────────────────┐
           │ 1..*                    │ 1..*                    │ 1..*
           ▼                         ▼                         ▼
┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────┐
│     Enrollment          │ │    Bed_Allocation       │ │     Borrow_Record       │
├─────────────────────────┤ ├─────────────────────────┤ ├─────────────────────────┤
│ id: UUID                │ │ id: UUID                │ │ id: UUID                │
│ student_id: UUID        │ │ student_id: UUID        │ │ member_id: UUID         │
│ course_id: UUID         │ │ room_id: UUID           │ │ book_copy_id: UUID      │
│ grade: String           │ │ academic_year: String   │ │ issue_date: Timestamp   │
└─────────────────────────┘ │ status: Enum            │ │ due_date: Timestamp     │
                            └────────────┬────────────┘ └─────────────────────────┘
                                         │ *..1
                                         ▼
                            ┌─────────────────────────┐
                            │      Hostel_Room        │
                            ├─────────────────────────┤
                            │ id: UUID                │
                            │ hostel_id: UUID         │
                            │ room_number: String     │
                            │ bed_count: Integer      │
                            └─────────────────────────┘
```

#### 4.3.3 UML Sequence Diagram: Atomic Allotment & Audit Ledger Execution
This Sequence Diagram illustrates the high-concurrency execution flow during bed allotment under pessimistic locking (`SELECT FOR UPDATE`) and automated PL/SQL trigger emission:

```
 Client App               REST API Gateway           PostgreSQL Engine        Hostel Room Row           Audit Logs Store
     │                          │                           │                        │                         │
     │── 1. POST /hostel/allot ─►│                           │                        │                         │
     │   (student_id, room_id)  │── 2. Begin Transaction ───►│                        │                         │
     │                          │   & Call hostel_allot()   │                        │                         │
     │                          │                           │── 3. SELECT FOR UPDATE►│                         │
     │                          │                           │   (Pessimistic Lock)   │                         │
     │                          │                           │◄── 4. Lock Acquired ───│                         │
     │                          │                           │                        │                         │
     │                          │                           │── 5. Check Bed Count ──┤                         │
     │                          │                           │   Current < Capacity?  │                         │
     │                          │                           │                        │                         │
     │                          │                           │── 6. INSERT Allocation ┼─────────────────────────►│
     │                          │                           │      (Status: Active)  │                         │
     │                          │                           │                        │  7. AFTER INSERT Trigger│
     │                          │                           │                        │── Emits JSON State Diff─►│
     │                          │                           │                        │   (Write Audit Log)     │
     │                          │   8. Commit Transaction   │                        │                         │
     │                          │◄──────────────────────────┤                        │                         │
     │◄── 9. HTTP 201 Created ──│                           │                        │                         │
     │   (Allocation Confirmed) │                           │                        │                         │
```

#### 4.3.4 UML Component & Deployment Diagram
The Component & Deployment Diagram displays the physical and logical software nodes across UniCore's 3-tier architecture:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 Client Node / Web Browser                              │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │                        React 18 Single Page Application (SPA)                     │  │
│  │   [ Dashboard Component ]  [ Allotment Module ]  [ Audit Trail Visualizer ]    │  │
│  └──────────────────────────────────────────┬───────────────────────────────────────┘  │
└─────────────────────────────────────────────┼──────────────────────────────────────────┘
                                              │ HTTPS / REST (JSON API)
                                              ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              Application Server (Node.js Engine)                       │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │                            Express API Router Gateway                            │  │
│  │   [ Auth / JWT Middleware ]  [ RBAC Scope Validator ]  [ Connection Pool (pg) ]  │  │
│  └──────────────────────────────────────────┬───────────────────────────────────────┘  │
└─────────────────────────────────────────────┼──────────────────────────────────────────┘
                                              │ Connection Pool Socket
                                              ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              PostgreSQL 16 System of Record Server                     │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │                              Database Engine Host                                │  │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌──────────┐  │  │
│  │  │   Auth Schema    │  │  Hostel Schema   │  │ Academic Schema  │  │ Audit    │  │  │
│  │  │ (35+ BCNF Tables)│  │ (hostel_allot()) │  │  (SGPA Triggers) │  │ Schema   │  │  │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────┘  └──────────┘  │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

#### 4.3.5 UML State Machine Diagram: Bed Allocation Transaction Lifecycle
The State Machine Diagram documents the lifecycle transitions of a hostel bed allocation:

```
 [ Initial State ]
         │
         ▼
┌─────────────────┐       Request Received & Pessimistic Lock Acquired
│    REQUESTED    ├─────────────────────────────────────────┐
└────────┬────────┘                                         │
         │ Capacity Available                               │ Capacity Exceeded / Fine Blocked
         ▼                                                  ▼
┌─────────────────┐       Student Checkout / Cancel   ┌─────────────────┐
│     ACTIVE      ├──────────────────────────────────►│    CANCELLED    │
└────────┬────────┘                                   └─────────────────┘
         │ Academic Year Finished                           ▲
         ▼                                                  │
┌─────────────────┐                                         │
│    COMPLETED    ├─────────────────────────────────────────┘
└─────────────────┘
```

---

### 4.4 Data Flow Diagrams (DFDs)

#### 4.4.1 DFD Level 0 (Context Diagram)
The DFD Level 0 Context Diagram establishes the macro system boundaries and key data exchanges between external campus entities and the UniCore Platform:

```
                    Student Credentials / Room Choice Requests / Fine Queries
           ┌────────────────────────────────────────────────────────────────────────┐
           │                                                                        │
           ▼                                                                        │
    ┌─────────────┐       Room Allotment Receipts, SGPA Statements, Fine Alerts     │
    │   Student   │◄────────────────────────────────────────────────────────────────┤
    └─────────────┘                                                                 │
                                                                                    │
                                                                                    │
    ┌─────────────┐       Grade Postings, Course Offerings, Exam Roster Approvals   │
    │  Academic   ├─────────────────────────────────────────────────────────────────┼──┐
    │    Staff    │◄────────────────────────────────────────────────────────────────┤  │
    └─────────────┘         Class Roster Reports, SGPA Calculation Outputs          │  │
                                                                                       │
                                                                                       │
                                                                                       ▼
    ┌─────────────┐       Hostel Capacity Updates, Room Maintenance Work Orders    ┌─────────────────────────┐
    │   Hostel    ├───────────────────────────────────────────────────────────────►│                         │
    │   Warden    │◄───────────────────────────────────────────────────────────────┤    UniCore Campus       │
    └─────────────┘         Bed Occupancy Matrices, Allotment Audit Logs           │   Operating Platform    │
                                                                                   │   (Central Layer)       │
                                                                                   │                         │
    ┌─────────────┐       Book Circulation Transactions, Fine Clearances           │                         │
    │ Library Off ├───────────────────────────────────────────────────────────────►│                         │
    │   Member    │◄───────────────────────────────────────────────────────────────┤                         │
    └─────────────┘         Borrow Receipts, Overdue Block Notices                 └─────────────────────────┘
                                                                                       ▲
                                                                                       │
    ┌─────────────┐       System Configs, RBAC Scoping, User Account Actions           │
    │   System    ├────────────────────────────────────────────────────────────────────┘
    │  Admin      │◄────────────────────────────────────────────────────────────────────
    └─────────────┘         Forensic Audit Ledgers, System Event Diagnostics
```

#### 4.4.2 DFD Level 1 (System-Level Process Flow Diagram)
The DFD Level 1 diagram details data transformation paths across the system's primary sub-processes and normalized data stores:

```
  External Entities             Sub-Processes                                       Data Stores
  
  ┌─────────────┐        1.0 User Authentication     ┌────────────────────────┐    ┌────────────────────────┐
  │  Students / ├───────►  & RBAC Verification  ────►│ Verify Session & Token ├───►│  D1: Auth & Users      │
  │    Staff    │        └──────────┬─────────────┘    └────────────────────────┘    └────────────────────────┘
  └─────────────┘                   │
                                    │ Authenticated Context & Scoped Perms
                                    ▼
                         2.0 Academic Management     ┌────────────────────────┐    ┌────────────────────────┐
                         │   & Grade Engine       ──►│ Compute SGPA / CGPA    ├───►│  D2: Academic Records  │
                         └──────────┬─────────────┘    └────────────────────────┘    └────────────────────────┘
                                    │
                                    │ Student Eligibility State
                                    ▼
                         3.0 Hostel Allotment        ┌────────────────────────┐    ┌────────────────────────┐
                         │   & Lock Engine        ──►│ Pessimistic Row Lock   ├───►│  D3: Hostel Allotments │
                         └──────────┬─────────────┘    └────────────────────────┘    └────────────────────────┘
                                    │
                                    │ Room Capacity & Allocation Event
                                    ▼
                         4.0 Library Circulation     ┌────────────────────────┐    ┌────────────────────────┐
                         │   & Fine Control       ──►│ Fine Check (< Rs 500)  ├───►│  D4: Library Records   │
                         └──────────┬─────────────┘    └────────────────────────┘    └────────────────────────┘
                                    │
                                    │ Mutation Event (State Diff)
                                    ▼
                         5.0 Forensic Audit          ┌────────────────────────┐    ┌────────────────────────┐
                         │   Ledger Engine        ──►│ Write JSON Audit Record├───►│  D5: Audit Ledger Logs │
                         └────────────────────────┘    └────────────────────────┘    └────────────────────────┘
```

#### 4.4.3 DFD Level 2 (Detailed Process Flow for High-Concurrency Bed Allotment & Audit)
DFD Level 2 decomposes Process 3.0 (Hostel Allotment) and Process 5.0 (Forensic Audit Logging) into specific procedural steps, data checks, and locks:

```
                                    Process 3.0: Hostel Allotment Deep-Dive
                                    
 ┌──────────────┐    3.1 Parse Request    ┌──────────────┐    3.2 Execute Lock     ┌──────────────┐
 │ Allotment    ├───►   & Member ID   ───►│ Check Active ├───► SELECT FOR UPDATE   ├───► Row Locked│
 │ Request Payload   └──────────────┘    │ Fine Balance │    │ on hostel_rooms    │    in DB     │
 └──────────────┘                         └──────┬──────┘    └──────────┬─────────┘    └──────┬───────┘
                                                 │                      │                     │
                                         Unpaid Fine > 500              │ Capacity Available  │
                                                 │                      ▼                     │
                                                 ▼             3.3 Insert Allocation          │
                                          ┌──────────────┐        Record (Status: Active)     │
                                          │ Abort & Return│    └──────────┬──────────────┘    │
                                          │ Exception    │               │                    │
                                          └──────────────┘               │                    │
                                                                         ▼                    │
                                                               Process 5.0: Audit Logging     │
                                                                         │                    │
                                                             3.4 AFTER INSERT Trigger Fires   │
                                                             ┌───────────┴───────────┐        │
                                                             │ Generate JSON State   │◄───────┘
                                                             │ Diff (Old vs New)     │
                                                             └───────────┬───────────┘
                                                                         │
                                                                         ▼
                                                             ┌───────────────────────┐
                                                             │ Append Immutable Row  │
                                                             │ to audit_logs Store   │
                                                             └───────────────────────┘
```

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

- **Project Engineering Team:**
  - Ankit Rath
  - Manan Kapoor
  - Abhinav Kumar Singh
- **Engine Availability & Infrastructure:** Mature, production-ready components are utilized (PostgreSQL 16 relational database engine, Node.js runtime, Git version control).
- **Budget:** **No external funding required.** All development, testing, and database execution run on existing university laboratory infrastructure and local computing resources.

---

## 7. Risk Assessment & Mitigation Strategies

| Identified Risk | Risk Impact | Proposed Mitigation Strategy |
| :--- | :--- | :--- |
| **High Lock Contention** | High (Transaction Retries) | Implement pessimistic `SELECT FOR UPDATE` under `READ COMMITTED` with short transaction boundaries. |
| **Data Privacy & Scope** | Medium (Unauthorized Access) | Enforce strict RBAC permission scoping at API middleware layer and soft-delete historical preservation. |
| **Measurement Ambiguity** | Medium (Evaluation Errors) | Instrument automated UTC timestamps in database `AFTER` triggers prior to execution. |
