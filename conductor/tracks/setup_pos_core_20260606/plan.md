# Implementation Plan: Setup SaaS Infrastructure and Core POS HUD with Offline Sync

## Phase 1: SaaS & Backend Foundation
Establish the multi-tenant architecture and core data models.

- [x] Task: Backend - Initialize Frappe Tenant Provisioning Logic b9fcf9f
    - [ ] Define custom DocTypes for Tenant and Subscription metadata.
    - [ ] Implement site creation and database setup hooks.
- [ ] Task: Backend - Implement Core Retail DocTypes (Branch, Warehouse, Price List)
    - [ ] Setup warehouse hierarchy for multi-branch mapping.
    - [ ] Configure naming series for IRD-compliant invoicing.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: SaaS & Backend Foundation' (Protocol in workflow.md)

## Phase 2: Core POS HUD Development
Build the high-speed billing interface for cashiers.

- [ ] Task: Frontend - Setup React Project with Tailwind and TypeScript
    - [ ] Configure design tokens for high-contrast accessibility.
    - [ ] Initialize the component library for the POS HUD.
- [ ] Task: Frontend - Implement POS HUD 'Speed Grid' and Item Picker
    - [ ] [TDD] Write tests for item selection and quantity calculation.
    - [ ] Implement the billing HUD with 60s autonomous void window.
- [ ] Task: Frontend - Develop Split-Payment UI (Cash, Card, QR)
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
