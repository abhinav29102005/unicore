# UniCore Backend REST API Services

This directory contains the REST API backend gateway and business logic micro-routers for the UniCore platform.

## Architecture
- **Runtime:** Node.js / Express
- **Authentication:** JWT Bearer tokens with RBAC role-permission middleware scoping.
- **Database Driver:** PostgreSQL connection pool (`pg`).
