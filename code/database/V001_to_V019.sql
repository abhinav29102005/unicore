CREATE SCHEMA IF NOT EXISTS "public";
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;
CREATE SCHEMA IF NOT EXISTS "academic";
CREATE SCHEMA IF NOT EXISTS "admin";
CREATE SCHEMA IF NOT EXISTS "audit";
CREATE SCHEMA IF NOT EXISTS "auth";
CREATE SCHEMA IF NOT EXISTS "core";
CREATE SCHEMA IF NOT EXISTS "exam";
CREATE SCHEMA IF NOT EXISTS "hostel";
CREATE SCHEMA IF NOT EXISTS "library";
CREATE SCHEMA IF NOT EXISTS "reporting";

CREATE TABLE "auth"."permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"code" text NOT NULL CONSTRAINT "uq_permissions_code" UNIQUE,
	"description" text,
	"module" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "auth"."refresh_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"device_info" text,
	"ip_address" text,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "auth"."role_permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_role_permission" UNIQUE("role_id","permission_id")
);

CREATE TABLE "auth"."roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"code" text NOT NULL CONSTRAINT "uq_roles_code" UNIQUE,
	"name" text NOT NULL,
	"description" text,
	"scope_type" text,
	"is_system" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "roles_scope_type_check" CHECK ((scope_type = ANY (ARRAY['global'::text, 'department'::text, 'hostel'::text, 'library'::text])))
);

CREATE TABLE "auth"."user_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"scope_id" uuid UNIQUE,
	"granted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"granted_by" uuid,
	"revoked_at" timestamp with time zone,
	CONSTRAINT "uq_user_role_scope" UNIQUE("user_id","role_id","scope_id")
);

CREATE TABLE "auth"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" text NOT NULL,
	"phone" text,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"password_hash" text NOT NULL,
	"password_algo" text DEFAULT 'bcrypt' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"last_login_at" timestamp with time zone,
	"failed_login_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "users_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'active'::text, 'locked'::text, 'disabled'::text])))
);

CREATE TABLE "academic"."course_offerings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"course_id" uuid NOT NULL,
	"semester_id" uuid NOT NULL,
	"section_code" text DEFAULT 'A' NOT NULL,
	"primary_faculty_id" uuid,
	"capacity" integer NOT NULL,
	"enrollment_count" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'scheduled' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_offering" UNIQUE("course_id","semester_id","section_code"),
	CONSTRAINT "course_offerings_capacity_check" CHECK ((capacity > 0)),
	CONSTRAINT "course_offerings_enrollment_count_check" CHECK ((enrollment_count >= 0)),
	CONSTRAINT "course_offerings_status_check" CHECK ((status = ANY (ARRAY['scheduled'::text, 'ongoing'::text, 'completed'::text, 'cancelled'::text])))
);

CREATE TABLE "academic"."courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"course_code" text NOT NULL CONSTRAINT "uq_course_code" UNIQUE,
	"title" text NOT NULL,
	"description" text,
	"credits" smallint NOT NULL,
	"department_id" uuid NOT NULL,
	"course_type" text DEFAULT 'core' NOT NULL,
	"prerequisite_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "courses_course_type_check" CHECK ((course_type = ANY (ARRAY['core'::text, 'elective'::text, 'lab'::text, 'project'::text, 'seminar'::text]))),
	CONSTRAINT "courses_credits_check" CHECK (((credits >= 1) AND (credits <= 12)))
);

CREATE TABLE "academic"."departments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"code" text NOT NULL CONSTRAINT "uq_dept_code" UNIQUE,
	"name" text NOT NULL,
	"established_year" smallint,
	"head_faculty_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);

CREATE TABLE "academic"."enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"student_id" uuid NOT NULL,
	"course_offering_id" uuid NOT NULL,
	"enrollment_status" text DEFAULT 'enrolled' NOT NULL,
	"registered_at" timestamp with time zone DEFAULT now() NOT NULL,
	"withdrawn_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_enrollment" UNIQUE("student_id","course_offering_id"),
	CONSTRAINT "enrollments_enrollment_status_check" CHECK ((enrollment_status = ANY (ARRAY['enrolled'::text, 'withdrawn'::text, 'completed'::text, 'failed'::text])))
);

CREATE TABLE "academic"."faculty" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"employee_no" text NOT NULL CONSTRAINT "uq_employee_no" UNIQUE,
	"department_id" uuid NOT NULL,
	"designation" text NOT NULL,
	"specialization" text,
	"employment_state" text DEFAULT 'active' NOT NULL,
	"joined_at" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "faculty_designation_check" CHECK ((designation = ANY (ARRAY['Professor'::text, 'Associate Professor'::text, 'Assistant Professor'::text, 'Lecturer'::text, 'Visiting Faculty'::text, 'Adjunct Faculty'::text]))),
	CONSTRAINT "faculty_employment_state_check" CHECK ((employment_state = ANY (ARRAY['active'::text, 'on_leave'::text, 'retired'::text, 'terminated'::text])))
);

CREATE TABLE "academic"."programs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"department_id" uuid NOT NULL,
	"code" text NOT NULL CONSTRAINT "uq_program_code" UNIQUE,
	"name" text NOT NULL,
	"degree_type" text NOT NULL,
	"duration_semesters" smallint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "programs_degree_type_check" CHECK ((degree_type = ANY (ARRAY['BTech'::text, 'MTech'::text, 'PhD'::text, 'BSc'::text, 'MSc'::text, 'MBA'::text, 'BBA'::text]))),
	CONSTRAINT "programs_duration_semesters_check" CHECK (((duration_semesters >= 1) AND (duration_semesters <= 16)))
);

CREATE TABLE "academic"."semesters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"code" text NOT NULL CONSTRAINT "uq_semester_code" UNIQUE,
	"name" text NOT NULL,
	"academic_year" smallint NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"is_current" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_semester_dates" CHECK ((end_date > start_date))
);

CREATE TABLE "academic"."students" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"student_no" text NOT NULL CONSTRAINT "uq_student_no" UNIQUE,
	"department_id" uuid NOT NULL,
	"program_id" uuid NOT NULL,
	"admission_year" smallint NOT NULL,
	"current_semester" smallint NOT NULL,
	"lifecycle_state" text DEFAULT 'active' NOT NULL,
	"advisor_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "students_admission_year_check" CHECK (((admission_year >= 2000) AND (admission_year <= 2100))),
	CONSTRAINT "students_current_semester_check" CHECK (((current_semester >= 1) AND (current_semester <= 12))),
	CONSTRAINT "students_lifecycle_state_check" CHECK ((lifecycle_state = ANY (ARRAY['active'::text, 'graduated'::text, 'suspended'::text, 'withdrawn'::text, 'alumni'::text])))
);

CREATE TABLE "exam"."exam_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"code" text NOT NULL CONSTRAINT "uq_exam_type_code" UNIQUE,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "exam"."exams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"course_offering_id" uuid NOT NULL,
	"exam_type_id" uuid NOT NULL,
	"name" text NOT NULL,
	"max_marks" numeric(6, 2) NOT NULL,
	"weightage_percent" numeric(5, 2) NOT NULL,
	"scheduled_at" timestamp with time zone,
	"duration_minutes" integer,
	"status" text DEFAULT 'scheduled' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "exams_max_marks_check" CHECK ((max_marks > (0)::numeric)),
	CONSTRAINT "exams_status_check" CHECK ((status = ANY (ARRAY['scheduled'::text, 'ongoing'::text, 'completed'::text, 'cancelled'::text, 'graded'::text]))),
	CONSTRAINT "exams_weightage_percent_check" CHECK (((weightage_percent >= (0)::numeric) AND (weightage_percent <= (100)::numeric)))
);

CREATE TABLE "exam"."final_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"course_offering_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"total_marks" numeric(6, 2),
	"grade_code" text,
	"grade_points" numeric(4, 2),
	"result_status" text DEFAULT 'pending' NOT NULL,
	"published_at" timestamp with time zone,
	"withheld_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_result" UNIQUE("course_offering_id","student_id"),
	CONSTRAINT "final_results_result_status_check" CHECK ((result_status = ANY (ARRAY['pending'::text, 'pass'::text, 'fail'::text, 'withheld'::text, 'absent'::text])))
);

CREATE TABLE "exam"."grade_scale" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"grade_code" text NOT NULL UNIQUE,
	"grade_name" text,
	"min_marks" numeric(5, 2) NOT NULL,
	"max_marks" numeric(5, 2) NOT NULL,
	"grade_points" numeric(4, 2) NOT NULL,
	"effective_from" date NOT NULL UNIQUE,
	"effective_to" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_grade_code_effective" UNIQUE("grade_code","effective_from"),
	CONSTRAINT "chk_grade_marks" CHECK ((max_marks >= min_marks))
);

CREATE TABLE "exam"."marks" (
	"exam_id" uuid,
	"student_id" uuid,
	"marks_obtained" numeric(6, 2) NOT NULL,
	"graded_by" uuid,
	"graded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"moderated_by" uuid,
	"moderated_at" timestamp with time zone,
	"remarks" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "marks_pkey" PRIMARY KEY("exam_id","student_id"),
	CONSTRAINT "marks_marks_obtained_check" CHECK ((marks_obtained >= (0)::numeric))
);

CREATE TABLE "hostel"."hostels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"code" text NOT NULL CONSTRAINT "uq_hostel_code" UNIQUE,
	"gender_type" text NOT NULL,
	"address" text,
	"warden_user_id" uuid,
	"total_capacity" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "hostels_gender_type_check" CHECK ((gender_type = ANY (ARRAY['male'::text, 'female'::text, 'mixed'::text]))),
	CONSTRAINT "hostels_total_capacity_check" CHECK ((total_capacity >= 0))
);

CREATE TABLE "hostel"."blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"hostel_id" uuid NOT NULL,
	"name" text NOT NULL,
	"floor_count" smallint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_block_hostel" UNIQUE("hostel_id","name"),
	CONSTRAINT "blocks_floor_count_check" CHECK ((floor_count > 0))
);

CREATE TABLE "hostel"."rooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"block_id" uuid NOT NULL,
	"room_no" text NOT NULL,
	"floor_no" smallint NOT NULL,
	"capacity" smallint NOT NULL,
	"room_type" text DEFAULT 'regular' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"qr_code_id" uuid DEFAULT gen_random_uuid() CONSTRAINT "rooms_qr_code_id_key" UNIQUE,
	CONSTRAINT "uq_room_block" UNIQUE("block_id","room_no"),
	CONSTRAINT "rooms_capacity_check" CHECK ((capacity > 0)),
	CONSTRAINT "rooms_floor_no_check" CHECK ((floor_no >= 0)),
	CONSTRAINT "rooms_room_type_check" CHECK ((room_type = ANY (ARRAY['regular'::text, 'ac'::text, 'suite'::text, 'accessible'::text])))
);

CREATE TABLE "hostel"."beds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"room_id" uuid NOT NULL,
	"bed_label" text NOT NULL,
	"status" text DEFAULT 'available' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"qr_code_id" uuid DEFAULT gen_random_uuid() CONSTRAINT "beds_qr_code_id_key" UNIQUE,
	CONSTRAINT "uq_bed_room" UNIQUE("room_id","bed_label"),
	CONSTRAINT "beds_status_check" CHECK ((status = ANY (ARRAY['available'::text, 'occupied'::text, 'maintenance'::text, 'reserved'::text])))
);

CREATE TABLE "hostel"."allocations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"student_id" uuid NOT NULL,
	"bed_id" uuid NOT NULL,
	"allocated_from" timestamp with time zone DEFAULT now() NOT NULL,
	"allocated_to" timestamp with time zone,
	"status" text DEFAULT 'active' NOT NULL,
	"idempotency_key" text,
	"allocated_by" uuid,
	"vacated_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "allocations_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'vacated'::text, 'transferred'::text, 'expired'::text]))),
	CONSTRAINT "chk_alloc_dates" CHECK (((allocated_to IS NULL) OR (allocated_to > allocated_from)))
);

CREATE TABLE "hostel"."waitlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"student_id" uuid NOT NULL,
	"hostel_id" uuid NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"preferences" jsonb,
	"status" text DEFAULT 'waiting' NOT NULL,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "waitlist_status_check" CHECK ((status = ANY (ARRAY['waiting'::text, 'offered'::text, 'accepted'::text, 'declined'::text, 'expired'::text, 'cancelled'::text])))
);

CREATE TABLE "library"."authors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"bio" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "library"."book_authors" (
	"book_id" uuid,
	"author_id" uuid,
	"ordinal" smallint DEFAULT 1 NOT NULL,
	CONSTRAINT "book_authors_pkey" PRIMARY KEY("book_id","author_id")
);

CREATE TABLE "library"."book_copies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"book_id" uuid NOT NULL,
	"barcode" text NOT NULL CONSTRAINT "uq_barcode" UNIQUE,
	"acquisition_date" date,
	"price" numeric(10, 2),
	"status" text DEFAULT 'available' NOT NULL,
	"shelf_location" text,
	"condition_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"qr_code_id" uuid DEFAULT gen_random_uuid() CONSTRAINT "book_copies_qr_code_id_key" UNIQUE,
	CONSTRAINT "book_copies_status_check" CHECK ((status = ANY (ARRAY['available'::text, 'issued'::text, 'reserved'::text, 'lost'::text, 'damaged'::text, 'withdrawn'::text])))
);

CREATE TABLE "library"."books" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"isbn" text NOT NULL CONSTRAINT "uq_isbn" UNIQUE,
	"title" text NOT NULL,
	"subtitle" text,
	"author" text,
	"publisher" text,
	"edition" smallint DEFAULT 1,
	"publisher_id" uuid,
	"publication_year" smallint,
	"language_code" text DEFAULT 'en' NOT NULL,
	"subject_id" uuid,
	"page_count" integer,
	"search_vector" tsvector,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);

CREATE TABLE "library"."fines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"issue_id" uuid NOT NULL,
	"member_user_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"reason" text DEFAULT 'overdue' NOT NULL,
	"assessed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"settled_at" timestamp with time zone,
	"settled_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "fines_amount_check" CHECK ((amount > (0)::numeric)),
	CONSTRAINT "fines_reason_check" CHECK ((reason = ANY (ARRAY['overdue'::text, 'lost'::text, 'damaged'::text, 'other'::text])))
);

CREATE TABLE "library"."issues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"copy_id" uuid NOT NULL,
	"member_user_id" uuid NOT NULL,
	"issued_by" uuid NOT NULL,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL,
	"due_at" timestamp with time zone NOT NULL,
	"returned_at" timestamp with time zone,
	"return_received_by" uuid,
	"renewal_count" smallint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_due_after_issue" CHECK ((due_at > issued_at))
);

CREATE TABLE "library"."publishers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "library"."reservations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"book_id" uuid NOT NULL,
	"member_user_id" uuid NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"fulfilled_at" timestamp with time zone,
	"expired_at" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reservations_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'fulfilled'::text, 'expired'::text, 'cancelled'::text])))
);

CREATE TABLE "library"."subjects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"code" text NOT NULL CONSTRAINT "uq_subject_code" UNIQUE,
	"parent_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "audit"."audit_logs" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"table_name" text NOT NULL,
	"record_pk" text NOT NULL,
	"operation" text NOT NULL,
	"old_values" jsonb,
	"new_values" jsonb,
	"changed_by" uuid,
	"changed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"request_id" text,
	"source_module" text,
	CONSTRAINT "audit_logs_operation_check" CHECK ((operation = ANY (ARRAY['INSERT'::text, 'UPDATE'::text, 'DELETE'::text])))
);

CREATE TABLE "audit"."outbox" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"aggregate_type" text NOT NULL,
	"aggregate_id" uuid NOT NULL,
	"event_type" text NOT NULL,
	"payload" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone
);

CREATE TABLE "core"."system_settings" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "setting_key" text NOT NULL UNIQUE,
    "setting_value" text NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "admin"."action_logs" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "action" text NOT NULL,
    "user_id" uuid,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Indexes and FKs (Truncated for readability, executing minimal schema core first)
ALTER TABLE "academic"."course_offerings" ADD CONSTRAINT "course_offerings_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "academic"."courses"("id") ON DELETE RESTRICT;
ALTER TABLE "academic"."course_offerings" ADD CONSTRAINT "course_offerings_primary_faculty_id_fkey" FOREIGN KEY ("primary_faculty_id") REFERENCES "academic"."faculty"("id") ON DELETE SET NULL;
ALTER TABLE "academic"."course_offerings" ADD CONSTRAINT "course_offerings_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "academic"."semesters"("id") ON DELETE RESTRICT;
ALTER TABLE "academic"."courses" ADD CONSTRAINT "courses_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "academic"."departments"("id") ON DELETE RESTRICT;
ALTER TABLE "academic"."courses" ADD CONSTRAINT "courses_prerequisite_id_fkey" FOREIGN KEY ("prerequisite_id") REFERENCES "academic"."courses"("id") ON DELETE SET NULL;
ALTER TABLE "academic"."departments" ADD CONSTRAINT "fk_dept_head_faculty" FOREIGN KEY ("head_faculty_id") REFERENCES "academic"."faculty"("id") ON DELETE SET NULL;
ALTER TABLE "academic"."enrollments" ADD CONSTRAINT "enrollments_course_offering_id_fkey" FOREIGN KEY ("course_offering_id") REFERENCES "academic"."course_offerings"("id") ON DELETE RESTRICT;
ALTER TABLE "academic"."enrollments" ADD CONSTRAINT "enrollments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "academic"."students"("id") ON DELETE RESTRICT;
ALTER TABLE "academic"."faculty" ADD CONSTRAINT "faculty_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "academic"."departments"("id") ON DELETE RESTRICT;
ALTER TABLE "academic"."faculty" ADD CONSTRAINT "faculty_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE RESTRICT;
ALTER TABLE "academic"."programs" ADD CONSTRAINT "programs_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "academic"."departments"("id") ON DELETE RESTRICT;
ALTER TABLE "academic"."students" ADD CONSTRAINT "fk_student_advisor" FOREIGN KEY ("advisor_id") REFERENCES "academic"."faculty"("id") ON DELETE SET NULL;
ALTER TABLE "academic"."students" ADD CONSTRAINT "students_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "academic"."departments"("id") ON DELETE RESTRICT;
ALTER TABLE "academic"."students" ADD CONSTRAINT "students_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "academic"."programs"("id") ON DELETE RESTRICT;
ALTER TABLE "academic"."students" ADD CONSTRAINT "students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE RESTRICT;

ALTER TABLE "auth"."refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;
ALTER TABLE "auth"."role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "auth"."permissions"("id") ON DELETE CASCADE;
ALTER TABLE "auth"."role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "auth"."roles"("id") ON DELETE CASCADE;
ALTER TABLE "auth"."user_roles" ADD CONSTRAINT "user_roles_granted_by_fkey" FOREIGN KEY ("granted_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;
ALTER TABLE "auth"."user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "auth"."roles"("id") ON DELETE CASCADE;
ALTER TABLE "auth"."user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE "exam"."exams" ADD CONSTRAINT "exams_course_offering_id_fkey" FOREIGN KEY ("course_offering_id") REFERENCES "academic"."course_offerings"("id") ON DELETE RESTRICT;
ALTER TABLE "exam"."exams" ADD CONSTRAINT "exams_exam_type_id_fkey" FOREIGN KEY ("exam_type_id") REFERENCES "exam"."exam_types"("id") ON DELETE RESTRICT;
ALTER TABLE "exam"."final_results" ADD CONSTRAINT "final_results_course_offering_id_fkey" FOREIGN KEY ("course_offering_id") REFERENCES "academic"."course_offerings"("id") ON DELETE RESTRICT;
ALTER TABLE "exam"."final_results" ADD CONSTRAINT "final_results_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "academic"."students"("id") ON DELETE RESTRICT;
ALTER TABLE "exam"."marks" ADD CONSTRAINT "marks_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exam"."exams"("id") ON DELETE RESTRICT;
ALTER TABLE "exam"."marks" ADD CONSTRAINT "marks_graded_by_fkey" FOREIGN KEY ("graded_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;
ALTER TABLE "exam"."marks" ADD CONSTRAINT "marks_moderated_by_fkey" FOREIGN KEY ("moderated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;
ALTER TABLE "exam"."marks" ADD CONSTRAINT "marks_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "academic"."students"("id") ON DELETE RESTRICT;

ALTER TABLE "hostel"."allocations" ADD CONSTRAINT "allocations_allocated_by_fkey" FOREIGN KEY ("allocated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;
ALTER TABLE "hostel"."allocations" ADD CONSTRAINT "allocations_bed_id_fkey" FOREIGN KEY ("bed_id") REFERENCES "hostel"."beds"("id") ON DELETE RESTRICT;
ALTER TABLE "hostel"."allocations" ADD CONSTRAINT "allocations_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "academic"."students"("id") ON DELETE RESTRICT;
ALTER TABLE "hostel"."allocations" ADD CONSTRAINT "allocations_vacated_by_fkey" FOREIGN KEY ("vacated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;
ALTER TABLE "hostel"."beds" ADD CONSTRAINT "beds_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "hostel"."rooms"("id") ON DELETE CASCADE;
ALTER TABLE "hostel"."blocks" ADD CONSTRAINT "blocks_hostel_id_fkey" FOREIGN KEY ("hostel_id") REFERENCES "hostel"."hostels"("id") ON DELETE CASCADE;
ALTER TABLE "hostel"."hostels" ADD CONSTRAINT "hostels_warden_user_id_fkey" FOREIGN KEY ("warden_user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;
ALTER TABLE "hostel"."rooms" ADD CONSTRAINT "rooms_block_id_fkey" FOREIGN KEY ("block_id") REFERENCES "hostel"."blocks"("id") ON DELETE CASCADE;
ALTER TABLE "hostel"."waitlist" ADD CONSTRAINT "waitlist_hostel_id_fkey" FOREIGN KEY ("hostel_id") REFERENCES "hostel"."hostels"("id") ON DELETE CASCADE;
ALTER TABLE "hostel"."waitlist" ADD CONSTRAINT "waitlist_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "academic"."students"("id") ON DELETE CASCADE;

ALTER TABLE "library"."book_authors" ADD CONSTRAINT "book_authors_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "library"."authors"("id") ON DELETE CASCADE;
ALTER TABLE "library"."book_authors" ADD CONSTRAINT "book_authors_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "library"."books"("id") ON DELETE CASCADE;
ALTER TABLE "library"."book_copies" ADD CONSTRAINT "book_copies_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "library"."books"("id") ON DELETE RESTRICT;
ALTER TABLE "library"."books" ADD CONSTRAINT "books_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "library"."publishers"("id") ON DELETE SET NULL;
ALTER TABLE "library"."books" ADD CONSTRAINT "books_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "library"."subjects"("id") ON DELETE SET NULL;
ALTER TABLE "library"."fines" ADD CONSTRAINT "fines_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "library"."issues"("id") ON DELETE RESTRICT;
ALTER TABLE "library"."fines" ADD CONSTRAINT "fines_member_user_id_fkey" FOREIGN KEY ("member_user_id") REFERENCES "auth"."users"("id") ON DELETE RESTRICT;
ALTER TABLE "library"."fines" ADD CONSTRAINT "fines_settled_by_fkey" FOREIGN KEY ("settled_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;
ALTER TABLE "library"."issues" ADD CONSTRAINT "issues_copy_id_fkey" FOREIGN KEY ("copy_id") REFERENCES "library"."book_copies"("id") ON DELETE RESTRICT;
ALTER TABLE "library"."issues" ADD CONSTRAINT "issues_issued_by_fkey" FOREIGN KEY ("issued_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT;
ALTER TABLE "library"."issues" ADD CONSTRAINT "issues_member_user_id_fkey" FOREIGN KEY ("member_user_id") REFERENCES "auth"."users"("id") ON DELETE RESTRICT;
ALTER TABLE "library"."issues" ADD CONSTRAINT "issues_return_received_by_fkey" FOREIGN KEY ("return_received_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;
ALTER TABLE "library"."reservations" ADD CONSTRAINT "reservations_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "library"."books"("id") ON DELETE CASCADE;
ALTER TABLE "library"."reservations" ADD CONSTRAINT "reservations_member_user_id_fkey" FOREIGN KEY ("member_user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;
ALTER TABLE "library"."subjects" ADD CONSTRAINT "subjects_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "library"."subjects"("id") ON DELETE SET NULL;

CREATE TABLE "academic"."attendance" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "student_id" uuid NOT NULL REFERENCES "academic"."students"("id"),
    "course_offering_id" uuid NOT NULL REFERENCES "academic"."course_offerings"("id"),
    "date" date NOT NULL DEFAULT CURRENT_DATE,
    "status" text NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
    "remarks" text,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE("student_id", "course_offering_id", "date")
);

CREATE TABLE "core"."notifications" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" uuid NOT NULL REFERENCES "auth"."users"("id"),
    "title" text NOT NULL,
    "message" text NOT NULL,
    "type" text DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    "is_read" boolean DEFAULT false NOT NULL,
    "link" text,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "academic"."schedules" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "course_offering_id" uuid NOT NULL REFERENCES "academic"."course_offerings"("id"),
    "day_of_week" smallint NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    "start_time" time NOT NULL,
    "end_time" time NOT NULL,
    "room" text,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE("course_offering_id", "day_of_week", "start_time")
);

CREATE TABLE "core"."support_tickets" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "student_id" uuid REFERENCES "academic"."students"("id"),
    "faculty_id" uuid REFERENCES "academic"."faculty"("id"),
    "title" text NOT NULL,
    "description" text NOT NULL,
    "category" text NOT NULL CHECK (category IN ('IT Support', 'Academic', 'Maintenance', 'Hostel', 'Other')),
    "status" text DEFAULT 'open' NOT NULL CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    "priority" text DEFAULT 'medium' NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    "assigned_to" uuid REFERENCES "auth"."users"("id"),
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "core"."campus_events" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" text NOT NULL,
    "description" text,
    "location" text,
    "start_time" timestamp with time zone NOT NULL,
    "end_time" timestamp with time zone NOT NULL,
    "organizer" text,
    "category" text NOT NULL CHECK (category IN ('Academic', 'Social', 'Workshop', 'Sports', 'Other')),
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "core"."facility_requests" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "facility_name" text NOT NULL,
    "requester_id" uuid NOT NULL REFERENCES "auth"."users"("id"),
    "request_date" date NOT NULL DEFAULT CURRENT_DATE,
    "purpose" text,
    "status" text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "hostel"."complaints" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "student_id" uuid NOT NULL REFERENCES "academic"."students"("id"),
    "room_id" uuid REFERENCES "hostel"."rooms"("id"),
    "category" text NOT NULL CHECK (category IN ('Cleaning', 'Electrical', 'Plumbing', 'Internet', 'Furniture', 'Other')),
    "description" text NOT NULL,
    "status" text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
    "priority" text DEFAULT 'medium' NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "hostel"."outpasses" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "student_id" uuid NOT NULL REFERENCES "academic"."students"("id"),
    "reason" text NOT NULL,
    "destination" text NOT NULL,
    "out_time" timestamp with time zone NOT NULL,
    "in_time" timestamp with time zone NOT NULL,
    "status" text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    "approved_by" uuid REFERENCES "auth"."users"("id"),
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE library.books ADD COLUMN pdf_url text;
ALTER TABLE "exam"."exams" ADD COLUMN "venue" text;
ALTER TABLE "exam"."exams" ADD COLUMN "room_no" text;

CREATE TABLE "exam"."student_exam_details" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"exam_id" uuid NOT NULL REFERENCES "exam"."exams"("id"),
	"student_id" uuid NOT NULL REFERENCES "academic"."students"("id"),
	"seat_no" text NOT NULL,
	"attendance_status" text DEFAULT 'absent' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_student_exam" UNIQUE("exam_id", "student_id")
);

