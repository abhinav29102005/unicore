# UniCore — Source Code

| Folder | What it is | Run locally |
|--------|------------|-------------|
| [`frontend/`](./frontend/) | Web app (React + Vite + Tailwind): landing page, sign-in, Student / Faculty / Staff / Admin dashboards | `cd code/frontend && npm install && npm run dev` |
| [`backend/`](./backend/) | REST API (Java Spring Boot 3, Spring Data JPA, PostgreSQL / H2) | `cd code/backend && ./mvnw spring-boot:run` (or `./mvnw test`) |
| [`database/`](./database/) | PostgreSQL schema (8 domain schemas, BCNF), migrations `V001–V019`, dummy data | `cd code && docker compose up -d` starts PostgreSQL on port 5433 |

## Live

- Prototype: https://unicore-frontend.pages.dev/unicore
- Docs website: https://abhinav29102005.github.io/unicore/docs/
