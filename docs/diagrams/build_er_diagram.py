#!/usr/bin/env python3
"""Build the UniCore entity-relationship diagram from the SQL schema.

Reads  database/schema.sql + database/V001_to_V019.sql
Writes docs/diagrams/unicore_er_diagram.html

Regenerate after a schema change, then print to PDF (A4 landscape, no margins):
    python3 docs/diagrams/build_er_diagram.py
"""
import re, json, html, os
from collections import defaultdict


def load_schema():
    DB = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "database")
    schema = open(f"{DB}/schema.sql").read()
    migs   = open(f"{DB}/V001_to_V019.sql").read()

    # ---- tables + columns from schema.sql ----
    tables = {}
    for m in re.finditer(r'CREATE TABLE\s+"?(\w+)"?\s*\((.*?)\n\);', schema, re.S):
        name, body = m.group(1), m.group(2)
        cols = []
        depth = 0; cur = ""
        for ch in body:
            if ch == '(': depth += 1
            if ch == ')': depth -= 1
            if ch == ',' and depth == 0:
                cur_s = cur.strip()
                if cur_s: cols.append(cur_s)
                cur = ""
            else:
                cur += ch
        if cur.strip(): cols.append(cur.strip())
        out = []
        tbl_pk = []
        for c in cols:
            cm = re.match(r'"(\w+)"\s+([A-Za-z0-9_()\s,]+?)(\s|$)', c)
            if c.upper().startswith('CONSTRAINT') or c.upper().startswith('UNIQUE') or c.upper().startswith('CHECK'):
                pk = re.search(r'PRIMARY KEY\s*\(([^)]*)\)', c, re.I)
                if pk: tbl_pk = [x.strip().strip('"') for x in pk.group(1).split(',')]
                continue
            if not cm: continue
            col, typ = cm.group(1), cm.group(2).strip()
            flags = []
            cu = c.upper()
            if 'PRIMARY KEY' in cu: flags.append('PK')
            if 'UNIQUE' in cu: flags.append('UQ')
            if 'NOT NULL' in cu and 'PK' not in flags: flags.append('NN')
            out.append({'name': col, 'type': typ.lower(), 'flags': flags})
        for c in out:
            if c['name'] in tbl_pk and 'PK' not in c['flags']:
                c['flags'].insert(0, 'PK')
        tables[name] = out

    # ---- ALTER-added columns ----
    for m in re.finditer(r'ALTER TABLE\s+"?(\w+)"?\s+ADD COLUMN\s+"?(\w+)"?\s+(\w+)', schema):
        t, c, ty = m.groups()
        if t in tables: tables[t].append({'name': c, 'type': ty.lower(), 'flags': []})

    # ---- FKs ----
    def norm(schema_name, tbl): return f"{schema_name}_{tbl}"
    fks = []
    seen = set()
    # migration-style: ALTER TABLE "s"."t" ... FOREIGN KEY ("c") REFERENCES "s2"."t2"("c2") ON DELETE X
    for m in re.finditer(r'ALTER TABLE\s+"(\w+)"\."(\w+)"\s+ADD CONSTRAINT\s+"[^"]+"\s+FOREIGN KEY\s*\("(\w+)"\)\s*REFERENCES\s+"(\w+)"\."(\w+)"\("(\w+)"\)(?:\s+ON DELETE (\w+(?:\s+\w+)?))?', migs):
        s1,t1,c1,s2,t2,c2,act = m.groups()
        k = (norm(s1,t1), c1, norm(s2,t2))
        if k in seen: continue
        seen.add(k)
        fks.append({'from': norm(s1,t1), 'col': c1, 'to': norm(s2,t2), 'tocol': c2, 'action': (act or 'NO ACTION').upper()})
    # inline REFERENCES in both files
    for src in (schema, migs):
        for m in re.finditer(r'"(\w+)"\s+\w+\s*(?:NOT NULL\s*)?REFERENCES\s+(?:"(\w+)"\."(\w+)"|(\w+))\("(\w+)"\)', src):
            c1, s2, t2, plain, c2 = m.groups()
            target = norm(s2,t2) if s2 else plain
            # find owning table = nearest preceding CREATE TABLE
            pos = m.start()
            owner = None
            for om in re.finditer(r'CREATE TABLE\s+(?:"(\w+)"\."(\w+)"|"?(\w+)"?)\s*\(', src):
                if om.start() < pos:
                    owner = norm(om.group(1), om.group(2)) if om.group(1) else om.group(3)
                else: break
            if not owner: continue
            k = (owner, c1, target)
            if k in seen: continue
            seen.add(k)
            fks.append({'from': owner, 'col': c1, 'to': target, 'tocol': c2, 'action': 'NO ACTION'})


    return {'tables': tables, 'fks': fks}


D = load_schema()
TBL, FKS = D["tables"], D["fks"]

# ---- style-guide tokens (default skin) ----
PAPER, PAPER2 = "#f5f5f5", "#ececec"
INK, MUTED, SOFT = "#2d3142", "#4f5d75", "#7a8399"
RULE, RULE_SOLID = "rgba(45,49,66,0.12)", "#bfc0c0"
ACCENT, ACCENT_TINT = "#eb6c36", "rgba(235,108,54,0.08)"
LINK = "#2e5aa8"

W, H = 1120, 792                      # print-a4-landscape
M = 40                                # outer margin
BOX_W, HDR_H, ROW_H, GAP = 200, 28, 16, 24
MAX_ROWS = 10
AUDIT = {"created_at", "updated_at", "deleted_at", "version"}

MODULES = [
    ("auth",    "auth",    "Identity & Access"),
    ("academic","academic","Academic Core"),
    ("exam",    "exam",    "Examination"),
    ("hostel",  "hostel",  "Hostel & Residence"),
    ("library", "library", "Library"),
    ("ops",     None,      "Campus Ops, Audit & Admin"),
]
def mod_of(t):
    for p in ("auth","academic","exam","hostel","library"):
        if t.startswith(p + "_"): return p
    return "ops"

LAYOUT = {
 "auth":     [["auth_permissions","auth_roles"],
              ["auth_role_permissions","auth_user_roles"],
              ["auth_users","auth_refresh_tokens"]],
 "academic": [["academic_departments","academic_programs","academic_semesters"],
              ["academic_faculty","academic_students"],
              ["academic_courses","academic_course_offerings"],
              ["academic_enrollments","academic_attendance","academic_schedules"]],
 "exam":     [["exam_exam_types","exam_grade_scale"],
              ["exam_exams","exam_final_results"],
              ["exam_marks","exam_student_exam_details"]],
 "hostel":   [["hostel_hostels","hostel_waitlist"],
              ["hostel_blocks","hostel_complaints"],
              ["hostel_rooms","hostel_outpasses"],
              ["hostel_beds","hostel_allocations"]],
 "library":  [["library_publishers","library_subjects","library_authors"],
              ["library_books","library_book_authors"],
              ["library_book_copies","library_reservations"],
              ["library_issues","library_fines"]],
 "ops":      [["core_support_tickets","core_notifications"],
              ["core_facility_requests","core_campus_events"],
              ["core_system_settings","admin_action_logs"],
              ["audit_audit_logs","audit_outbox"]],
}

FK_BY_SRC = defaultdict(list)
for f in FKS: FK_BY_SRC[f["from"]].append(f)
def fkcols(t): return {f["col"]: f for f in FK_BY_SRC[t]}

SCHEMAS = ("auth","academic","exam","hostel","library","core","audit","admin")
def pretty(t):
    for p in SCHEMAS:
        if t.startswith(p + "_"): return t[len(p)+1:].replace("_", " ")
    return t.replace("_", " ")
def schema_of(t):
    for p in SCHEMAS:
        if t.startswith(p + "_"): return p
    return ""
def qual(t):
    p = t.split("_", 1)[0]
    return f"{p}.{t.split('_',1)[1]}"
def esc(s): return html.escape(str(s), quote=True)

# ---------------- box model ----------------
class Box:
    def __init__(self, name, x, y):
        self.name, self.x, self.y = name, x, y
        fkc = fkcols(name)
        cols = [c for c in TBL[name] if c["name"] not in AUDIT]
        self.hidden = len(TBL[name]) - len(cols)
        self.over = 0
        if len(cols) > MAX_ROWS:
            self.over = len(cols) - MAX_ROWS
            keep = [c for c in cols if "PK" in c["flags"] or c["name"] in fkc]
            extra = [c for c in cols if c not in keep]
            cols = (keep + extra)[:MAX_ROWS]
            cols.sort(key=lambda c: [x["name"] for x in TBL[name]].index(c["name"]))
        self.cols = cols
        self.fkc  = fkc
        self.h = HDR_H + len(cols) * ROW_H + (ROW_H if (self.over or self.hidden) else 0)
    @property
    def w(self):  return BOX_W
    @property
    def cx(self): return self.x + BOX_W / 2
    @property
    def cy(self): return self.y + self.h / 2
    @property
    def r(self):  return self.x + BOX_W
    @property
    def b(self):  return self.y + self.h

def render_box(b, focal=False, show_schema=False):
    o, n = [], b.name
    hdr_fill = ACCENT_TINT if focal else PAPER2
    hdr_str  = ACCENT if focal else INK
    o.append(f'<rect x="{b.x}" y="{b.y}" width="{BOX_W}" height="{b.h}" rx="6" fill="{PAPER}"/>')
    o.append(f'<rect x="{b.x}" y="{b.y}" width="{BOX_W}" height="{b.h}" rx="6" fill="#ffffff" '
             f'stroke="{hdr_str if focal else RULE_SOLID}" stroke-width="1"/>')
    # header band
    o.append(f'<path d="M {b.x} {b.y+HDR_H} L {b.x} {b.y+6} A 6 6 0 0 1 {b.x+6} {b.y} '
             f'L {b.r-6} {b.y} A 6 6 0 0 1 {b.r} {b.y+6} L {b.r} {b.y+HDR_H} Z" fill="{hdr_fill}"/>')
    o.append(f'<line x1="{b.x}" y1="{b.y+HDR_H}" x2="{b.r}" y2="{b.y+HDR_H}" '
             f'stroke="{hdr_str if focal else RULE_SOLID}" stroke-width="1"/>')
    o.append(f'<text x="{b.x+10}" y="{b.y+18}" fill="{hdr_str}" font-size="12" font-weight="600" '
             f'font-family="Geist, sans-serif">{esc(pretty(n))}</text>')
    tag = f"{schema_of(n)} \u00b7 {len(TBL[n])}" if show_schema else str(len(TBL[n]))
    o.append(f'<text x="{b.r-10}" y="{b.y+18}" fill="{SOFT}" font-size="8" '
             f'font-family="\'Geist Mono\', monospace" text-anchor="end">{esc(tag)}</text>')
    # rows
    for i, c in enumerate(b.cols):
        ry = b.y + HDR_H + i * ROW_H
        if i % 2 == 1:
            o.append(f'<rect x="{b.x+1}" y="{ry}" width="{BOX_W-2}" height="{ROW_H}" fill="rgba(45,49,66,0.02)"/>')
        pk = "PK" in c["flags"]
        fk = c["name"] in b.fkc
        mark, mcol = ("#", ACCENT) if pk else (("→", LINK) if fk else ("", SOFT))
        ty = ry + 11
        if mark:
            o.append(f'<text x="{b.x+10}" y="{ty}" fill="{mcol}" font-size="9" font-weight="600" '
                     f'font-family="\'Geist Mono\', monospace">{mark}</text>')
        nm = c["name"]
        if len(nm) > 20: nm = nm[:19] + "\u2026"
        o.append(f'<text x="{b.x+20}" y="{ty}" fill="{INK if (pk or fk) else MUTED}" font-size="9" '
                 f'font-weight="{600 if pk else 400}" font-family="\'Geist Mono\', monospace">{esc(nm)}</text>')
        # right slot shares the row with the name — budget the space it has left
        avail = 170 - len(nm) * 5.42 - 8
        if fk and mod_of(b.fkc[c["name"]]["to"]) != mod_of(n):
            tgt = b.fkc[c["name"]]["to"]
            for cand in (qual(tgt), tgt.split("_", 1)[1]):
                if (len(cand) + 1) * 4.22 <= avail:
                    lbl = "\u2197" + cand; break
            else:
                k = int(avail / 4.22) - 2
                short = tgt.split("_", 1)[1]
                lbl = "\u2197" + (short[:k] + "\u2026" if k >= 4 else "")
            o.append(f'<text x="{b.r-10}" y="{ty}" fill="{LINK}" font-size="7" '
                     f'font-family="\'Geist Mono\', monospace" text-anchor="end">{esc(lbl)}</text>')
        else:
            t = c["type"].split("(")[0].strip()
            t = {"integer":"int","text":"text","real":"real","date":"date","tsvector":"tsvec"}.get(t, t)
            flg = "UQ " if "UQ" in c["flags"] else ""
            lbl = flg + t
            if len(lbl) * 4.22 > avail: lbl = t
            if len(lbl) * 4.22 > avail: lbl = ""
            if lbl:
                o.append(f'<text x="{b.r-10}" y="{ty}" fill="{SOFT}" font-size="8" '
                         f'font-family="\'Geist Mono\', monospace" text-anchor="end">{esc(lbl)}</text>')
    if b.over or b.hidden:
        ry = b.y + HDR_H + len(b.cols) * ROW_H
        bits = []
        if b.over:   bits.append(f"+{b.over} more")
        if b.hidden: bits.append(f"+{b.hidden} audit")
        o.append(f'<line x1="{b.x+1}" y1="{ry}" x2="{b.r-1}" y2="{ry}" stroke="{RULE}" stroke-width="0.8"/>')
        o.append(f'<text x="{b.x+20}" y="{ry+11}" fill="{SOFT}" font-size="8" font-style="italic" '
                 f'font-family="\'Geist Mono\', monospace">{esc(" · ".join(bits))}</text>')
    return "\n".join(o)

# ---------------- orthogonal router ----------------
DIAG_TOP, DIAG_BOT = 188, 664
COL_X = [40, 320, 600, 880]
GAP_V = 20

def rpath(pts, r=8):
    """Waypoints -> path string with rounded right-angle corners."""
    pts = [pts[0]] + [p for i, p in enumerate(pts[1:-1], 1)
                      if not (p == pts[i-1])] + [pts[-1]]
    if len(pts) == 2:
        return f"M {pts[0][0]} {pts[0][1]} L {pts[1][0]} {pts[1][1]}"
    d = [f"M {pts[0][0]} {pts[0][1]}"]
    for i in range(1, len(pts) - 1):
        (px, py), (cx, cy), (nx, ny) = pts[i-1], pts[i], pts[i+1]
        v1 = (cx - px, cy - py); v2 = (nx - cx, ny - cy)
        l1 = abs(v1[0]) + abs(v1[1]); l2 = abs(v2[0]) + abs(v2[1])
        rr = min(r, l1 / 2, l2 / 2)
        if rr < 1:
            d.append(f"L {cx} {cy}"); continue
        u1 = (v1[0] / l1, v1[1] / l1); u2 = (v2[0] / l2, v2[1] / l2)
        a = (cx - u1[0] * rr, cy - u1[1] * rr)
        b = (cx + u2[0] * rr, cy + u2[1] * rr)
        cross = u1[0] * u2[1] - u1[1] * u2[0]
        d.append(f"L {a[0]:.1f} {a[1]:.1f} A {rr:.1f} {rr:.1f} 0 0 {1 if cross > 0 else 0} {b[0]:.1f} {b[1]:.1f}")
    d.append(f"L {pts[-1][0]} {pts[-1][1]}")
    return " ".join(d)

EDGE_STYLE = {
    "CASCADE":  (INK,   1.2, None),
    "RESTRICT": (MUTED, 1.0, None),
    "SET NULL": (MUTED, 1.0, "4,3"),
    "NO ACTION":(MUTED, 1.0, None),
}

def route_module(boxes, edges):
    """boxes: {name: Box}, edges: list of fk dicts (intra-module only)."""
    colof = {}
    for ci, col in enumerate(LAYOUT_ACTIVE):
        for t in col:
            if t in boxes: colof[t] = ci
    plans, attach = [], defaultdict(list)
    lane_over, lane_under = [], []
    for e in edges:
        a, b = boxes[e["from"]], boxes[e["to"]]
        ca, cb = colof[e["from"]], colof[e["to"]]
        if e["from"] == e["to"]:
            plans.append({"e": e, "kind": "self", "a": a, "b": b}); continue
        if ca == cb:
            kind = "side"
        elif abs(ca - cb) == 1:
            kind = "hop"
        else:
            kind = "band"
        p = {"e": e, "kind": kind, "a": a, "b": b, "ca": ca, "cb": cb}
        if kind == "hop":
            sa = "R" if cb > ca else "L"
            sb = "L" if cb > ca else "R"
            attach[(e["from"], sa)].append((b.cy, p, "a"))
            attach[(e["to"],  sb)].append((a.cy, p, "b"))
        elif kind == "side":
            side = "L" if ca > 0 else "R"
            attach[(e["from"], side)].append((b.cy, p, "a"))
            attach[(e["to"],  side)].append((a.cy, p, "b"))
            p["side"] = side
        else:
            up = len(lane_over) <= len(lane_under)
            p["up"] = up
            (lane_over if up else lane_under).append(p)
            attach[(e["from"], "T" if up else "B")].append((b.cx, p, "a"))
            attach[(e["to"],   "T" if up else "B")].append((a.cx, p, "b"))
        plans.append(p)
    # fan attach points
    for (tname, side), reqs in attach.items():
        bx = boxes[tname]
        reqs.sort(key=lambda r: r[0])
        n = len(reqs)
        if side in ("L", "R"):
            usable = bx.h - HDR_H - 8
            for k, (_, p, role) in enumerate(reqs, 1):
                y = bx.y + HDR_H + 4 + usable * k / (n + 1)
                p[role + "pt"] = (bx.x if side == "L" else bx.r, round(y))
                p[role + "side"] = side
        else:
            for k, (_, p, role) in enumerate(reqs, 1):
                x = bx.x + BOX_W * k / (n + 1)
                p[role + "pt"] = (round(x), bx.y if side == "T" else bx.b)
                p[role + "side"] = side
    # channel x within gutters
    bygut = defaultdict(list)
    for p in plans:
        if p["kind"] == "hop":
            bygut[min(p["ca"], p["cb"])].append(p)
    for g, ps in bygut.items():
        x0 = COL_X[g] + BOX_W; x1 = COL_X[g + 1]
        ps.sort(key=lambda p: p["apt"][1])
        for k, p in enumerate(ps, 1):
            p["chx"] = round(x0 + (x1 - x0) * k / (len(ps) + 1))
    # side channels
    byside = defaultdict(list)
    for p in plans:
        if p["kind"] == "side": byside[(p["ca"], p["side"])].append(p)
    for (ci, side), ps in byside.items():
        base = COL_X[ci] - 16 if side == "L" else COL_X[ci] + BOX_W + 16
        for k, p in enumerate(ps, 1):
            p["chx"] = base + (-12 * (k - 1) if side == "L" else 12 * (k - 1))
    # band lanes
    for k, p in enumerate(sorted(lane_over, key=lambda p: -abs(p["ca"] - p["cb"])), 1):
        p["bandy"] = DIAG_TOP - 10 - 12 * k
    for k, p in enumerate(sorted(lane_under, key=lambda p: -abs(p["ca"] - p["cb"])), 1):
        p["bandy"] = DIAG_BOT + 10 + 12 * k
    # emit
    out = []
    for p in plans:
        e = p["e"]; col, sw, dash = EDGE_STYLE[e["action"]]
        a, b = p["a"], p["b"]
        if p["kind"] == "self":
            y1 = a.y + HDR_H + 12; y2 = a.b - 12; xo = a.r + 16
            pts = [(a.r, y1), (xo, y1), (xo, y2), (a.r, y2)]
            lbl = ((a.r + xo) / 2 + 10, (y1 + y2) / 2)
        else:
            ap, bp = p["apt"], p["bpt"]
            if p["kind"] == "hop":
                cx = p["chx"]; pts = [ap, (cx, ap[1]), (cx, bp[1]), bp]
                lbl = (cx, min(ap[1], bp[1]) - 6) if ap[1] != bp[1] else (cx, ap[1] - 14)
            elif p["kind"] == "side":
                cx = p["chx"]; pts = [ap, (cx, ap[1]), (cx, bp[1]), bp]
                lbl = (cx, (ap[1] + bp[1]) / 2)
            else:
                by = p["bandy"]; pts = [ap, (ap[0], by), (bp[0], by), bp]
                lbl = ((ap[0] + bp[0]) / 2, by - 6)
        dd = f' stroke-dasharray="{dash}"' if dash else ""
        out.append(f'<path d="{rpath(pts)}" fill="none" stroke="{col}" stroke-width="{sw}"{dd} '
                   f'stroke-linecap="round"/>')
        # cardinality: N at child end, 1 at parent end
        for pt, side, txt in ((p.get("apt"), p.get("aside"), "N"), (p.get("bpt"), p.get("bside"), "1")):
            if not pt: continue
            dx = -13 if side == "L" else (13 if side == "R" else 0)
            dy = -9 if side in ("L", "R", "T") else 15
            out.append(f'<circle cx="{pt[0]}" cy="{pt[1]}" r="2" fill="{col}"/>')
            out.append(f'<text x="{pt[0] + dx}" y="{pt[1] + dy}" fill="{SOFT}" font-size="8" '
                       f'font-family="\'Geist Mono\', monospace" text-anchor="middle">{txt}</text>')
    return "\n".join(out)

# ---------------- page chrome ----------------
def svg_open(slug, title, desc):
    return (f'<svg viewBox="0 0 {W} {H}" role="img" aria-labelledby="{slug}-title {slug}-desc" '
            f'xmlns="http://www.w3.org/2000/svg">\n'
            f'<title id="{slug}-title">{esc(title)}</title>\n'
            f'<desc id="{slug}-desc">{esc(desc)}</desc>\n'
            f'<defs>\n'
            f'<marker id="ar-{slug}" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">'
            f'<polygon points="0 0, 8 3, 0 6" fill="{MUTED}"/></marker>\n'
            f'<marker id="ara-{slug}" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">'
            f'<polygon points="0 0, 8 3, 0 6" fill="{ACCENT}"/></marker>\n'
            f'</defs>\n'
            f'<rect width="100%" height="100%" fill="{PAPER}"/>')

def header(eyebrow, title, sub, serif=False):
    fam = "'Instrument Serif', serif" if serif else "Geist, sans-serif"
    sty = ' font-style="italic"' if serif else ''
    return (f'<text x="{M}" y="60" fill="{SOFT}" font-size="8" font-family="\'Geist Mono\', monospace" '
            f'letter-spacing="0.16em">{esc(eyebrow.upper())}</text>\n'
            f'<text x="{M}" y="98" fill="{INK}" font-size="32" font-family="\'Instrument Serif\', serif">'
            f'{esc(title)}</text>\n'
            f'<text x="{M}" y="124" fill="{MUTED}" font-size="14" font-family="{fam}"{sty}>'
            f'{esc(sub)}</text>\n'
            f'<line x1="{M}" y1="140" x2="{W-M}" y2="140" stroke="{RULE}" stroke-width="0.8"/>')

def footer(page, total, right=""):
    o = [f'<line x1="{M}" y1="748" x2="{W-M}" y2="748" stroke="{RULE}" stroke-width="0.8"/>',
         f'<text x="{M}" y="766" fill="{SOFT}" font-size="8" font-family="\'Geist Mono\', monospace" '
         f'letter-spacing="0.14em">UNICORE · ENTITY–RELATIONSHIP MODEL</text>',
         f'<text x="{W-M}" y="766" fill="{SOFT}" font-size="8" font-family="\'Geist Mono\', monospace" '
         f'text-anchor="end">{page} / {total}</text>']
    if right:
        o.append(f'<text x="{W/2}" y="766" fill="{SOFT}" font-size="8" '
                 f'font-family="\'Geist Mono\', monospace" text-anchor="middle">{esc(right)}</text>')
    return "\n".join(o)

def legend(items, y=716):
    """items: (kind, color, label); kind in line|dash|thick|glyph:<char>"""
    o = [f'<line x1="{M}" y1="{y-10}" x2="{W-M}" y2="{y-10}" stroke="{RULE}" stroke-width="0.8"/>',
         f'<text x="{M}" y="{y+8}" fill="{MUTED}" font-size="8" font-family="\'Geist Mono\', monospace" '
         f'letter-spacing="0.14em">LEGEND</text>']
    x = M + 68
    for kind, col, label in items:
        if kind.startswith("glyph:"):
            o.append(f'<text x="{x+8}" y="{y+9}" fill="{col}" font-size="11" font-weight="600" '
                     f'font-family="\'Geist Mono\', monospace" text-anchor="middle">{esc(kind[6:])}</text>')
        else:
            sw   = 1.2 if kind == "thick" else 1.0
            dash = ' stroke-dasharray="4,3"' if kind == "dash" else ""
            o.append(f'<line x1="{x}" y1="{y+5}" x2="{x+16}" y2="{y+5}" stroke="{col}" '
                     f'stroke-width="{sw}"{dash}/>')
        o.append(f'<text x="{x+24}" y="{y+8}" fill="{MUTED}" font-size="8" '
                 f'font-family="\'Geist Mono\', monospace">{esc(label)}</text>')
        x += 32 + len(label) * 4.9
    return "\n".join(o)

# ---------------- module pages ----------------
LAYOUT_ACTIVE = []
PAGES = []
TOTAL = len(MODULES) + 1

MODULE_FOCAL = {"auth":"auth_users", "academic":"academic_students", "exam":"exam_exams",
                "hostel":"hostel_allocations", "library":"library_issues", "ops":None}
MODULE_BLURB = {
 "auth":    "RBAC core — users hold roles, roles hold permissions, and every other module resolves identity here.",
 "academic":"Departments and programs anchor courses; a course offering is a course taught in one semester by one faculty member.",
 "exam":    "Each offering carries many exams; per-student marks roll up into one published final result per offering.",
 "hostel":  "Hostel → block → room → bed is a strict containment chain; an allocation binds one student to one bed.",
 "library": "A book is a bibliographic record; a copy is a physical item. Issues, fines and reservations hang off those two.",
 "ops":     "Cross-cutting tables: support, notifications, events, facilities, settings and the append-only audit trail.",
}

def module_page(key, prefix, title, idx):
    global LAYOUT_ACTIVE
    LAYOUT_ACTIVE = LAYOUT[key]
    names = [t for col in LAYOUT[key] for t in col]
    boxes = {}
    for ci, col in enumerate(LAYOUT[key]):
        hs = [Box(t, 0, 0).h for t in col]
        total = sum(hs) + GAP_V * (len(col) - 1)
        y = DIAG_TOP + max(0, ((DIAG_BOT - DIAG_TOP) - total) / 2)
        for t, h in zip(col, hs):
            boxes[t] = Box(t, COL_X[ci], round(y / 4) * 4)
            y += h + GAP_V
    intra = [f for f in FKS if f["from"] in boxes and f["to"] in boxes]
    ext   = [f for f in FKS if f["from"] in boxes and f["to"] not in boxes]
    slug  = f"erd-{key}"
    focal = MODULE_FOCAL[key]
    o = [svg_open(slug, f"UniCore — {title} schema",
                  f"Entity-relationship diagram of the {title} module of the UniCore university management "
                  f"system: {len(boxes)} tables, {len(intra)} internal foreign keys and {len(ext)} references "
                  f"into other modules."),
         header(f"Module {idx-1} of {len(MODULES)}", title,
                f"{len(boxes)} tables · {len(intra)} internal relationships · {len(ext)} cross-module references")]
    o.append(route_module(boxes, intra))
    for n in names:
        o.append(render_box(boxes[n], focal=(n == focal), show_schema=(key == "ops")))
    o.append(legend([
        ("thick", INK,   "on delete cascade"),
        ("line",  MUTED, "restrict"),
        ("dash",  MUTED, "set null"),
        ("glyph:#", ACCENT, "primary key"),
        ("glyph:\u2192", LINK, "foreign key"),
        ("glyph:\u2197", LINK, "cross-module ref"),
    ]))
    o.append(footer(idx, TOTAL, f"{len(boxes)} tables"))
    o.append("</svg>")
    return "\n".join(o)

# ---------------- overview page ----------------
def xmod_count(a, b):
    return sum(1 for f in FKS if mod_of(f["from"]) == a and mod_of(f["to"]) == b)

def mod_card(key, title, x, y, w, h, focal=False, cols=1):
    names = sorted(t for t in TBL if mod_of(t) == key)
    nfk   = sum(1 for f in FKS if mod_of(f["from"]) == key)
    st    = ACCENT if focal else RULE_SOLID
    fill  = ACCENT_TINT if focal else "#ffffff"
    o = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{PAPER}"/>',
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{fill}" stroke="{st}" stroke-width="1"/>',
         f'<rect x="{x+12}" y="{y+12}" width="46" height="12" rx="2" fill="none" '
         f'stroke="{st}" stroke-width="0.8"/>',
         f'<text x="{x+35}" y="{y+21}" fill="{ACCENT if focal else MUTED}" font-size="7" '
         f'font-family="\'Geist Mono\', monospace" text-anchor="middle" letter-spacing="0.08em">MODULE</text>',
         f'<text x="{x+12}" y="{y+46}" fill="{INK}" font-size="14" font-weight="600" '
         f'font-family="Geist, sans-serif">{esc(title)}</text>',
         f'<text x="{x+12}" y="{y+62}" fill="{SOFT}" font-size="8" font-family="\'Geist Mono\', monospace">'
         f'{len(names)} tables · {nfk} fk</text>',
         f'<line x1="{x+12}" y1="{y+70}" x2="{x+w-12}" y2="{y+70}" stroke="{RULE}" stroke-width="0.8"/>']
    per = (len(names) + cols - 1) // cols
    for i, t in enumerate(names):
        cc, rr = i // per, i % per
        tx = x + 12 + cc * (w - 24) / cols
        ty = y + 84 + rr * 12
        lbl = t.split("_", 1)[1] if "_" in t else t
        if len(lbl) > 22: lbl = lbl[:21] + "…"
        o.append(f'<text x="{tx}" y="{ty}" fill="{MUTED}" font-size="8" '
                 f'font-family="\'Geist Mono\', monospace">{esc(lbl)}</text>')
    return "\n".join(o)

def overview_page():
    slug = "erd-overview"
    o = [svg_open(slug, "UniCore — schema module map",
                  "Module map of the UniCore database: four consumer modules (examination, hostel, campus "
                  "operations and library) depend on an academic core, and every module resolves identity "
                  "against the shared identity and access module at the foundation."),
         header("UniCore · University Management System", "Database Entity–Relationship Model",
                f"{len(TBL)} tables · {len(FKS)} foreign keys · 6 modules · SQLite / Cloudflare D1")]
    CW, CH, CY = 224, 148, 172
    CX = [40, 312, 584, 856]
    tops = [("exam","Examination",0,2), ("hostel","Hostel & Residence",1,2),
            ("ops","Campus Ops & Audit",2,2), ("library","Library",3,2)]
    AC_X, AC_Y, AC_W, AC_H = 40, 384, 768, 104
    AU_X, AU_Y, AU_W, AU_H = 40, 552, 1040, 104
    # ---- arrows first (behind boxes) ----
    for i in (0, 1, 2):
        cx = CX[i] + CW / 2
        n = xmod_count(tops[i][0], "academic")
        o.append(f'<path d="M {cx} {CY+CH} L {cx} {AC_Y-6}" fill="none" stroke="{MUTED}" '
                 f'stroke-width="1" marker-end="url(#ar-{slug})"/>')
        o.append(f'<rect x="{cx+8}" y="{(CY+CH+AC_Y)/2-6}" width="34" height="12" rx="2" fill="{PAPER}"/>')
        o.append(f'<text x="{cx+25}" y="{(CY+CH+AC_Y)/2+3}" fill="{SOFT}" font-size="8" '
                 f'font-family="\'Geist Mono\', monospace" text-anchor="middle">{n} FK</text>')
    acx = AC_X + AC_W / 2
    o.append(f'<path d="M {acx} {AC_Y+AC_H} L {acx} {AU_Y-6}" fill="none" stroke="{ACCENT}" '
             f'stroke-width="1.2" marker-end="url(#ara-{slug})"/>')
    o.append(f'<rect x="{acx+8}" y="{(AC_Y+AC_H+AU_Y)/2-6}" width="34" height="12" rx="2" fill="{PAPER}"/>')
    o.append(f'<text x="{acx+25}" y="{(AC_Y+AC_H+AU_Y)/2+3}" fill="{SOFT}" font-size="8" '
             f'font-family="\'Geist Mono\', monospace" text-anchor="middle">{xmod_count("academic","auth")} FK</text>')
    lx = CX[3] + CW / 2
    o.append(f'<path d="M {lx} {CY+CH} L {lx} {AU_Y-6}" fill="none" stroke="{MUTED}" '
             f'stroke-width="1" marker-end="url(#ar-{slug})"/>')
    o.append(f'<rect x="{lx+8}" y="{AC_Y+AC_H/2-6}" width="34" height="12" rx="2" fill="{PAPER}"/>')
    o.append(f'<text x="{lx+25}" y="{AC_Y+AC_H/2+3}" fill="{SOFT}" font-size="8" '
             f'font-family="\'Geist Mono\', monospace" text-anchor="middle">{xmod_count("library","auth")} FK</text>')
    # ---- boxes ----
    for key, title, i, c in tops:
        o.append(mod_card(key, title, CX[i], CY, CW, CH, cols=c))
    o.append(mod_card("academic", "Academic Core", AC_X, AC_Y, AC_W, AC_H, cols=5))
    o.append(mod_card("auth", "Identity & Access", AU_X, AU_Y, AU_W, AU_H, focal=True, cols=6))
    o.append(f'<text x="{AU_X+AU_W-12}" y="{AU_Y+46}" fill="{ACCENT}" font-size="14" font-style="italic" '
             f'font-family="\'Instrument Serif\', serif" text-anchor="end">'
             f'Every module resolves identity here.</text>')
    o.append(f'<text x="{M}" y="690" fill="{MUTED}" font-size="14" font-style="italic" '
             f'font-family="\'Instrument Serif\', serif">'
             f'Dependencies run one way — downward. Nothing in the identity layer knows the modules above it.</text>')
    o.append(legend([
        ("thick", ACCENT, "primary dependency"),
        ("line",  MUTED,  "module dependency"),
    ]))
    o.append(footer(1, TOTAL, f"{len(TBL)} tables total"))
    o.append("</svg>")
    return "\n".join(o)

# ---------------- assemble ----------------
CSS = f"""
@page {{ size: {W}px {H}px; margin: 0; }}
* {{ box-sizing: border-box; }}
html, body {{ margin: 0; padding: 0; background: {PAPER2}; }}
.page {{ width: {W}px; height: {H}px; overflow: hidden; background: {PAPER};
         page-break-after: always; break-after: page; }}
.page:last-child {{ page-break-after: auto; break-after: auto; }}
.page svg {{ display: block; width: {W}px; height: {H}px; }}
@media screen {{
  body {{ padding: 24px; }}
  .page {{ margin: 0 auto 24px; border: 1px solid {RULE}; border-radius: 4px; }}
}}
"""

def main():
    pages = [overview_page()]
    for i, (key, prefix, title) in enumerate(MODULES, start=2):
        pages.append(module_page(key, prefix, title, i))
    body = "\n".join(f'<div class="page">{p}</div>' for p in pages)
    doc = (f'<!doctype html><html lang="en"><head><meta charset="utf-8">'
           f'<title>UniCore — ER Diagram</title>'
           f'<link rel="preconnect" href="https://fonts.googleapis.com">'
           f'<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
           f'<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1'
           f'&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet">'
           f'<style>{CSS}</style></head><body>{body}</body></html>')
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "unicore_er_diagram.html")
    open(out, "w").write(doc)
    print(f"wrote {out}  ({len(pages)} pages, {len(doc)//1024} KB)")

if __name__ == "__main__":
    main()
