# Implementation Plan: Production IRD Sync & Materialized VAT Registers

**Phase 1: Materialized Registers & Integrity (Backend) [checkpoint: 2b6472d]**
- [x] Task: Define MariaDB schema for materialized Annex 13 (Sales) and Annex 14 (Purchase) tables. be99446
- [x] Task: Implement Frappe `on_submit` and `on_cancel` hooks to update materialized tables in real-time. 12d9d01
- [x] Task: Implement the Daily Checksum Verification Job to detect discrepancies between ledger and registers. 1f7f2b3
- [x] Task: Create Accountant API endpoints to fetch registers with high-performance filtering. a0def2b
- [x] Task: Conductor - User Manual Verification 'Phase 1: Materialized Registers' (Protocol in workflow.md) 2b6472d

**Phase 2: IRD Sync Engine & Compliance Logic (Backend) [checkpoint: 285beb9]**
- [x] Task: Extend `Sales Invoice`, `Credit Note`, and `Purchase Invoice` with IRD-specific fields (Sync Token, Status, Idempotency Key). f4b3e83
- [x] Task: Implement Two-Stage Status Flow (Draft -> Submitted Pending -> Submitted Synced). 4edfde3
- [x] Task: Build the IRD API Client with mandatory idempotency key handling and 409 Conflict resolution. 8673b68
- [x] Task: Implement background workers for automated retry with exponential backoff. 313c5bf
- [x] Task: Conductor - User Manual Verification 'Phase 2: IRD Sync Engine' (Protocol in workflow.md) 285beb9

**Phase 3: Offline Resilience & Sync Queue (Frontend/PWA)**
- [x] Task: Implement IndexedDB schema for persistent offline invoice storage. 04d6d52
- [ ] Task: Implement "Secondary Backup" logic using `localStorage` for redundancy.
- [ ] Task: Build the Background Sync worker to detect connectivity and push queued invoices.
- [ ] Task: Implement Persistent Sync Warning UI to prevent data loss on logout/session expiry.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Offline Resilience' (Protocol in workflow.md)

**Phase 4: Auditor Dashboard & Final Integration**
- [ ] Task: Build the Sync Status Dashboard for Accountants (Synced vs. Pending vs. Failed).
- [ ] Task: Implement manual "Force Sync" trigger for high-level users.
- [ ] Task: End-to-end integration tests for the full "Offline -> Sync -> Register" lifecycle.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Integration' (Protocol in workflow.md)
