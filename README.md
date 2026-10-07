# UniCore: Campus Operating Platform

**Centralized Operating System for 30,000+ Students**  
*Thapar Institute of Engineering & Technology, Patiala — Software Engineering Project*

🌐 **Docs website:** https://abhinav29102005.github.io/unicore/docs/  
🚀 **Live prototype:** https://unicore-frontend.pages.dev

---

## 👥 Team

| Name | Roll No. | Journal |
|------|----------|---------|
| Abhinav Kumar Singh | 1024030440 | [journal](./journals/1024030440_AbhinavKumarSingh.md) |
| Ankit Rath | 1024030458 | [journal](./journals/1024030458_AnkitRath.md) |
| Manan Kapoor | 1024030467 | [journal](./journals/1024030467_MananKapoor.md) |

---

## 📌 Deliverables — where to find everything

| Deliverable | PDF | Source |
|-------------|-----|--------|
| **Stage 1 — Project Proposal** | [PDF](./proposal/UniCore_Project_Proposal.pdf) | [`proposal/`](./proposal/) |
| **Stage 2 — Prototype Proposal** | [PDF](./docs/website/public/pdfs/prototype_proposal.pdf) | [`prototype/`](./prototype/) |
| **Stage 3 — Final Report** | [PDF](./docs/website/public/pdfs/final_report.pdf) | [`final-report/`](./final-report/) |
| **Diagrams** (use case, class, sequence, component, DFD, activity, ER) | [ER PDF](./diagrams/er/unicore_er_diagram.pdf) · [UML + DFD PDF](./diagrams/uml/uml_and_dfd.pdf) | [`diagrams/`](./diagrams/) |
| **Gantt chart, milestones, RACI, risks** | [XLSX](./planning/UniCore_Project_Gantt_Chart.xlsx) | [`planning/`](./planning/) |
| **Individual journals** | — | [`journals/`](./journals/) |
| **Database schema** (8 schemas, BCNF, triggers) | — | [`database/`](./database/) |

---

## 📁 Repository Structure

```
unicore/
├── proposal/                    # Stage 1: project proposal (PDF + LaTeX source)
├── prototype/                   # Stage 2: prototype proposal (Markdown + LaTeX source)
├── final-report/                # Stage 3: final report (Markdown + LaTeX source)
├── diagrams/                    # UML, DFD, activity and ER diagrams
│   ├── uml/                     #   UML + DFD PDF
│   ├── activity/                #   activity diagrams PDF
│   └── er/                      #   ER diagrams (generated from database/ + per-schema)
├── planning/                    # Gantt chart, milestones, RACI and risk matrix
├── journals/                    # One journal per team member
│
├── frontend/                    # Web app (React + Vite): landing, sign-in, role dashboards
├── backend/                     # REST API (TypeScript, Express + Cloudflare Worker)
├── database/                    # PostgreSQL schema, migrations V001–V019, dummy data
├── docs/website/                # Source of the docs website (interactive proposal/report viewer)
│
├── .github/workflows/deploy.yml # Builds frontend + docs website and deploys to GitHub Pages
├── docker-compose.yml           # Local PostgreSQL
└── package.json                 # npm workspaces (docs/website, frontend, backend)
```

---

## 🚀 Local Development

1. **Install dependencies (monorepo root):**
   ```bash
   npm install
   ```

2. **Run the docs website:**
   ```bash
   cd docs/website
   npm run dev
   ```

3. **Run the web app:**
   ```bash
   cd frontend
   npm run dev
   ```

---

## 📜 Key Technical Highlights

- **Normalization:** Decomposed across 8 domain schemas and 35+ tables strictly into **Boyce-Codd Normal Form (BCNF)**.
- **Concurrency Locks:** Row-level `SELECT FOR UPDATE` and `pg_advisory_xact_lock()` preventing double-booking of rooms and exam seats.
- **Automated Triggers:** PL/SQL `BEFORE` triggers enforcing library fine limits (> Rs. 500 block) and `AFTER` triggers producing JSON diff audit ledgers.
- **Evaluation Metric:** Time-To-Acknowledgement (TTA) median target $\le 2$ hours across 30,000+ active students.
