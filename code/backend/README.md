# UniCore Spring Boot Backend REST API Services

This directory contains the Java Spring Boot REST API backend for the UniCore Campus Operating Platform.

## Architecture
- **Framework:** Spring Boot 3.4.3 (Java 17+)
- **Build System:** Apache Maven (configured with `./mvnw` Maven Wrapper)
- **Persistence & ORM:** Spring Data JPA / Hibernate
- **Database Support:**
  - **PostgreSQL 15** (Default profile `postgres`): Connects to `localhost:5433` (configured via `docker-compose.yml`)
  - **H2 In-Memory** (Profile `h2`): Zero-setup embedded mode for rapid local development and testing
- **API Endpoints:**
  - `POST /api/auth/login` — Authentication & JWT issuance
  - `GET /api/auth/profile/{id}` — User profile details
  - `GET /api/student/{studentNo}/dashboard` — Student academic, hostel, library, and attendance overview
  - `GET /api/student/{studentNo}/attendance` — Detailed course attendance and percentage breakdown
  - `GET /api/student/{studentNo}/results` — Course grades, credits, grade points, and CGPA calculation
  - `GET /api/admin/stats` — University-wide key metrics
  - `GET /api/admin/users` — Paginated user management
  - `GET /api/admin/departments` — Department metrics
  - `GET /api/faculty/{id}/dashboard` — Faculty dashboard & enrolled courses
  - `POST /api/seed` — Seed development database

## Quick Start

### 1. Run with PostgreSQL (Default)
Ensure PostgreSQL is running (e.g. `docker compose up -d db`):
```bash
./mvnw spring-boot:run
```

### 2. Run with Embedded H2 (Zero-setup local testing)
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=h2
```

### 3. Run Tests
```bash
./mvnw test
```
