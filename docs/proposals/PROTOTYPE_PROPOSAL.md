# PROTOTYPE PROPOSAL: UniCore System Architecture & Specs

*(Stage 3 Proposal — Development in Progress)*

**Institutional Metadata:**  
**Institution:** Thapar Institute of Engineering & Technology, Patiala  
**Course:** UCS310 – Database Management Systems  

**Project Team:**
- **Ankit Rath** (Roll No. 1024030458)
- **Manan Kapoor** (Roll No. 1024030467)
- **Abhinav Kumar Singh** (Roll No. 1024030440)

---

## 1. Prototype Architecture Overview

UniCore Prototype is designed as a database-first 3-tier software architecture enforcing real-time transaction safeguards, PL/SQL trigger automation, role-based authentication, and immutable audit logging.

```
┌──────────────────────────────────────────────────────────┐
│                   Frontend Web Portal                    │
│            Responsive React SPA / CSS Styling            │
└────────────────────────────┬─────────────────────────────┘
                             │ REST API (JSON / HTTPS)
                             ▼
┌──────────────────────────────────────────────────────────┐
│                   API Backend Layer                      │
│             Node.js / Express Micro-Router               │
└────────────────────────────┬─────────────────────────────┘
                             │ Connection Pool (pg)
                             ▼
┌──────────────────────────────────────────────────────────┐
│                PostgreSQL 16 Database                    │
│      8 Domain Schemas | 35+ BCNF Tables | PL/SQL         │
└──────────────────────────────────────────────────────────┘
```

---

## 2. Implemented PL/SQL Components

```sql
-- 1. Library Fine Enforcement Trigger Function
CREATE OR REPLACE FUNCTION fine_block_trigger() 
RETURNS TRIGGER AS $$
DECLARE
    unpaid_fines NUMERIC;
BEGIN
    SELECT COALESCE(SUM(amount - paid_amount), 0) INTO unpaid_fines
    FROM library.fines
    WHERE member_id = NEW.member_id AND status = 'unpaid';

    IF unpaid_fines > 500 THEN
        RAISE EXCEPTION 'Book issuance blocked: Member has unpaid fines exceeding Rs. 500.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Atomic Hostel Allotment Stored Procedure
CREATE OR REPLACE PROCEDURE hostel.hostel_allot(
    p_student_id UUID,
    p_room_id UUID,
    p_academic_year TEXT
) AS $$
DECLARE
    v_bed_count INT;
    v_current_alloc INT;
BEGIN
    -- Lock room row to prevent concurrent double allocation
    SELECT bed_count INTO v_bed_count
    FROM hostel.hostel_rooms
    WHERE id = p_room_id FOR UPDATE;

    SELECT COUNT(*) INTO v_current_alloc
    FROM hostel.allocations
    WHERE room_id = p_room_id AND status = 'active';

    IF v_current_alloc >= v_bed_count THEN
        RAISE EXCEPTION 'Room allotment failed: Room capacity reached.';
    END IF;

    INSERT INTO hostel.allocations (student_id, room_id, academic_year, status)
    VALUES (p_student_id, p_room_id, p_academic_year, 'active');
END;
$$ LANGUAGE plpgsql;
```

---

## 3. Prototype Validation Strategy

1. **Concurrency Lock Validation:** Execute parallel HTTP POST requests targeting a single room with bed capacity 1. Verify exactly 1 request succeeds while remaining requests receive controlled error status codes.
2. **Trigger Enforcement Verification:** Insert an unpaid fine of Rs. 600 for a test student and attempt a book borrow transaction. Confirm `fine_block_trigger` aborts insertion.
3. **Audit Log Inspection:** Execute a grade modification and query `audit_logs` to confirm JSON before/after state diff generation.
