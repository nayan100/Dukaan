# Implementation Plan: Procurement & Stock Initialization

**Phase 1: Supplier & Catalog Foundations (Backend)** [checkpoint: baca32a]
- [x] Task: Extend Supplier doctype with validated Tax ID (PAN/VAT) fields and verification logic. 8cfd93b
- [x] Task: Implement the Split-Order Heuristic engine to monitor procurement velocity per supplier. 9a3e49d
- [x] Task: Create the `Monthly Budget` check hook on the `Purchase Order` doctype. d9daf24
- [x] Task: Conductor - User Manual Verification 'Phase 1: Foundations' (Protocol in workflow.md) baca32a

**Phase 2: Core Procurement Workflows (Backend)** [checkpoint: 0273ee0]
- [x] Task: Implement the Standard PO Lifecycle (Draft -> Pending -> Approved -> Received). 3a42e4c
- [x] Task: Build the multi-persona approval handshake (Branch Owner -> Accountant -> Chain Owner). 37e0203
- [x] Task: Implement `Purchase Receipt` logic that updates the materialized Annex 14 register. c633955
- [x] Task: Conductor - User Manual Verification 'Phase 2: Workflows' (Protocol in workflow.md) 0273ee0

**Phase 3: Stock Initialization & Valuation (Backend)** [checkpoint: dc9bcf8]
- [x] Task: Create the `Opening Stock Entry` tool with Moving Average calculation logic. 2df7e90
- [x] Task: Implement the Blind Spot-Check Protocol for high-value stock entries.
- [x] Task: Develop the Landed Cost Voucher system for retroactive valuation adjustments.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Initialization' (Protocol in workflow.md)

**Phase 4: Procurement UI & Dashboard (Frontend)**
- [x] Task: Build the Procurement Management Suite (PO Tracker, Receipt Entry, Supplier Portal). baf6e06
- [x] Task: Implement 'Verify Spot Check' UI for Opening Stock Entry. 6d0b74c
- [ ] Task: Implement the "Soft Warning" UI for budget-exceeding Purchase Orders.
- [ ] Task: Create the Procurement Analytics Hub (Budget utilization, Supplier reliability).
- [ ] Task: Conductor - User Manual Verification 'Phase 4: UI & Dashboards' (Protocol in workflow.md)
