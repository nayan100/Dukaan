# Tech Stack: Dukaan

## 1. Core Architecture
Dukaan follows a headless, decoupled architecture with a focus on offline resilience and high-performance real-time synchronization.

## 2. Backend (Master Ledger)
*   **Core:** Headless ERPNext (Frappe Framework).
*   **Database:** MariaDB (Primary ledger and transactional data).
*   **Caching:** Redis (Server-side caching and session management).
*   **API:** REST API with custom whitelisted Frappe methods for complex wizard logic and compliance checks.

## 3. Frontend (POS & Dashboards)
*   **Framework:** React (TypeScript).
*   **State Management:** Redux Toolkit or TanStack Query for efficient data fetching and caching.
*   **UI Components:** Custom design system built with Tailwind CSS, optimized for Visual Sovereignty (Slate-950 palette).
*   **Animations:** `framer-motion` for premium micro-interactions and layout transitions.
*   **Data Visualization:** `recharts` for high-performance KPI dashboards and sales trends.
*   **Offline Support:** 
    *   **PWA:** Service Workers for application caching and offline access.
    *   **IndexedDB:** Local storage for item catalogs, prices, and unsynced sales invoices.

## 4. AI & Intelligence Layer
*   **Edge-AI:** TensorFlow.js for lightweight, browser-based predictive search and anomaly detection (Security Sentinel) while offline.
*   **Cloud AI:** Python-based microservices (FastAPI) for heavy lifting, including demand forecasting and inventory rebalancing.

## 5. DevOps & Infrastructure
*   **Containerization:** Docker for consistent development and production environments.
*   **CI/CD:** Automated pipelines for testing (Cypress/Playwright) and zero-downtime deployment (Blue-Green).
*   **Monitoring:** Integrated Frappe logging and Prometheus/Grafana for infrastructure health.
