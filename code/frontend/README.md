# UniCore Frontend Web Application

This directory contains the primary frontend web portal for the UniCore Campus Operating Platform.

## Tech Stack
- **Framework:** React 19 + Vite 5
- **Styling:** Tailwind CSS 4
- **Routing:** React Router 7 (configured with base `/unicore`)
- **State Management:** Zustand 5 (persisted auth store)
- **Data Fetching & Tables:** TanStack React Query 5 & TanStack Table 8
- **Icons & Animation:** Lucide React & Framer Motion

## Module Scope
- **Student Portal (`/student`):** Academic enrollments, CGPA calculation, hostel room/bed status, library book loans, attendance breakdown, and exam results.
- **Admin Dashboard (`/admin`):** University-wide key metrics, paginated user management, and department summaries.
- **Faculty Portal (`/faculty`):** Department course listings, semester offerings, and enrolled student counts.
- **Staff Workflow Portal (`/staff`):** Administrative and hostel workflow metrics.
- **Documentation Hub (`/docs`):** Interactive architecture proposal, UML diagrams, DFDs, and LaTeX documents.

## API Integration
The frontend connects to the Java Spring Boot REST API backend:
- Default API Endpoint: `http://localhost:8080/api`
- Configurable via `.env`: `VITE_API_URL=http://localhost:8080/api`

## Running Locally
```bash
npm install
npm run dev
```
Preview at `http://localhost:5173/unicore/`.
