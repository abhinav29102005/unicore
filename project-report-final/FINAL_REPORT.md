# Technical Master Report: UniCore (Campus Operating Platform)

*(Stage 3 Technical Report)*

**Institutional Metadata:**  
**Institution:** Thapar Institute of Engineering & Technology, Patiala  
**Department:** Department of Computer Science & Engineering (CSED)  
**Target Scale:** 30,000+ Active Students  

**Project Team:**
- **Ankit Rath** (Roll No. 1024030458)
- **Manan Kapoor** (Roll No. 1024030467)
- **Abhinav Kumar Singh** (Roll No. 1024030440)

---

## 1. Introduction

Modern universities manage multiple operational systems — student records, hostel allocation, library management, and examination processing. Handling these through disconnected or manual processes leads to data redundancy, inconsistency, and security risks. 

This project delivers a centralized campus operating platform (UniCore) built on PostgreSQL, consolidating all critical operations into a single, cohesive system scalable to 30,000+ students with strict transactional integrity and full auditability.

---

## 2. Problem Statement

Existing fragmented systems introduce five severe operational failure modes:
1. **Data Duplication:** Redundant entries across modules — e.g. address data stored separately in hostel and student records.
2. **Inconsistency:** Mismatched records when a student updates details in one system but not another.
3. **Resource Tracking:** Difficult manual tracking of room availability and library asset circulation.
4. **Transaction Hazards:** Risk of double-allocating rooms or exam seats during peak registration windows.
5. **Security Gaps:** No unified role-based access control — any staff member can access any module.

---

## 3. Scope & Module Boundaries

| Module | Core Responsibility | Key Entities |
| :--- | :--- | :--- |
| **Academic** | Profiles, CGPA tracking, departmental branching | `faculties`, `departments`, `courses`, `students`, `enrollments`, `grades` |
| **Hostel** | Automated room allotment and maintenance tracking | `hostels`, `hostel_rooms`, `allocations`, `wardens`, `maintenance_requests` |
| **Library** | Inventory management, circulation, fine validation | `books`, `authors`, `members`, `borrow_records`, `fines` |
| **Exam** | Scheduling, invigilation, grading engine | `exams`, `exam_schedules`, `exam_results`, `exam_invigilators`, `grading_policies` |
| **Auth** | Role-based access and session management | `users`, `roles`, `permissions`, `user_roles`, `role_permissions`, `refresh_tokens` |
| **Audit** | Mutation forensics and login tracking | `audit_logs`, `login_logs`, `system_events` |
| **Admin** | Staff, assets, events, announcements | `departments`, `staff`, `leaves`, `assets`, `maintenance_logs`, `announcements` |
| **Core** | Geographic hierarchy and system settings | `countries`, `states`, `cities`, `addresses`, `institutions`, `contacts`, `settings` |

---

## 4. Normalization & Schema Design

### Normalization Proof Matrix

| Normal Form | Condition Verified | Action Taken |
| :--- | :--- | :--- |
| **1NF** | All attributes atomic; no repeating groups | Removed multi-valued contact strings; decomposed into `addresses` table |
| **2NF** | No partial dependency on composite key | Isolated `Room_Type` lookup; enrollment PK is (`student_id`, `course_id`, `semester_id`) |
| **3NF** | No transitive dependencies | Moved department details out of staff table; `dean_name` lives in `faculties` |
| **BCNF** | Every determinant is a candidate key | Separated `grading_policies` to break mark-range to letter-grade transitive path |

---

## 5. Conclusion

The UniCore Campus Operating Platform directly addresses the fundamental shortcomings of fragmented university administration through strict BCNF normalization, PL/SQL automation, and immutable audit logging.
