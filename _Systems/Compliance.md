---
type: module
path: _Systems
created: 2026-06-06
tags: [project/module, compliance, ird, vat]
---
# Module: IRD Compliance & Sync

## Overview
Ensures production-grade integration with the Inland Revenue Department (IRD) Central Billing Monitoring System (CBMS). It handles real-time synchronization, offline buffering, and materialized VAT registers.

## Technical Details
- **Source Path:** `backend/dukaan/dukaan/compliance.py`
- **Related Tests:** `backend/dukaan/tests/test_compliance.py`, `backend/dukaan/tests/test_vat_registers_logic.py`, `backend/dukaan/tests/test_e2e_compliance_flow.py`
- **Tech Stack Ref:** [[conductor/tech-stack|Tech Stack]]

## Architecture Notes
- **Real-time Sync:** Uses `requests` with mandatory idempotency key handling.
- **Offline Buffer:** Queues unsynced invoices in the PWA's IndexedDB.
- **Materialized Registers:** high-performance MariaDB tables for Annex 13 (Sales) and Annex 14 (Purchase).
- **Integrity Check:** Daily checksum verification job detects discrepancies between ledger and registers.

## Key Logic
- [[conductor/archive/ird_sync_20260606/index|Production IRD Sync Track]]
- [[_Components/Dashboards|IRD Monitor Dashboard]]

## Review History
- Last Reviewed: 2026-06-07
