# Implementation Plan: Procurement & Stock Realization (Refined)

## Phase 1: High-Integrity PO Lifecycle
- [x] 0efe8b0 **Task 1.1**: Build `POListView` with status-based cards and "Budget Violation" badges.
- [x] 0c9dcbb **Task 1.2**: Implement `POCreationWizard` with local budget caching and "Violation Reason" modal.
- [x] 8801719 **Task 1.3**: Build the "Approval Handshake" UI with manager PIN verification.

## Phase 2: Secure Stock Initialization
- [x] 41eb172 **Task 2.1**: Implement `OpeningStockGrid` (Keyboard-optimized entry).
- [x] 3414f6e **Task 2.2**: Develop `ValueWeightedSampler.ts` for the Blind Spot-Check.
- [x] 4d0ede0 **Task 2.3**: Build `BlindSpotCheck` UI with "Mismatched Quantity" lockdown logic.

## Phase 3: Compliance-First Receipts
- [x] 63f8183 **Task 3.1**: Create `PurchaseReceiptGenerator` with "Pre-Flight Compliance Check" (PAN/VAT verification).
- [x] e449bd6 **Task 3.2**: Build `Annex14Preview` with "Rounding Error Detection" UI.
- [x] 024d9a9 **Task 3.3**: Implement "PO-to-Receipt" conversion with immutable audit logging.

## Phase 4: Financial Analytics & Landed Cost
- [x] b1c27c2 **Task 4.1**: Build `LandedCostCalculator` with distribution logic (Value/Weight).
- [x] e6fc88c **Task 4.2**: Implement `MarginImpactVisualizer` (Before vs. After valuation impact).
- [x] c7a6d82 **Task 4.3**: Create `ProcurementAnalyticsHub` with "Budget Velocity" vs. "Compliance Health" metrics.

## Phase 5: Final Integration & Hardening
- [x] ec04741 **Task 5.1**: Integrate into `AppLayout` with a new "Stock & Supply" sub-navigation.
- [x] 117bafb **Task 5.2**: Update `PermissionGuard` for "Override Approval" and "Compliance View" roles.
- [x] 45944fe **Task 5.3**: Perform E2E "Dirty Data" stress test (entering invalid PANs, exceeding budgets).

## Phase: Review Fixes
- [x] 080edf9 Task: Apply review suggestions
