# Implementation Plan: Track 5 - The Accountant "Compliance Grid" & HQ Integration

## Phase 1: Finance Architecture & Routing
**Goal:** Establish the multi-page structure for the Accountant persona.

- [x] Task: Create FinanceLayout component with sidebar navigation.
- [x] Task: Configure `/finance` sub-routes in `App.tsx` (Sync, Purchase, Audit).
- [x] Task: Implement `useFinanceStore` for managing audit state and flags.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Finance Architecture' (Protocol in workflow.md)

## Phase 2: The Compliance Grid (Annex 14)
**Goal:** Implement the high-performance Purchase Register with TanStack Table.

- [x] Task: Scaffold `Annex14Grid` using TanStack Table v8.
- [ ] Task: Implement virtualization for handling 10,000+ entries.
- [ ] Task: Add "Rounding Error" detection logic and visual indicators.
- [ ] Task: Implement IRD-compatible Excel/CSV export functionality.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Compliance Grid' (Protocol in workflow.md)

## Phase 3: Financial Governance & Auditing
**Goal:** Build the interactive auditing tools and financial health visualizations.

- [ ] Task: Implement the "Interactive Price Variance Auditor" (Flagging/Correction flow).
- [ ] Task: Build the "Financial Health Radar" chart using `recharts`.
- [ ] Task: Implement "Anomaly Sentinel" flags for Voids and Discount Velocity.
- [ ] Task: Integrate digital "Compliance Seals" into the Sales Register views.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Financial Governance' (Protocol in workflow.md)

## Phase 4: HQ Legacy Integration & Refinement
**Goal:** Consolidate all legacy modules into the refined HQ Layout.

- [ ] Task: Add sub-routes for `/hq/branches`, `/hq/users`, and `/hq/analytics`.
- [ ] Task: Integrate `BranchManagement`, `UserManagement`, and `ProcurementAnalyticsHub`.
- [ ] Task: Move `ComparativeAnalytics` to its dedicated route and update sidebar.
- [ ] Task: Implement the "Pricing Wizard" with impact simulation logic.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: HQ Integration' (Protocol in workflow.md)

## Phase 5: Final Showcase Polish & Validation
**Goal:** Add high-fidelity visual elements and perform end-to-end validation.

- [ ] Task: Add "Revenue Heatmap Overlay" to the Nepal SVG map in `DeadStockMap`.
- [ ] Task: Implement the "Branch Leaderboard" gamification component.
- [ ] Task: Add the "Executive AI Summary" text block to the HQ Scorecard.
- [ ] Task: Perform E2E validation of all 10+ new sub-routes.
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Final Showcase' (Protocol in workflow.md)
