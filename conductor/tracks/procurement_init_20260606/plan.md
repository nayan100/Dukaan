# Implementation Plan: Procurement & Stock Initialization

**Phase 1: Supplier & Catalog Foundations (Backend)**
- [x] Task: Extend Supplier doctype with validated Tax ID (PAN/VAT) fields and verification logic. 8cfd93b
- [x] Task: Implement the Split-Order Heuristic engine to monitor procurement velocity per supplier. 9a3e49d
- [ ] Task: Create the `Monthly Budget` check hook on the `Purchase Order` doctype.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Foundations' (Protocol in workflow.md)

**Phase 2: Core Procurement Workflows (Backend)**
- [ ] Task: Implement the Standard PO Lifecycle (Draft -> Pending -> Approved -> Received).
- [ ] Task: Build the multi-persona approval handshake (Branch Owner -> Accountant -> Chain Owner).
- [ ] Task: Implement `Purchase Receipt` logic that updates the materialized Annex 14 register.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Workflows' (Protocol in workflow.md)

**Phase 3: Stock Initialization & Valuation (Backend)**
- [ ] Task: Create the `Opening Stock Entry` tool with Moving Average calculation logic.
- [ ] Task: Implement the Blind Spot-Check Protocol for high-value stock entries.
- [ ] Task: Develop the Landed Cost Voucher system for retroactive valuation adjustments.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Initialization' (Protocol in workflow.md)

**Phase 4: Procurement UI & Dashboard (Frontend)**
- [ ] Task: Build the Procurement Management Suite (PO Tracker, Receipt Entry, Supplier Portal).
- [ ] Task: Implement the "Soft Warning" UI for budget-exceeding Purchase Orders.
- [ ] Task: Create the Procurement Analytics Hub (Budget utilization, Supplier reliability).
- [ ] Task: Conductor - User Manual Verification 'Phase 4: UI & Dashboards' (Protocol in workflow.md)
