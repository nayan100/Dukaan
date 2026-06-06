# Specification: Setup SaaS Infrastructure and Core POS HUD with Offline Sync

## 1. Overview
This track establishes the foundation for the Dukaan SaaS platform, focusing on tenant provisioning and the high-performance POS HUD required for retail operations.

## 2. Technical Goals
*   Initialize the Frappe/ERPNext backend for multi-tenancy.
*   Develop the React-based POS HUD with high-contrast accessibility.
*   Implement IndexedDB caching and Service Worker for offline sales.
*   Configure the baseline IRD (CBMS) sync logic for compliance.

## 3. Key Components
*   **SaaS Control Center (MVP):** Basic interface for tenant creation and database provisioning.
*   **POS HUD:** Full-screen billing interface with item search and split-payment UI.
*   **Offline Engine:** IndexedDB schema for catalogs and invoices; Service Worker for assets.
*   **Compliance Bridge:** Mock IRD sync service for development and testing.

## 4. Acceptance Criteria
*   Successfully provision a new tenant database.
*   POS HUD rings up an item and calculates totals with zero latency.
*   Sale can be completed while offline and stored in IndexedDB.
*   Offline sale automatically syncs to the backend upon reconnection.
