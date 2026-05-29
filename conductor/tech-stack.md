# Tech Stack: Sellpoint

## Architecture Pattern
**Headless ERP**: Custom frontend communicating with an established open-source ERP backend via REST API.

## Frontend (The 4 Dashboards)
- **Framework:** React (Next.js)
- **Styling:** Tailwind CSS
- **State Management:** React Query (for API caching and state)

## Middleware / BFF (Backend-For-Frontend)
- **Environment:** Node.js
- **Framework:** Express.js or NestJS
- **Purpose:** To abstract Frappe's API and serve perfectly formatted data to the React dashboards.

## Backend (Headless Engine)
- **ERP:** ERPNext (Python/Frappe)
- **Database:** MariaDB (Required by ERPNext)
- **Localization:** `nepal-compliance` community app (for 13% VAT, TDS, IRD reporting)

## Infrastructure
- **Deployment:** Docker / Docker Compose
- **Hosting:** Self-hosted (to remain 100% free)
