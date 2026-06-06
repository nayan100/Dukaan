# Implementation Plan: Financial Governance & PO Budgeting

## Phase 1: Budgetary Control
Prevent over-spending at the branch level.

- [x] Task: Backend - Implement Monthly Budget Guard b87994b
    - [ ] [TDD] Write tests for PO budget enforcement limits.
    - [ ] Implement `Before Submit` hook on Purchase Order DocType.
- [x] Task: UI - Develop Budget Monitoring Widget 0bd74fd
    - [ ] Create a visual progress bar in the Branch Owner dashboard showing remaining budget.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Budgetary Control' (Protocol in workflow.md)

## Phase 2: Cross-Branch Adjustments
Handle the financial logic for distributed returns and price variances.

- [ ] Task: Backend - Implement Inter-Branch Adjustment Engine
    - [ ] [TDD] Write tests for Debit/Credit generation during cross-branch returns.
    - [ ] Implement logic to identify original purchase branch via barcode scan.
- [ ] Task: Analytics - Create Price Variance & Fraud Alert HUD
    - [ ] Build a dense data grid for Accountants to review price mismatches.
    - [ ] Implement the 'Discount Velocity' fraud dashboard.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Cross-Branch Adjustments' (Protocol in workflow.md)
