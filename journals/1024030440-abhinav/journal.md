# Journal — Abhinav Kumar Singh (1024030440)

Individual contribution log for the UniCore project.

**Role:** Backend and DevOps

---

## Week 1 (10 Aug – 16 Aug 2026) — Ideation and Repository Setup

The team finalised the idea of UniCore, a single campus operating platform replacing the separate student-records, hostel, library and examination systems. We set up the GitHub repository and the first version of the documentation website.

- Created the GitHub repository and the monorepo structure
- Set up the GitHub Actions workflow that deploys the docs website to GitHub Pages

---

## Week 2 (17 Aug – 23 Aug 2026) — Elevator Pitch and Proposal Drafting

We presented the elevator pitch and started drafting the project proposal: problem statement, SMART objectives and the high-level architecture. The documentation was reorganised so each deliverable had a clear place.

- Built the documentation website with the interactive proposal, Markdown and LaTeX views
- Set up PDF publishing for the compiled LaTeX documents

---

## Week 3 (24 Aug – 30 Aug 2026) — Architecture and Proposal Diagrams

We fixed the architecture (React frontend, TypeScript REST API, PostgreSQL in BCNF) and produced the diagrams for the proposal. The proposal PDF was compiled from LaTeX and published on the docs website.

- Proposed the backend stack and the overall service architecture
- Fixed build and deployment issues in the CI pipeline

---

## Week 4 (31 Aug – 6 Sep 2026) — UML and Data Flow Diagrams

We completed the UML diagrams (use case, class, sequence, component) and the Level 0 and Level 1 data flow diagrams, and added them to the interactive proposal. The repository structure was cleaned up.

- Set up the frontend landing page and deployment routes
- Resolved monorepo dependency and Vite build issues in CI

---

## Week 5 (7 Sep – 13 Sep 2026) — Prototype Proposal and Frontend Skeleton

We wrote the prototype proposal and set up the frontend skeleton with sign-in, routing and role-based dashboards for students, faculty, staff and admins.

- Set up dashboard layouts, authentication routing and reusable UI components
- Added LaTeX sources for the prototype proposal and final report

---

## Week 6 (14 Sep – 20 Sep 2026) — Backend, Database and Planning

We built the backend REST API (authentication, admin, faculty and student routes) on the PostgreSQL schema, deployed the API as a Cloudflare Worker, and prepared the 12-week Gantt chart, RACI matrix and risk matrix. The ER diagram was generated directly from the SQL schema.

- Migrated the backend to Express with a PostgreSQL schema
- Implemented backend controllers for authentication, admin, faculty and student APIs
- Deployed the API as a Cloudflare Worker and the frontend on Cloudflare Pages

---

## Week 7 (21 Sep – 27 Sep 2026) — Integration and Testing

We connected the student dashboard to the live API and tested the main flows end to end against the dummy data.

- Integrated the student dashboard with the live backend API
- Fixed TypeScript and LibSQL compatibility issues in the backend

---

## Week 8 (28 Sep – 4 Oct 2026) — Prototype Review

We reviewed the prototype against the proposal, listed the gaps and planned the work for the final report.

- Reviewed deployment and environment configuration
- Planned backend features still needed for the final release

---

## Week 9 (5 Oct – 11 Oct 2026) — Repository and Website Cleanup

After the last evaluation we reorganised the repository so every deliverable has its own folder and README, fixed the GitHub Pages home page and added navigation links on the docs website.

- Reviewed the repository restructure and the updated deploy workflow
