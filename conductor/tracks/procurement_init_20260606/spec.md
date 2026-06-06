# Specification: Procurement & Stock Initialization (Grilled)

## Overview
This track establishes a high-integrity procurement and stock initialization engine. It prioritizes data accuracy for compliance (Annex 14), prevents financial "gaming" through split orders, and ensures stock valuation reflects true landed costs.

## Functional Requirements

### 1. High-Integrity Procurement
- **Standard PO Flow**: Draft -> Submitted (Pending) -> Approved -> Received.
- **Split-Order Detection**: Automated heuristics to detect PO splitting intended to bypass budget limits.
- **Supplier Validation**: Format-based validation of Tax IDs (PAN/VAT) to ensure Annex 14 register accuracy.

### 2. Physical-First Stock Initialization
- **Opening Stock Entry**: Bulk entry tool with Moving Average valuation.
- **Blind Spot-Check Protocol**: Mandatory secondary verification for high-value stock entries.
- **Direct Receipt (Spot Purchase)**: Quick entry for local buys, requiring digital attachment of supplier invoices.

### 3. Advanced Financial Governance
- **Soft Budget Enforcement**: Warnings on PO creation; escalation to Chain Owner for overrides.
- **Landed Cost Vouchers**: Ability to append overheads (freight, duties) to receipts, auto-adjusting stock valuation.
- **Multi-Persona Handshake**: Branch Owner (Request) -> Accountant (Fiscal Check) -> Chain Owner (Strategic Approval).

### 4. Downstream Compliance
- **Annex 14 Integration**: Direct, immutable flow from Purchase Receipts to the materialized VAT register.
- **Checksum Verification**: Inclusion of procurement totals in the daily integrity check (shared with IRD track logic).

## Acceptance Criteria
- [ ] Standard PO flow completes from Draft to Receipt.
- [ ] Split-order detection correctly flags aggregated POs.
- [ ] Opening Stock Entry initializes inventory with Moving Average valuation and blind spot-checks.
- [ ] Budget warnings are correctly triggered and require Chain Owner approval.
- [ ] Data correctly flows into the Annex 14 Purchase Register.
