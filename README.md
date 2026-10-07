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

### Who worked on what

| Area | Abhinav | Ankit | Manan |
|------|:-------:|:-----:|:-----:|
| Ideation & elevator pitch | | ✅ | ✅ |
| Proposal writing (objectives, SDLC, ethics, risks) | | ✅ | ✅ |
| [`diagrams/`](./diagrams/) — UML, DFD, activity, ER | | | ✅ |
| [`database/`](./database/) — schema design & BCNF review | ✅ | ✅ | |
| [`backend/`](./backend/) — REST API | ✅ | ✅ | ✅ |
| [`frontend/`](./frontend/) — web app & dashboards | ✅ | | |
| [`docs/website/`](./docs/website/) & CI/CD ([`deploy.yml`](./.github/workflows/deploy.yml)) | ✅ | | |
| Deployment (GitHub Pages, Cloudflare Pages & Workers) | ✅ | | |
| Software engineering principles & code review | | ✅ | |
| [`planning/`](./planning/) — Gantt, RACI, risk matrix | ✅ | ✅ | ✅ |

Weekly details are in each member's journal.

---

## 📌 Deliverables — where to find everything

| Deliverable | PDF | Source |
|-------------|-----|--------|
| **Stage 1 — Project Proposal** | [PDF](./proposal/UniCore_Project_Proposal.pdf) | [`proposal/`](./proposal/) |
| **Stage 2 — Prototype Proposal** | [PDF](./prototype/UniCore_Prototype_Proposal.pdf) | [`prototype/`](./prototype/) |
| **Stage 3 — Final Report** | [PDF](./final-report/UniCore_Final_Report.pdf) | [`final-report/`](./final-report/) |
| **Diagrams** (use case, class, sequence, component, DFD, activity, ER) | [ER PDF](./diagrams/er/unicore_er_diagram.pdf) · [UML + DFD PDF](./diagrams/uml/uml_and_dfd.pdf) | [`diagrams/`](./diagrams/) |
| **Gantt chart, milestones, RACI, risks** | [XLSX](./planning/UniCore_Project_Gantt_Chart.xlsx) | [`planning/`](./planning/) |
| **Individual journals** | — | [`journals/`](./journals/) |
| **Database schema** (8 schemas, BCNF) | — | [`database/`](./database/) |

---

## 📁 Repository Structure

**📄 Project documents** — everything to review is here

```
proposal/          Stage 1: project proposal (PDF + LaTeX source)
prototype/         Stage 2: prototype proposal (PDF + Markdown + LaTeX source)
final-report/      Stage 3: final report (PDF + Markdown + LaTeX source)
diagrams/          UML, DFD, activity and ER diagrams (shown in its README)
planning/          Gantt chart, milestones, RACI and risk matrix
journals/          One weekly journal per team member
```

**💻 Source code**

```
frontend/          Web app (React + Vite): landing, sign-in, role dashboards
backend/           REST API (TypeScript, Express + Cloudflare Worker)
database/          PostgreSQL schema, migrations V001–V019, dummy data
docs/website/      Source of the docs website (interactive proposal/report viewer)
```

**⚙️ Config** — `.github/workflows/deploy.yml` (GitHub Pages deploy), `docker-compose.yml` (local PostgreSQL), `package.json` (npm workspaces)

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

## 📜 Key Design Specifications (from the proposal)

> These are the design targets set in the proposal. The current prototype implements the schemas in [`database/`](./database/); triggers and locking are planned for the final release.

- **Normalization:** Decomposed across 8 domain schemas and 35+ tables strictly into **Boyce-Codd Normal Form (BCNF)**.
- **Concurrency Locks:** Row-level `SELECT FOR UPDATE` and `pg_advisory_xact_lock()` preventing double-booking of rooms and exam seats.
- **Automated Triggers:** PL/SQL `BEFORE` triggers enforcing library fine limits (> Rs. 500 block) and `AFTER` triggers producing JSON diff audit ledgers.
- **Evaluation Metric:** Time-To-Acknowledgement (TTA) median target $\le 2$ hours across 30,000+ active students.
