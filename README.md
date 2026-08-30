# UniCore: Campus Operating Platform

**Centralized Operating System for 30,000+ Students**  
*Thapar Institute of Engineering & Technology, Patiala*

---

## 📁 Modular Mono-Repo Architecture

```
unicore/
├── frontend/                    # UniCore Platform Web UI (React/Vite Application)
│   ├── src/                     # Source files for the landing page
│   └── package.json             # Frontend dependencies
│
├── docs/                        # Documentation Hub & Academic Submissions
│   ├── website/                 # React Documentation Portal (Interactive Proposal)
│   │   ├── src/                 
│   │   ├── public/              # UML and DFD Diagram Assets
│   │   └── package.json         
│   │
│   └── latex/                   # LaTeX Publications & PDF Outputs
│       ├── research_proposal/   # Project Proposal TeX Source
│       └── out/                 # Compiled PDF files
│
├── .github/workflows/
│   └── deploy.yml               # Automated GitHub Pages CI/CD Pipeline
│
├── package.json                 # Monorepo Workspace Configuration
└── README.md                    # Root System README
```

---

## 🚀 Local Development

1. **Install Dependencies (Monorepo Root):**
   ```bash
   npm install
   ```

2. **Run Documentation Hub Development Server:**
   ```bash
   cd docs/website
   npm run dev
   ```

3. **Run Landing Page Development Server:**
   ```bash
   cd frontend
   npm run dev
   ```

---

## 📜 Key Proposal Specifications

- **Normalization:** Decomposed across 8 domain schemas and 35+ tables strictly into **Boyce-Codd Normal Form (BCNF)**.
- **Concurrency Locks:** Row-level `SELECT FOR UPDATE` and `pg_advisory_xact_lock()` preventing double-booking of rooms and exam seats.
- **Automated Triggers:** PL/SQL `BEFORE` triggers enforcing library fine limits (> Rs. 500 block) and `AFTER` triggers producing JSON diff audit ledgers.
- **Evaluation Metric:** Time-To-Acknowledgement (TTA) median target $\le 2$ hours across 30,000+ active students.
