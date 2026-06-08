# Specification: Track 3 - The Chain Owner HQ ("Strategy & Growth")

## Overview
This track implements the "Chain Owner HQ" (`/hq`), an AI-augmented strategic orchestration dashboard. It serves as the top-level command center for the Chain Owner persona, providing global visibility, comparative analytics across branches, and a centralized hub for critical workflow approvals.

## Functional Requirements

### 1. Executive Scorecard & Dead Stock Rebalancer
-   **Global Metrics Dashboard:** Real-time visualization of chain-wide total revenue, transaction volumes, and best/worst performing inventory using `recharts`.
-   **Comparative Analytics:** Side-by-side performance matrix of all active branches.
-   **Dead Stock Rebalancer (Map View):**
    -   A visual map overlay displaying branch locations as color-coded pins (health indicators based on stock stagnation).
    -   Cluster regions for dense geographic areas.
    -   A companion data table (AG-Grid/TanStack Table) linked to map selections.
    -   **AI Integration:** Display AI-driven suggestions for inter-branch transfers of stagnant stock (requires explicit human approval).

### 2. Global Approval Center
-   **Unified Action Inbox:** A centralized task list for the Chain Owner.
-   **Transfer Approvals:** Review, modify, or approve/reject inter-branch stock transfers initiated by branches or suggested by AI.
-   **Procurement Approvals:** High-value Purchase Order (PO) review and authorization.
-   **Exception Handling:** Review flagged "Security Sentinel" anomalies, including high-velocity discounts and voided transactions.

### 3. Growth Wizards Hub
-   **Wizard Infrastructure:** Multi-step, state-preserved forms for complex organizational changes.
-   **Branch Onboarding Wizard:** Step-by-step setup of new branch entities, assigning initial managers, and setting base quotas.
-   **Warehouse Mapping Wizard:** Defining physical storage locations and associating them with branches.
-   **IRD Registration Wizard:** Guided workflow to ensure new branches meet compliance requirements for Central Billing Monitoring System integration.

### 4. Routing & State Management
-   **Protected Routes:** Implement React Router guards ensuring `/hq` is strictly limited to the Chain Owner role.
-   **State:** Utilize Zustand for lightweight, decoupled state management of the HQ dashboards to prevent unnecessary re-renders.

## Non-Functional Requirements
-   **Offline Resilience:** KPI data and approval queues must leverage IndexedDB for caching, allowing read-only access and deferred actions during connectivity drops.
-   **Visual Sovereignty:** Strict adherence to the Slate-950 depth palette, high-contrast typography, and premium `framer-motion` layout transitions.
-   **TDD-First:** Mandatory test coverage for all approval logic and wizard state transitions.

## Acceptance Criteria
-   [ ] `/hq` route is securely guarded by role-based access control.
-   [ ] Scorecard renders multi-branch comparative data without UI blocking.
-   [ ] Map view correctly clusters and color-codes branches based on simulated stock data.
-   [ ] Approving/Rejecting a task in the Approval Center updates the global state and removes the item from the queue.
-   [ ] All three Growth Wizards can be completed end-to-end with validation.
-   [ ] AI suggestions explicitly show a "Requires Human Approval" guardrail.

## Out of Scope
-   Actual predictive AI model training (using simulated/hardcoded endpoints for MVP).
-   Branch-level action inbox (Track 4).
-   Dense compliance grids (Track 5).