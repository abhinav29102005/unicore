CREATE TABLE auth_permissions (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"code" text NOT NULL CONSTRAINT "uq_permissions_code" UNIQUE,
	"description" text,
	"module" text NOT NULL,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE auth_refresh_tokens (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"user_id" TEXT NOT NULL,
	"token_hash" text NOT NULL,
	"device_info" text,
	"ip_address" text,
	"expires_at" TEXT NOT NULL,
	"revoked_at" TEXT,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE auth_role_permissions (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"role_id" TEXT NOT NULL,
	"permission_id" TEXT NOT NULL,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "uq_role_permission" UNIQUE("role_id","permission_id")
);

CREATE TABLE auth_roles (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"code" text NOT NULL CONSTRAINT "uq_roles_code" UNIQUE,
	"name" text NOT NULL,
	"description" text,
	"scope_type" text,
	"is_system" INTEGER DEFAULT false NOT NULL,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "roles_scope_type_check" CHECK ((scope_type IN ('global', 'department', 'hostel', 'library')))
);

CREATE TABLE auth_user_roles (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"user_id" TEXT NOT NULL,
	"role_id" TEXT NOT NULL,
	"scope_id" TEXT UNIQUE,
	"granted_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"granted_by" TEXT,
	"revoked_at" TEXT,
	CONSTRAINT "uq_user_role_scope" UNIQUE("user_id","role_id","scope_id")
);

CREATE TABLE auth_users (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"email" text NOT NULL,
	"phone" text,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"password_hash" text NOT NULL,
	"password_algo" text DEFAULT 'bcrypt' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"last_login_at" TEXT,
	"failed_login_count" integer DEFAULT 0 NOT NULL,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" TEXT,
	"version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "users_status_check" CHECK ((status IN ('pending', 'active', 'locked', 'disabled')))
);

CREATE TABLE academic_course_offerings (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"course_id" TEXT NOT NULL,
	"semester_id" TEXT NOT NULL,
	"section_code" text DEFAULT 'A' NOT NULL,
	"primary_faculty_id" TEXT,
	"capacity" integer NOT NULL,
	"enrollment_count" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'scheduled' NOT NULL,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "uq_offering" UNIQUE("course_id","semester_id","section_code"),
	CONSTRAINT "course_offerings_capacity_check" CHECK ((capacity > 0)),
	CONSTRAINT "course_offerings_enrollment_count_check" CHECK ((enrollment_count >= 0)),
	CONSTRAINT "course_offerings_status_check" CHECK ((status IN ('scheduled', 'ongoing', 'completed', 'cancelled')))
);

CREATE TABLE academic_courses (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"course_code" text NOT NULL CONSTRAINT "uq_course_code" UNIQUE,
	"title" text NOT NULL,
	"description" text,
	"credits" INTEGER NOT NULL,
	"department_id" TEXT NOT NULL,
	"course_type" text DEFAULT 'core' NOT NULL,
	"prerequisite_id" TEXT,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" TEXT,
	CONSTRAINT "courses_course_type_check" CHECK ((course_type IN ('core', 'elective', 'lab', 'project', 'seminar'))),
	CONSTRAINT "courses_credits_check" CHECK (((credits >= 1) AND (credits <= 12)))
);

CREATE TABLE academic_departments (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"code" text NOT NULL CONSTRAINT "uq_dept_code" UNIQUE,
	"name" text NOT NULL,
	"established_year" INTEGER,
	"head_faculty_id" TEXT,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" TEXT
);

CREATE TABLE academic_enrollments (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"student_id" TEXT NOT NULL,
	"course_offering_id" TEXT NOT NULL,
	"enrollment_status" text DEFAULT 'enrolled' NOT NULL,
	"registered_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"withdrawn_at" TEXT,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "uq_enrollment" UNIQUE("student_id","course_offering_id"),
	CONSTRAINT "enrollments_enrollment_status_check" CHECK ((enrollment_status IN ('enrolled', 'withdrawn', 'completed', 'failed')))
);

CREATE TABLE academic_faculty (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"user_id" TEXT NOT NULL,
	"employee_no" text NOT NULL CONSTRAINT "uq_employee_no" UNIQUE,
	"department_id" TEXT NOT NULL,
	"designation" text NOT NULL,
	"specialization" text,
	"employment_state" text DEFAULT 'active' NOT NULL,
	"joined_at" date,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" TEXT,
	"version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "faculty_designation_check" CHECK ((designation IN ('Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Visiting Faculty', 'Adjunct Faculty'))),
	CONSTRAINT "faculty_employment_state_check" CHECK ((employment_state IN ('active', 'on_leave', 'retired', 'terminated')))
);

CREATE TABLE academic_programs (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"department_id" TEXT NOT NULL,
	"code" text NOT NULL CONSTRAINT "uq_program_code" UNIQUE,
	"name" text NOT NULL,
	"degree_type" text NOT NULL,
	"duration_semesters" INTEGER NOT NULL,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" TEXT,
	CONSTRAINT "programs_degree_type_check" CHECK ((degree_type IN ('BTech', 'MTech', 'PhD', 'BSc', 'MSc', 'MBA', 'BBA'))),
	CONSTRAINT "programs_duration_semesters_check" CHECK (((duration_semesters >= 1) AND (duration_semesters <= 16)))
);

CREATE TABLE academic_semesters (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"code" text NOT NULL CONSTRAINT "uq_semester_code" UNIQUE,
	"name" text NOT NULL,
	"academic_year" INTEGER NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"is_current" INTEGER DEFAULT false NOT NULL,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "chk_semester_dates" CHECK ((end_date > start_date))
);

CREATE TABLE academic_students (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"user_id" TEXT NOT NULL,
	"student_no" text NOT NULL CONSTRAINT "uq_student_no" UNIQUE,
	"department_id" TEXT NOT NULL,
	"program_id" TEXT NOT NULL,
	"admission_year" INTEGER NOT NULL,
	"current_semester" INTEGER NOT NULL,
	"lifecycle_state" text DEFAULT 'active' NOT NULL,
	"advisor_id" TEXT,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" TEXT,
	"version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "students_admission_year_check" CHECK (((admission_year >= 2000) AND (admission_year <= 2100))),
	CONSTRAINT "students_current_semester_check" CHECK (((current_semester >= 1) AND (current_semester <= 12))),
	CONSTRAINT "students_lifecycle_state_check" CHECK ((lifecycle_state IN ('active', 'graduated', 'suspended', 'withdrawn', 'alumni')))
);

CREATE TABLE exam_exam_types (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"code" text NOT NULL CONSTRAINT "uq_exam_type_code" UNIQUE,
	"name" text NOT NULL,
	"description" text,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE exam_exams (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"course_offering_id" TEXT NOT NULL,
	"exam_type_id" TEXT NOT NULL,
	"name" text NOT NULL,
	"max_marks" REAL NOT NULL,
	"weightage_percent" REAL NOT NULL,
	"scheduled_at" TEXT,
	"duration_minutes" integer,
	"status" text DEFAULT 'scheduled' NOT NULL,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "exams_max_marks_check" CHECK ((max_marks > 0)),
	CONSTRAINT "exams_status_check" CHECK ((status IN ('scheduled', 'ongoing', 'completed', 'cancelled', 'graded'))),
	CONSTRAINT "exams_weightage_percent_check" CHECK (((weightage_percent >= 0) AND (weightage_percent <= 100)))
);

CREATE TABLE exam_final_results (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"course_offering_id" TEXT NOT NULL,
	"student_id" TEXT NOT NULL,
	"total_marks" REAL,
	"grade_code" text,
	"grade_points" REAL,
	"result_status" text DEFAULT 'pending' NOT NULL,
	"published_at" TEXT,
	"withheld_reason" text,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "uq_result" UNIQUE("course_offering_id","student_id"),
	CONSTRAINT "final_results_result_status_check" CHECK ((result_status IN ('pending', 'pass', 'fail', 'withheld', 'absent')))
);

CREATE TABLE exam_grade_scale (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"grade_code" text NOT NULL UNIQUE,
	"grade_name" text,
	"min_marks" REAL NOT NULL,
	"max_marks" REAL NOT NULL,
	"grade_points" REAL NOT NULL,
	"effective_from" date NOT NULL UNIQUE,
	"effective_to" date,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "uq_grade_code_effective" UNIQUE("grade_code","effective_from"),
	CONSTRAINT "chk_grade_marks" CHECK ((max_marks >= min_marks))
);

CREATE TABLE exam_marks (
	"exam_id" TEXT,
	"student_id" TEXT,
	"marks_obtained" REAL NOT NULL,
	"graded_by" TEXT,
	"graded_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"moderated_by" TEXT,
	"moderated_at" TEXT,
	"remarks" text,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "marks_pkey" PRIMARY KEY("exam_id","student_id"),
	CONSTRAINT "marks_marks_obtained_check" CHECK ((marks_obtained >= 0))
);

CREATE TABLE hostel_hostels (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"name" text NOT NULL,
	"code" text NOT NULL CONSTRAINT "uq_hostel_code" UNIQUE,
	"gender_type" text NOT NULL,
	"address" text,
	"warden_user_id" TEXT,
	"total_capacity" integer DEFAULT 0 NOT NULL,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" TEXT,
	CONSTRAINT "hostels_gender_type_check" CHECK ((gender_type IN ('male', 'female', 'mixed'))),
	CONSTRAINT "hostels_total_capacity_check" CHECK ((total_capacity >= 0))
);

CREATE TABLE hostel_blocks (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"hostel_id" TEXT NOT NULL,
	"name" text NOT NULL,
	"floor_count" INTEGER NOT NULL,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "uq_block_hostel" UNIQUE("hostel_id","name"),
	CONSTRAINT "blocks_floor_count_check" CHECK ((floor_count > 0))
);

CREATE TABLE hostel_rooms (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"block_id" TEXT NOT NULL,
	"room_no" text NOT NULL,
	"floor_no" INTEGER NOT NULL,
	"capacity" INTEGER NOT NULL,
	"room_type" text DEFAULT 'regular' NOT NULL,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"qr_code_id" TEXT DEFAULT (lower(hex(randomblob(16)))) CONSTRAINT "rooms_qr_code_id_key" UNIQUE,
	CONSTRAINT "uq_room_block" UNIQUE("block_id","room_no"),
	CONSTRAINT "rooms_capacity_check" CHECK ((capacity > 0)),
	CONSTRAINT "rooms_floor_no_check" CHECK ((floor_no >= 0)),
	CONSTRAINT "rooms_room_type_check" CHECK ((room_type IN ('regular', 'ac', 'suite', 'accessible')))
);

CREATE TABLE hostel_beds (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"room_id" TEXT NOT NULL,
	"bed_label" text NOT NULL,
	"status" text DEFAULT 'available' NOT NULL,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"qr_code_id" TEXT DEFAULT (lower(hex(randomblob(16)))) CONSTRAINT "beds_qr_code_id_key" UNIQUE,
	CONSTRAINT "uq_bed_room" UNIQUE("room_id","bed_label"),
	CONSTRAINT "beds_status_check" CHECK ((status IN ('available', 'occupied', 'maintenance', 'reserved')))
);

CREATE TABLE hostel_allocations (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"student_id" TEXT NOT NULL,
	"bed_id" TEXT NOT NULL,
	"allocated_from" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"allocated_to" TEXT,
	"status" text DEFAULT 'active' NOT NULL,
	"idempotency_key" text,
	"allocated_by" TEXT,
	"vacated_by" TEXT,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "allocations_status_check" CHECK ((status IN ('active', 'vacated', 'transferred', 'expired'))),
	CONSTRAINT "chk_alloc_dates" CHECK (((allocated_to IS NULL) OR (allocated_to > allocated_from)))
);

CREATE TABLE hostel_waitlist (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"student_id" TEXT NOT NULL,
	"hostel_id" TEXT NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"preferences" TEXT,
	"status" text DEFAULT 'waiting' NOT NULL,
	"requested_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"resolved_at" TEXT,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "waitlist_status_check" CHECK ((status IN ('waiting', 'offered', 'accepted', 'declined', 'expired', 'cancelled')))
);

CREATE TABLE library_authors (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"name" text NOT NULL,
	"bio" text,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE library_book_authors (
	"book_id" TEXT,
	"author_id" TEXT,
	"ordinal" INTEGER DEFAULT 1 NOT NULL,
	CONSTRAINT "book_authors_pkey" PRIMARY KEY("book_id","author_id")
);

CREATE TABLE library_book_copies (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"book_id" TEXT NOT NULL,
	"barcode" text NOT NULL CONSTRAINT "uq_barcode" UNIQUE,
	"acquisition_date" date,
	"price" REAL,
	"status" text DEFAULT 'available' NOT NULL,
	"shelf_location" text,
	"condition_notes" text,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"qr_code_id" TEXT DEFAULT (lower(hex(randomblob(16)))) CONSTRAINT "book_copies_qr_code_id_key" UNIQUE,
	CONSTRAINT "book_copies_status_check" CHECK ((status IN ('available', 'issued', 'reserved', 'lost', 'damaged', 'withdrawn')))
);

CREATE TABLE library_books (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"isbn" text NOT NULL CONSTRAINT "uq_isbn" UNIQUE,
	"title" text NOT NULL,
	"subtitle" text,
	"author" text,
	"publisher" text,
	"edition" INTEGER DEFAULT 1,
	"publisher_id" TEXT,
	"publication_year" INTEGER,
	"language_code" text DEFAULT 'en' NOT NULL,
	"subject_id" TEXT,
	"page_count" integer,
	"search_vector" tsvector,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" TEXT
);

CREATE TABLE library_fines (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"issue_id" TEXT NOT NULL,
	"member_user_id" TEXT NOT NULL,
	"amount" REAL NOT NULL,
	"reason" text DEFAULT 'overdue' NOT NULL,
	"assessed_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"settled_at" TEXT,
	"settled_by" TEXT,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "fines_amount_check" CHECK ((amount > 0)),
	CONSTRAINT "fines_reason_check" CHECK ((reason IN ('overdue', 'lost', 'damaged', 'other')))
);

CREATE TABLE library_issues (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"copy_id" TEXT NOT NULL,
	"member_user_id" TEXT NOT NULL,
	"issued_by" TEXT NOT NULL,
	"issued_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"due_at" TEXT NOT NULL,
	"returned_at" TEXT,
	"return_received_by" TEXT,
	"renewal_count" INTEGER DEFAULT 0 NOT NULL,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "chk_due_after_issue" CHECK ((due_at > issued_at))
);

CREATE TABLE library_publishers (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"name" text NOT NULL,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE library_reservations (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"book_id" TEXT NOT NULL,
	"member_user_id" TEXT NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"fulfilled_at" TEXT,
	"expired_at" TEXT,
	"notes" text,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "reservations_status_check" CHECK ((status IN ('active', 'fulfilled', 'expired', 'cancelled')))
);

CREATE TABLE library_subjects (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"name" text NOT NULL,
	"code" text NOT NULL CONSTRAINT "uq_subject_code" UNIQUE,
	"parent_id" TEXT,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE audit_audit_logs (
	"id" TEXT DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	"table_name" text NOT NULL,
	"record_pk" text NOT NULL,
	"operation" text NOT NULL,
	"old_values" TEXT,
	"new_values" TEXT,
	"changed_by" TEXT,
	"changed_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"request_id" text,
	"source_module" text,
	CONSTRAINT "audit_logs_operation_check" CHECK ((operation IN ('INSERT', 'UPDATE', 'DELETE')))
);

CREATE TABLE audit_outbox (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"aggregate_type" text NOT NULL,
	"aggregate_id" TEXT NOT NULL,
	"event_type" text NOT NULL,
	"payload" TEXT DEFAULT '{}' NOT NULL,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"published_at" TEXT
);

CREATE TABLE core_system_settings (
    "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    "setting_key" text NOT NULL UNIQUE,
    "setting_value" text NOT NULL,
    "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE admin_action_logs (
    "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    "action" text NOT NULL,
    "user_id" TEXT,
    "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes and FKs (Truncated for readability, executing minimal schema core first)





CREATE TABLE academic_attendance (
    "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    "student_id" TEXT NOT NULL REFERENCES academic_students("id"),
    "course_offering_id" TEXT NOT NULL REFERENCES academic_course_offerings("id"),
    "date" date NOT NULL DEFAULT CURRENT_DATE,
    "status" text NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
    "remarks" text,
    "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE("student_id", "course_offering_id", "date")
);

CREATE TABLE core_notifications (
    "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    "user_id" TEXT NOT NULL REFERENCES auth_users("id"),
    "title" text NOT NULL,
    "message" text NOT NULL,
    "type" text DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    "is_read" INTEGER DEFAULT false NOT NULL,
    "link" text,
    "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE academic_schedules (
    "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    "course_offering_id" TEXT NOT NULL REFERENCES academic_course_offerings("id"),
    "day_of_week" INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    "start_time" time NOT NULL,
    "end_time" time NOT NULL,
    "room" text,
    "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE("course_offering_id", "day_of_week", "start_time")
);

CREATE TABLE core_support_tickets (
    "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    "student_id" TEXT REFERENCES academic_students("id"),
    "faculty_id" TEXT REFERENCES academic_faculty("id"),
    "title" text NOT NULL,
    "description" text NOT NULL,
    "category" text NOT NULL CHECK (category IN ('IT Support', 'Academic', 'Maintenance', 'Hostel', 'Other')),
    "status" text DEFAULT 'open' NOT NULL CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    "priority" text DEFAULT 'medium' NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    "assigned_to" TEXT REFERENCES auth_users("id"),
    "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE core_campus_events (
    "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    "title" text NOT NULL,
    "description" text,
    "location" text,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "organizer" text,
    "category" text NOT NULL CHECK (category IN ('Academic', 'Social', 'Workshop', 'Sports', 'Other')),
    "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE core_facility_requests (
    "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    "facility_name" text NOT NULL,
    "requester_id" TEXT NOT NULL REFERENCES auth_users("id"),
    "request_date" date NOT NULL DEFAULT CURRENT_DATE,
    "purpose" text,
    "status" text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE hostel_complaints (
    "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    "student_id" TEXT NOT NULL REFERENCES academic_students("id"),
    "room_id" TEXT REFERENCES hostel_rooms("id"),
    "category" text NOT NULL CHECK (category IN ('Cleaning', 'Electrical', 'Plumbing', 'Internet', 'Furniture', 'Other')),
    "description" text NOT NULL,
    "status" text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
    "priority" text DEFAULT 'medium' NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE hostel_outpasses (
    "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    "student_id" TEXT NOT NULL REFERENCES academic_students("id"),
    "reason" text NOT NULL,
    "destination" text NOT NULL,
    "out_time" TEXT NOT NULL,
    "in_time" TEXT NOT NULL,
    "status" text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    "approved_by" TEXT REFERENCES auth_users("id"),
    "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE library_books ADD COLUMN pdf_url text;
ALTER TABLE exam_exams ADD COLUMN "venue" text;
ALTER TABLE exam_exams ADD COLUMN "room_no" text;

CREATE TABLE exam_student_exam_details (
	"id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
	"exam_id" TEXT NOT NULL REFERENCES exam_exams("id"),
	"student_id" TEXT NOT NULL REFERENCES academic_students("id"),
	"seat_no" text NOT NULL,
	"attendance_status" text DEFAULT 'absent' NOT NULL,
	"created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "uq_student_exam" UNIQUE("exam_id", "student_id")
);