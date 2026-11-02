#!/usr/bin/env python3
"""Build the UniCore UML deployment diagram.

Writes docs/diagrams/deployment/unicore_deployment_diagram.html
Print it to PDF (Chrome, no margins) to refresh unicore_deployment_diagram.pdf:
    python3 docs/diagrams/deployment/build_deployment_diagram.py
"""
import html, os

W, H = 1600, 1080
D = 14  # depth of the 3D node boxes
INK, MUTED, LINE = "#1f2937", "#6b7280", "#374151"

out = []


def text(x, y, s, size=13, weight=400, fill=INK, anchor="start", italic=False):
    style = ' font-style="italic"' if italic else ""
    out.append(f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{weight}" '
               f'fill="{fill}" text-anchor="{anchor}"{style}>{html.escape(s)}</text>')


def node(x, y, w, h, stereo, name, sub, fill):
    """UML node: a 3D box with a «stereotype», name and subtitle."""
    out.append(f'<polygon points="{x},{y+D} {x+D},{y} {x+w+D},{y} {x+w},{y+D}" fill="{fill}" stroke="{LINE}" stroke-width="1.4"/>')
    out.append(f'<polygon points="{x+w},{y+D} {x+w+D},{y} {x+w+D},{y+h} {x+w},{y+h+D}" fill="{fill}" stroke="{LINE}" stroke-width="1.4" filter="url(#shade)"/>')
    out.append(f'<rect x="{x}" y="{y+D}" width="{w}" height="{h}" fill="{fill}" stroke="{LINE}" stroke-width="1.4"/>')
    text(x + w / 2, y + D + 22, f"«{stereo}»", 12, fill=MUTED, anchor="middle")
    text(x + w / 2, y + D + 42, name, 16, 700, anchor="middle")
    if sub:
        text(x + w / 2, y + D + 60, sub, 12, fill=MUTED, anchor="middle")


def artifact(x, y, w, h, title, lines, stereo="artifact"):
    """UML artifact: a box with a folded-corner document icon."""
    out.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="4" fill="#ffffff" stroke="{LINE}" stroke-width="1.1"/>')
    ix, iy = x + w - 22, y + 8
    out.append(f'<path d="M{ix},{iy} h9 l5,5 v13 h-14 z M{ix+9},{iy} v5 h5" fill="none" stroke="{MUTED}" stroke-width="1"/>')
    text(x + 10, y + 17, f"«{stereo}»", 11, fill=MUTED)
    text(x + 10, y + 34, title, 13, 700)
    for i, line in enumerate(lines):
        text(x + 10, y + 51 + i * 16, line, 12, fill="#374151")


def path(points, label=None, lx=0, ly=0, dashed=False, anchor="middle"):
    d = "M" + " L".join(f"{px},{py}" for px, py in points)
    dash = ' stroke-dasharray="6 4"' if dashed else ""
    out.append(f'<path d="{d}" fill="none" stroke="{LINE}" stroke-width="1.6"{dash} marker-end="url(#arrow)"/>')
    if label:
        for i, part in enumerate(label.split("\n")):
            text(lx, ly + i * 15, part, 12, 600, fill="#111827", anchor=anchor)


# ── Title ──
text(40, 52, "UniCore — Deployment Diagram", 30, 800)
text(40, 80, "UML deployment view of the running system: where each artifact is hosted and how the nodes communicate.", 14, fill=MUTED)

# ── Client ──
node(40, 150, 300, 300, "device", "Web Browser", "Students · Faculty · Staff · Admin", "#eef2ff")
artifact(60, 245, 260, 92, "UniCore web app", ["React 19 + Vite SPA", "dashboards, sign-in, landing"])
artifact(60, 350, 260, 76, "Docs website", ["proposal / prototype / final report"])

# ── Static hosting ──
node(440, 150, 370, 240, "cloud platform", "GitHub Pages", "abhinav29102005.github.io/unicore", "#f0fdf4")
artifact(460, 245, 330, 60, "Web app build", ["code/frontend/dist → /unicore/"])
artifact(460, 315, 330, 60, "Docs website build", ["docs/website/dist → /unicore/docs/"])

node(440, 440, 370, 150, "cloud platform", "Cloudflare Pages", "unicore-frontend.pages.dev/unicore", "#fff7ed")
artifact(460, 520, 330, 56, "Web app build", ["code/frontend/dist"])

# ── API ──
node(910, 150, 330, 330, "cloud platform", "Cloudflare Workers", "unicore-backend.*.workers.dev", "#fff7ed")
out.append(f'<rect x="926" y="240" width="298" height="222" rx="6" fill="#ffffff" fill-opacity="0.55" stroke="{LINE}" stroke-dasharray="4 3"/>')
text(1075, 258, "«execution environment»", 11, fill=MUTED, anchor="middle")
text(1075, 274, "Workers runtime (V8 isolate)", 13, 700, anchor="middle")
artifact(942, 286, 266, 162, "REST API", [
    "code/backend/src/worker.ts",
    "GET  /health",
    "POST /api/auth/login",
    "GET  /api/admin/{stats,users,departments}",
    "GET  /api/faculty/:id/dashboard",
    "GET  /api/student/:no/{dashboard,…}",
], stereo="artifact")

# ── Database ──
node(1330, 150, 230, 200, "database server", "Turso", "libSQL · aws-ap-northeast-1", "#fdf2f8")
artifact(1346, 245, 198, 76, "UniCore database", ["users, academic, hostel,", "library, exam data"], stereo="database")

# ── Build / deploy ──
node(40, 730, 520, 270, "cloud platform", "GitHub", "github.com/abhinav29102005/unicore", "#f8fafc")
artifact(60, 825, 230, 76, "Source repository", ["code/ · docs/ · reports"])
out.append(f'<rect x="305" y="815" width="235" height="165" rx="6" fill="#ffffff" fill-opacity="0.55" stroke="{LINE}" stroke-dasharray="4 3"/>')
text(422, 833, "«execution environment»", 11, fill=MUTED, anchor="middle")
text(422, 849, "GitHub Actions", 13, 700, anchor="middle")
artifact(318, 860, 210, 108, "deploy.yml", ["on push to main:", "build code/frontend", "build docs/website", "→ deploy to Pages"])

node(650, 730, 910, 270, "device", "Developer Machine", "local development & manual deploys", "#f8fafc")
artifact(670, 825, 270, 92, "Vite dev server", ["code/frontend · npm run dev", "docs/website · npm run dev"], stereo="execution environment")
artifact(955, 825, 280, 92, "Express API (local)", ["code/backend/src/index.ts · :3000", "libSQL: local.db or Turso"], stereo="execution environment")
artifact(1250, 825, 290, 92, "PostgreSQL 15 (Docker)", ["code/docker-compose.yml · :5433", "reference schema: code/database"], stereo="execution environment")
artifact(670, 928, 565, 56, "wrangler CLI", ["deploys code/backend to Cloudflare Workers"], stereo="tool")

# ── Communication paths ──
path([(190, 150), (190, 112), (1075, 112), (1075, 150)],
     "HTTPS · REST / JSON (fetch, CORS)", 640, 104)
path([(354, 265), (440, 265)], "HTTPS", 397, 257)
path([(300, 478), (300, 530), (440, 530)], "HTTPS", 345, 522)
path([(1254, 300), (1330, 300)], "libSQL\nover HTTPS", 1292, 278)
path([(390, 730), (390, 365), (440, 365)], "deploy-pages\n(on push)", 398, 640, dashed=True, anchor="start")
path([(700, 730), (700, 604)], "upload build", 708, 680, dashed=True, anchor="start")
path([(1075, 730), (1075, 494)], "wrangler deploy", 1083, 620, dashed=True, anchor="start")
path([(650, 865), (574, 865)], "git push", 612, 856, dashed=True)

# ── Legend ──
lx, ly = 1330, 400
out.append(f'<rect x="{lx}" y="{ly}" width="244" height="150" rx="6" fill="#ffffff" stroke="#d1d5db"/>')
text(lx + 14, ly + 24, "Legend", 13, 700)
out.append(f'<path d="M{lx+14},{ly+46} h44" stroke="{LINE}" stroke-width="1.6" marker-end="url(#arrow)"/>')
text(lx + 68, ly + 50, "runtime request", 12)
out.append(f'<path d="M{lx+14},{ly+72} h44" stroke="{LINE}" stroke-width="1.6" stroke-dasharray="6 4" marker-end="url(#arrow)"/>')
text(lx + 68, ly + 76, "build / deploy step", 12)
out.append(f'<polygon points="{lx+14},{ly+98} {lx+20},{ly+92} {lx+46},{ly+92} {lx+40},{ly+98}" fill="#e5e7eb" stroke="{LINE}"/>')
out.append(f'<rect x="{lx+14}" y="{ly+98}" width="26" height="16" fill="#e5e7eb" stroke="{LINE}"/>')
text(lx + 68, ly + 110, "node (hardware / platform)", 12)
out.append(f'<rect x="{lx+14}" y="{ly+122}" width="26" height="16" rx="2" fill="#ffffff" stroke="{LINE}"/>')
text(lx + 68, ly + 134, "artifact deployed on a node", 12)

text(40, 1050, "Production data lives in Turso (libSQL). The PostgreSQL container is only used locally for the reference schema in code/database.", 12, fill=MUTED, italic=True)

svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" '
       f'font-family="Inter, Helvetica, Arial, sans-serif">'
       '<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">'
       f'<path d="M0,0 L10,5 L0,10 z" fill="{LINE}"/></marker>'
       '<filter id="shade"><feColorMatrix type="matrix" values="0.9 0 0 0 0 0 0.9 0 0 0 0 0 0.9 0 0 0 0 0 1 0"/></filter></defs>'
       f'<rect width="{W}" height="{H}" fill="#ffffff"/>' + "".join(out) + "</svg>")

doc = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>UniCore — Deployment Diagram</title>
<style>@page {{ size: {W}px {H}px; margin: 0 }} html, body {{ margin: 0; background: #fff }} svg {{ display: block }}</style>
</head><body>{svg}</body></html>
"""

path_out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "unicore_deployment_diagram.html")
open(path_out, "w").write(doc)
print(f"wrote {path_out}")
