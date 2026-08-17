# UniCore: Campus Operating Platform

**Centralized Operating System for 30,000+ Students**  
*Thapar Institute of Engineering & Technology, Patiala*

---

## 📁 Modular Mono-Repo Architecture

```
unicore/
├── frontend/                    # UniCore Platform Web UI (React Application)
├── backend/                     # UniCore REST API Services (Node.js/Express)
├── database/                    # PostgreSQL 16 System of Record
│   └── schemas/                 # 8 Domain BCNF SQL DDLs, Procedures, & Triggers
│
├── docs/                        # Documentation Hub & Academic Submissions
│   ├── proposals/               # Markdown Documents (.md)
│   │   ├── PROJECT_PROPOSAL.md  # Stage 1: Project Proposal (Active — display: true)
│   │   ├── PROTOTYPE_PROPOSAL.md # Stage 2: Prototype Proposal (Coming Soon — display: false)
│   │   └── FINAL_REPORT.md      # Stage 3: Technical Master Report (Coming Soon — display: false)
│   │
│   ├── latex/                   # LaTeX Publications & PDF Outputs
│   │   ├── project_proposal.tex
│   │   ├── prototype_proposal.tex
│   │   └── final_report.tex
│   │
│   └── hub/                     # React Documentation Portal (Vite Web App)
│       ├── src/
│       ├── index.html
│       └── vite.config.js
│
├── .github/workflows/
│   └── deploy.yml               # Automated GitHub Pages CI/CD Pipeline
│
├── package.json                 # Monorepo Workspace & Build Scripts
├── README.md                    # Root System README
└── .gitignore
```

---

## Local Development & Documentation Web Build

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Documentation Hub Development Server:**
   ```bash
   npm run dev
   ```

3. **Build Documentation Hub Web App for GitHub Pages:**
   ```bash
   npm run build
   ```

---

## Key Proposal Specifications

- **Normalization:** Decomposed across 8 domain schemas and 35+ tables strictly into **Boyce-Codd Normal Form (BCNF)**.
- **Concurrency Locks:** Row-level `SELECT FOR UPDATE` and `pg_advisory_xact_lock()` preventing double-booking of rooms and exam seats.
- **Automated Triggers:** PL/SQL `BEFORE` triggers enforcing library fine limits (> Rs. 500 block) and `AFTER` triggers producing JSON diff audit ledgers.
- **Evaluation Metric:** Time-To-Acknowledgement (TTA) median target $\le 2$ hours across 30,000+ active students.
