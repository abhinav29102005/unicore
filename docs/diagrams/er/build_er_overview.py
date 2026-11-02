#!/usr/bin/env python3
"""Build the one-page UniCore ER overview (main tables, colour-coded by module).

Every table, column and relationship here exists in code/database/schema.sql;
the full 47-table model is in unicore_er_diagram.pdf (build_er_diagram.py).

Writes docs/diagrams/er/unicore_er_overview.html, then print it to PDF (Chrome, no margins):
    python3 docs/diagrams/er/build_er_overview.py
"""
import html, os

W, H = 2430, 1500
BOX_W, ROW, HEAD = 250, 22, 44
COL = [40 + 350 * i for i in range(7)]
ROWY = [150, 500, 850, 1190]

MODULES = {  # header fill, border, title colour
    "identity": ("#dbeafe", "#60a5fa", "#1e3a8a", "Identity & Access"),
    "academic": ("#d1fae5", "#34d399", "#065f46", "Academic"),
    "exam":     ("#ede9fe", "#a78bfa", "#4c1d95", "Examination"),
    "hostel":   ("#fef3c7", "#fbbf24", "#78350f", "Hostel"),
    "library":  ("#ffe4e6", "#fb7185", "#881337", "Library"),
}
BADGE = {"PK": ("#fecdd3", "#9f1239"), "FK": ("#bfdbfe", "#1e40af"), "UK": ("#bbf7d0", "#166534")}

# name: (module, column, row, display name, [(column, badges)])
TABLES = {
    "auth_roles":        ("identity", 0, 0, "Role", [("id", "PK"), ("code", "UK"), ("name", ""), ("scope_type", "")]),
    "auth_user_roles":   ("identity", 1, 0, "User Role", [("id", "PK"), ("user_id", "FK"), ("role_id", "FK"), ("scope_id", "")]),
    "auth_users":        ("identity", 2, 0, "User", [("id", "PK"), ("email", ""), ("first_name", ""), ("last_name", ""), ("status", "")]),
    "academic_faculty":  ("academic", 3, 0, "Faculty", [("id", "PK"), ("user_id", "FK"), ("department_id", "FK"), ("employee_no", "UK"), ("designation", "")]),
    "academic_departments": ("academic", 4, 0, "Department", [("id", "PK"), ("code", "UK"), ("name", ""), ("head_faculty_id", "FK")]),
    "academic_programs": ("academic", 5, 0, "Program", [("id", "PK"), ("department_id", "FK"), ("code", "UK"), ("name", ""), ("degree_type", "")]),
    "academic_courses":  ("academic", 6, 0, "Course", [("id", "PK"), ("department_id", "FK"), ("course_code", "UK"), ("title", ""), ("credits", "")]),

    "library_issues":    ("library", 0, 1, "Book Issue", [("id", "PK"), ("copy_id", "FK"), ("member_user_id", "FK"), ("issued_at", ""), ("due_at", ""), ("returned_at", "")]),
    "library_fines":     ("library", 1, 1, "Fine", [("id", "PK"), ("issue_id", "FK"), ("member_user_id", "FK"), ("amount", ""), ("settled_at", "")]),
    "academic_students": ("academic", 2, 1, "Student", [("id", "PK"), ("user_id", "FK"), ("program_id", "FK"), ("department_id", "FK"), ("student_no", "UK"), ("current_semester", "")]),
    "academic_enrollments": ("academic", 3, 1, "Enrollment", [("id", "PK"), ("student_id", "FK"), ("course_offering_id", "FK"), ("enrollment_status", "")]),
    "academic_course_offerings": ("academic", 4, 1, "Course Offering", [("id", "PK"), ("course_id", "FK"), ("semester_id", "FK"), ("primary_faculty_id", "FK"), ("section_code", ""), ("capacity", "")]),
    "academic_semesters": ("academic", 5, 1, "Semester", [("id", "PK"), ("code", "UK"), ("academic_year", ""), ("start_date", ""), ("end_date", "")]),

    "library_book_copies": ("library", 0, 2, "Book Copy", [("id", "PK"), ("book_id", "FK"), ("barcode", "UK"), ("status", "")]),
    "academic_attendance": ("academic", 3, 2, "Attendance", [("id", "PK"), ("student_id", "FK"), ("course_offering_id", "FK"), ("date", ""), ("status", "")]),
    "exam_final_results": ("exam", 4, 2, "Final Result", [("id", "PK"), ("student_id", "FK"), ("course_offering_id", "FK"), ("total_marks", ""), ("grade_code", "")]),
    "exam_exams":        ("exam", 5, 2, "Exam", [("id", "PK"), ("course_offering_id", "FK"), ("name", ""), ("max_marks", ""), ("scheduled_at", "")]),
    "exam_marks":        ("exam", 6, 2, "Marks", [("exam_id", "PK FK"), ("student_id", "PK FK"), ("marks_obtained", ""), ("graded_by", "FK")]),

    "library_books":     ("library", 0, 3, "Book", [("id", "PK"), ("isbn", "UK"), ("title", ""), ("author", "")]),
    "hostel_allocations": ("hostel", 2, 3, "Allocation", [("id", "PK"), ("student_id", "FK"), ("bed_id", "FK"), ("allocated_from", ""), ("status", "")]),
    "hostel_beds":       ("hostel", 3, 3, "Bed", [("id", "PK"), ("room_id", "FK"), ("bed_label", ""), ("status", "")]),
    "hostel_rooms":      ("hostel", 4, 3, "Room", [("id", "PK"), ("block_id", "FK"), ("room_no", ""), ("capacity", "")]),
    "hostel_blocks":     ("hostel", 5, 3, "Block", [("id", "PK"), ("hostel_id", "FK"), ("name", ""), ("floor_count", "")]),
    "hostel_hostels":    ("hostel", 6, 3, "Hostel", [("id", "PK"), ("code", "UK"), ("name", ""), ("gender_type", ""), ("warden_user_id", "FK")]),
}

out = []


def esc(s):
    return html.escape(str(s))


def text(x, y, s, size=13, weight=400, fill="#1f2937", anchor="start", family=None, italic=False):
    fam = f' font-family="{family}"' if family else ""
    it = ' font-style="italic"' if italic else ""
    out.append(f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}"{fam}{it}>{esc(s)}</text>')


def box_geom(t):
    _, c, r, _, cols = TABLES[t]
    return COL[c], ROWY[r], BOX_W, HEAD + ROW * len(cols) + 8


def draw_box(t):
    mod, _, _, title, cols = TABLES[t]
    fill, border, ink, _ = MODULES[mod]
    x, y, w, h = box_geom(t)
    out.append(f'<rect x="{x+3}" y="{y+4}" width="{w}" height="{h}" rx="10" fill="#0f172a" opacity="0.07"/>')
    out.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="#ffffff" stroke="{border}" stroke-width="1.8"/>')
    out.append(f'<path d="M{x},{y+HEAD} V{y+10} Q{x},{y} {x+10},{y} H{x+w-10} Q{x+w},{y} {x+w},{y+10} V{y+HEAD} Z" fill="{fill}" stroke="{border}" stroke-width="1.8"/>')
    text(x + w / 2, y + 20, title, 16, 700, ink, "middle")
    text(x + w / 2, y + 36, t, 11, 400, "#64748b", "middle", "ui-monospace, Menlo, monospace")
    for i, (col, badges) in enumerate(cols):
        ry = y + HEAD + 4 + i * ROW
        if i % 2:
            out.append(f'<rect x="{x+1}" y="{ry}" width="{w-2}" height="{ROW}" fill="#f8fafc"/>')
        weight = 600 if "PK" in badges else 400
        text(x + 12, ry + 15, col, 13, weight, "#1f2937")
        bx = x + w - 10
        for b in reversed(badges.split()):
            bg, fg = BADGE[b]
            out.append(f'<rect x="{bx-28}" y="{ry+3}" width="28" height="16" rx="8" fill="{bg}"/>')
            text(bx - 14, ry + 15, b, 10, 700, fg, "middle")
            bx -= 32


def side(t, s, off=None):
    """Point on a box edge. off = offset along the edge (default: centre)."""
    x, y, w, h = box_geom(t)
    if s == "top":    return (x + (w / 2 if off is None else off), y)
    if s == "bottom": return (x + (w / 2 if off is None else off), y + h)
    # same default height on every box, so links between neighbours stay horizontal
    if s == "left":   return (x, y + (76 if off is None else off))
    if s == "right":  return (x + w, y + (76 if off is None else off))


def card(p, q, label):
    """Cardinality label just outside endpoint p, on the segment towards q."""
    (px, py), (qx, qy) = p, q
    dx, dy = (qx > px) - (qx < px), (qy > py) - (qy < py)
    lx, ly = px + dx * 12, py + dy * 16
    if dx:  # horizontal segment: put label below the line
        ly += 13
    else:   # vertical segment: put label beside the line
        lx += 9
    text(lx, ly + 4, label, 13, 700, "#334155", "middle")


def rel(points, verb, pill_at=None):
    """Relationship line from parent (1) to child (N) through the given points."""
    d = "M" + " L".join(f"{x},{y}" for x, y in points)
    out.append(f'<path d="{d}" fill="none" stroke="#475569" stroke-width="1.7" stroke-linejoin="round"/>')
    card(points[0], points[1], "1")
    card(points[-1], points[-2], "N")
    if pill_at is None:  # middle of the longest segment
        segs = list(zip(points, points[1:]))
        a, b = max(segs, key=lambda s: abs(s[0][0] - s[1][0]) + abs(s[0][1] - s[1][1]))
        pill_at = ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
    cx, cy = pill_at
    (ax, ay), (bx, by) = points[0], points[-1]
    if len(points) == 2 and ay == by and abs(bx - ax) < 160:  # short link between neighbours
        text(cx, cy - 8, verb, 11, 600, "#475569", "middle")
        return
    pw = 9 + 7.2 * len(verb)
    out.append(f'<rect x="{cx-pw/2}" y="{cy-10}" width="{pw}" height="20" rx="10" fill="#ffffff" stroke="#cbd5e1"/>')
    text(cx, cy + 4, verb, 11, 600, "#475569", "middle")


# ── Relationships (parent → child) ──
def B(t): return box_geom(t)


# Identity
rel([side("auth_roles", "right"), side("auth_user_roles", "left")], "granted as")
rel([side("auth_users", "left"), side("auth_user_roles", "right")], "has")
rel([side("auth_users", "right"), side("academic_faculty", "left")], "is")
rel([side("auth_users", "bottom"), side("academic_students", "top")], "is", pill_at=(side("auth_users", "bottom")[0], 415))

# Academic structure
rel([side("academic_departments", "left"), side("academic_faculty", "right")], "employs")
rel([side("academic_departments", "right"), side("academic_programs", "left")], "offers")
dx, dy, _, _ = B("academic_departments")
cx, cy, _, _ = B("academic_courses")
rel([(dx + 125, dy), (dx + 125, 118), (cx + 125, 118), (cx + 125, cy)], "owns")
px, _, _, ph = B("academic_programs")
sx, sy, _, _ = B("academic_students")
rel([(px + 125, ROWY[0] + ph), (px + 125, 420), (sx + 180, 420), (sx + 180, sy)], "enrolls")
fx, _, _, fh = B("academic_faculty")
ox, oy, _, oh = B("academic_course_offerings")
rel([(fx + 125, ROWY[0] + fh), (fx + 125, 470), (ox + 60, 470), (ox + 60, oy)], "teaches", pill_at=(fx + 125, 445))
crx, _, _, crh = B("academic_courses")
rel([(crx + 125, ROWY[0] + crh), (crx + 125, 445), (ox + 170, 445), (ox + 170, oy)], "offered as")
rel([side("academic_semesters", "left"), side("academic_course_offerings", "right")], "runs")

# Student ↔ offering link tables
rel([side("academic_students", "right", 70), side("academic_enrollments", "left", 70)], "makes")
rel([side("academic_course_offerings", "left", 70), side("academic_enrollments", "right", 70)], "has")
sx, sy, sw, sh = B("academic_students")
ax, ay, _, ah = B("academic_attendance")
rel([(sx + sw, sy + sh - 20), (sx + sw + 50, sy + sh - 20), (sx + sw + 50, ay + 60), (ax, ay + 60)], "marked in", pill_at=(sx + sw + 50, ay - 70))
rel([(ox, oy + oh - 20), (ox - 50, oy + oh - 20), (ox - 50, ay + 90), (ax + BOX_W, ay + 90)], "has", pill_at=(ox - 50, ay - 70))
rx, ry, _, rh = B("exam_final_results")
rel([(ox + 125, oy + oh), (ox + 125, ry)], "graded in", pill_at=(ox + 125, ry - 50))
rel([(sx + 210, sy + sh), (sx + 210, 1110), (rx + 100, 1110), (rx + 100, ry + rh)], "receives", pill_at=(rx - 140, 1110))

# Exams
ex, ey, _, eh = B("exam_exams")
rel([(ox + BOX_W, oy + oh - 20), (ox + BOX_W + 50, oy + oh - 20), (ox + BOX_W + 50, ey + 60), (ex, ey + 60)], "assessed by", pill_at=(ox + BOX_W + 50, ey - 70))
rel([side("exam_exams", "right"), side("exam_marks", "left")], "records")
mx, my, _, mh = B("exam_marks")
rel([(sx + 190, sy + sh), (sx + 190, 1135), (mx + 125, 1135), (mx + 125, my + mh)], "scores", pill_at=(mx - 160, 1135))

# Hostel
rel([(sx + 125, sy + sh), (sx + 125, ROWY[3])], "lives in", pill_at=(sx + 125, 1020))
rel([side("hostel_beds", "left"), side("hostel_allocations", "right")], "assigned in")
rel([side("hostel_rooms", "left"), side("hostel_beds", "right")], "contains")
rel([side("hostel_blocks", "left"), side("hostel_rooms", "right")], "contains")
rel([side("hostel_hostels", "left"), side("hostel_blocks", "right")], "has")

# Library
rel([side("library_books", "top"), side("library_book_copies", "bottom")], "has copies")
rel([side("library_book_copies", "top"), side("library_issues", "bottom")], "issued as")
rel([side("library_issues", "right"), side("library_fines", "left")], "charged")
ux, uy, _, uh = B("auth_users")
ix, iy, _, _ = B("library_issues")
rel([(ux + 60, uy + uh), (ux + 60, 460), (ix + 125, 460), (ix + 125, iy)], "borrows", pill_at=(ix + 190, 460))
lx, ly, _, _ = B("library_fines")
rel([(ux + 80, uy + uh), (ux + 80, 478), (lx + 125, 478), (lx + 125, ly)], "pays", pill_at=(lx + 205, 478))

for t in TABLES:
    draw_box(t)

# ── Title, module key, legend ──
text(40, 58, "UniCore — ER Diagram", 34, 800, "#0f172a")
text(40, 88, "Main tables and relationships of the UniCore database (code/database/schema.sql). Full 47-table model: unicore_er_diagram.pdf", 15, 400, "#64748b")

kx = 1450
for i, key in enumerate(MODULES):
    fill, border, ink, label = MODULES[key]
    x = kx + (i % 3) * 300 if i < 3 else kx + (i - 3) * 300
    y = 32 if i < 3 else 62
    out.append(f'<rect x="{x}" y="{y}" width="22" height="16" rx="4" fill="{fill}" stroke="{border}" stroke-width="1.5"/>')
    text(x + 32, y + 13, label, 14, 600, ink)

ly = H - 70
out.append(f'<rect x="40" y="{ly}" width="{W-80}" height="46" rx="8" fill="#f8fafc" stroke="#e2e8f0"/>')
lx = 60
for b, desc in (("PK", "Primary key"), ("FK", "Foreign key"), ("UK", "Unique")):
    bg, fg = BADGE[b]
    out.append(f'<rect x="{lx}" y="{ly+15}" width="28" height="16" rx="8" fill="{bg}"/>')
    text(lx + 14, ly + 27, b, 10, 700, fg, "middle")
    text(lx + 38, ly + 28, desc, 13, 400, "#334155")
    lx += 150
out.append(f'<path d="M{lx},{ly+23} h60" stroke="#475569" stroke-width="1.7"/>')
text(lx - 6, ly + 20, "1", 13, 700, "#334155", "end")
text(lx + 66, ly + 20, "N", 13, 700, "#334155")
text(lx + 84, ly + 28, "one-to-many relationship (the N side holds the foreign key)", 13, 400, "#334155")
text(W - 60, ly + 28, "Actor references to User (graded_by, warden_user_id, …) are shown as FK fields only.", 13, 400, "#64748b", "end", italic=True)

svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" '
       f'font-family="Inter, -apple-system, Helvetica, Arial, sans-serif">'
       f'<rect width="{W}" height="{H}" fill="#ffffff"/>' + "".join(out) + "</svg>")
doc = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>UniCore — ER Diagram</title>
<style>@page {{ size: {W}px {H}px; margin: 0 }} html, body {{ margin: 0; background: #fff }} svg {{ display: block }}</style>
</head><body>{svg}</body></html>
"""
dest = os.path.join(os.path.dirname(os.path.abspath(__file__)), "unicore_er_overview.html")
open(dest, "w").write(doc)
print(f"wrote {dest}")
