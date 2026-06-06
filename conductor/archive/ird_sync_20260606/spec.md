# Specification: Production IRD Sync & Materialized VAT Registers

## Overview
This track implements the production-grade integration with the Inland Revenue Department (IRD) Central Billing Monitoring System (CBMS) and the generation of materialized VAT registers (Annex 13 and 14). It ensures compliance with national tax regulations while maintaining high performance and offline resilience.

## Functional Requirements

### 1. IRD Sync Engine (Backend)
- Implement **Two-Stage Status Flow**:
    - `Draft` -> `Submitted (Pending IRD)`: Document committed to ledger but soft-locked.
    - `Submitted (Pending IRD)` -> `Submitted (Synced)`: Hard-locked (Read-Only) after `200 OK` from IRD.
- Implement real-time transmission of **Sales Invoices**, **Credit Notes**, and **Purchase Invoices** to the IRD CBMS API.
- **Idempotency & Conflict Resolution**: Use the `Document Name` as a mandatory **Idempotency Key**. Handle `409 Conflict` by treating it as success and fetching the existing token.
- Implement **Immutability Lock**: Once a document is successfully synced, it cannot be amended or deleted. Corrections must be made via Credit Notes.

### 2. Offline Resilience & Sync Queue (Frontend/PWA)
- Implement a "Pending IRD Sync" queue in **IndexedDB** for invoices generated during internet outages.
- Capture the original `posting_date` and set an `is_offline=1` flag for offline invoices.
- Implement background synchronization logic to push pending invoices once connection is restored.
- **Persistent Sync Warning**: Prevent logout if unsynced invoices exist in IndexedDB.
- **Secondary Backup**: Mirror invoices to `localStorage` to survive IndexedDB corruption.

### 3. Materialized VAT Registers
- Create read-only, high-performance materialized tables in MariaDB for **Annex 13 (Sales Register)** and **Annex 14 (Purchase Register)**.
- Implement automated triggers/hooks to update these tables whenever a relevant document is submitted or synced.
- **Checksum Verification Job**: A 24-hour job to compare aggregate VAT totals between source tables and materialized registers, flagging "Audit Required" on mismatches.

### 4. Error Handling & Retry Logic
- **Automated Retry:** Exponential backoff for transient API failures.
- **Manual Retry:** UI trigger for Accountants/Admins to manually push failed or pending syncs.
- Provide a clear status dashboard showing synced, pending, and failed transmissions.

## Non-Functional Requirements
- **Security:** Manage IRD API credentials securely via Frappe Site Config.
- **Performance:** Materialized tables must support near-instant querying.
- **Auditability:** Detailed logs of all IRD communication attempts and responses.

## Acceptance Criteria
- [ ] Sales Invoices are transmitted to IRD and receive a success token.
- [ ] Two-stage status flow correctly transitions from Pending to Synced.
- [ ] 409 Conflict responses are handled without erroring.
- [ ] Offline invoices are queued and synced automatically.
- [ ] Checksum verification job correctly identifies data discrepancies.
- [ ] Annex 13 and 14 tables match source document totals.

## Out of Scope
- Integration with other tax authorities.
- Automatic filing of VAT returns.
