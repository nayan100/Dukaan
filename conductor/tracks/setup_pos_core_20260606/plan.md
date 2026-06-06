# Implementation Plan: Setup SaaS Infrastructure and Core POS HUD with Offline Sync

## Phase 1: SaaS & Backend Foundation [checkpoint: c5c8789]
Establish the multi-tenant architecture and core data models.

- [x] Task: Backend - Initialize Frappe Tenant Provisioning Logic b9fcf9f
    - [x] Define custom DocTypes for Tenant and Subscription metadata.
    - [x] Implement site creation and database setup hooks.
- [x] Task: Backend - Implement Core Retail DocTypes (Branch, Warehouse, Price List) 7afb631
    - [x] Setup warehouse hierarchy for multi-branch mapping.
    - [x] Configure naming series for IRD-compliant invoicing.
- [x] Task: Conductor - User Manual Verification 'Phase 1: SaaS & Backend Foundation' (Protocol in workflow.md) c5c8789

## Phase 2: Core POS HUD Development [checkpoint: c7f6ee2]
Build the high-speed billing interface for cashiers.

- [x] Task: Frontend - Setup React Project with Tailwind and TypeScript 2b41cef
    - [x] Configure design tokens for high-contrast accessibility.
    - [x] Initialize the component library for the POS HUD.
- [x] Task: Frontend - Implement POS HUD 'Speed Grid' and Item Picker 336c0f2
    - [x] [TDD] Write tests for item selection and quantity calculation.
    - [x] Implement the billing HUD with 60s autonomous void window.
- [x] Task: Frontend - Develop Split-Payment UI (Cash, Card, QR) bb8f53d
    - [x] [TDD] Write tests for multi-payment total validation.
    - [x] Implement the payment modal with Fonepay QR placeholder.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Core POS HUD Development' (Protocol in workflow.md) c7f6ee2

## Phase 3: Offline Resilience & Dashboards
Ensure the system remains functional during outages and provides strategic visibility.

- [x] Task: Offline - Implement IndexedDB and Service Worker Sync fb48706
    - [ ] Define IndexedDB schema for Item Catalog and Offline Invoices.
    - [ ] Implement Background Sync API for automated reconnection logic.
- [x] Task: Frontend - Implement POS HUD Enhancements (Shortcuts, Lucide Icons, Toasts) 12a793e
    - [ ] Add Lucide React for modern iconography.
    - [ ] Implement keyboard shortcuts (Enter to finish, F1 to search).
    - [ ] Replace alerts with a custom Toast/Modal notification system.
- [x] Task: Analytics - Develop KPI Dashboards (Owner & Chain Owner) 7add7f3
    - [ ] Implement Executive Scorecard and Operational Heatmap.
    - [ ] Create Comparative Analysis and Compliance Monitor views.
- [x] Task: Onboarding - Implement Lifecycle Wizards fdf8ba4
    - [ ] Develop the Single-to-Chain Transition Wizard.
    - [ ] Develop the IRD Onboarding Wizard.
- [x] Task: Compliance - Implement Mock IRD (CBMS) Sync Bridge 386528a
    - [ ] [TDD] Write tests for IRD sync payload structure (Annex 13).
    - [ ] Implement the 'is_offline' flag logic and sync queue.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Offline Resilience & Dashboards' (Protocol in workflow.md)

## Phase 4: Finalization & Documentation
Wrap up the project with comprehensive documentation and production-ready builds.

- [ ] Task: Documentation - Create Comprehensive Repository Wiki & README
    - [ ] Write detailed 'User Guide' for application usage.
    - [ ] Write 'Developer Setup Guide' (Dev vs. Production modes).
    - [ ] Create 'Extensibility Guide' (Adding items, logic, and APIs).
    - [ ] Create 'Testing & QA Guide'.
- [ ] Task: Build - Finalize Production Build & Verification
    - [ ] Perform full E2E verification of the integrated system.
    - [ ] Generate production-ready assets for frontend and backend.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Finalization & Documentation' (Protocol in workflow.md)
