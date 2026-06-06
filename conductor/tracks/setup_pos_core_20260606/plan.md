# Implementation Plan: Setup SaaS Infrastructure and Core POS HUD with Offline Sync

## Phase 1: SaaS & Backend Foundation [checkpoint: c5c8789]
Establish the multi-tenant architecture and core data models.

- [x] Task: Backend - Initialize Frappe Tenant Provisioning Logic b9fcf9f
    - [ ] Define custom DocTypes for Tenant and Subscription metadata.
    - [ ] Implement site creation and database setup hooks.
- [x] Task: Backend - Implement Core Retail DocTypes (Branch, Warehouse, Price List) 7afb631
    - [ ] Setup warehouse hierarchy for multi-branch mapping.
    - [ ] Configure naming series for IRD-compliant invoicing.
- [x] Task: Conductor - User Manual Verification 'Phase 1: SaaS & Backend Foundation' (Protocol in workflow.md) c5c8789

## Phase 2: Core POS HUD Development
Build the high-speed billing interface for cashiers.

- [x] Task: Frontend - Setup React Project with Tailwind and TypeScript 2b41cef
    - [ ] Configure design tokens for high-contrast accessibility.
    - [ ] Initialize the component library for the POS HUD.
- [x] Task: Frontend - Implement POS HUD 'Speed Grid' and Item Picker 336c0f2
    - [ ] [TDD] Write tests for item selection and quantity calculation.
    - [ ] Implement the billing HUD with 60s autonomous void window.
- [x] Task: Frontend - Develop Split-Payment UI (Cash, Card, QR) bb8f53d
    - [ ] [TDD] Write tests for multi-payment total validation.
    - [ ] Implement the payment modal with Fonepay QR placeholder.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Core POS HUD Development' (Protocol in workflow.md)

## Phase 3: Offline Resilience & IRD Sync
Ensure the system remains functional during outages and compliant with regulations.

- [ ] Task: Offline - Implement IndexedDB and Service Worker Sync
    - [ ] Define IndexedDB schema for Item Catalog and Offline Invoices.
    - [ ] Implement Background Sync API for automated reconnection logic.
- [ ] Task: Compliance - Implement Mock IRD (CBMS) Sync Bridge
    - [ ] [TDD] Write tests for IRD sync payload structure (Annex 13).
    - [ ] Implement the 'is_offline' flag logic and sync queue.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Offline Resilience & IRD Sync' (Protocol in workflow.md)
