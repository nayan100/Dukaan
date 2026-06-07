# Specification: Procurement & Stock Realization (Refined)

## Overview
This track delivers a high-integrity, visual-sovereignty compliant suite for managing the full inventory lifecycle. It prioritizes financial governance, anti-fraud protocols, and IRD compliance.

## Functional Requirements

### 1. Purchase Order (PO) Management & Budget Guardrails
- **PO-to-Budget Lock:** Real-time check against branch monthly quotas.
- **Accountability Overrides:** If a PO exceeds budget, it requires a "Violation Reason" and is flagged in the Strategy Hub for audit.
- **Offline Budget Caching:** Local IndexedDB mirror of remaining budget to allow semi-validated offline PO creation.

### 2. High-Integrity Stock Initialization
- **Opening Stock Grid:** High-speed, keyboard-optimized entry.
- **Value-Weighted Blind Spot-Check:** Randomized verification protocol that prioritizes high-value and high-risk inventory items.
- **Discrepancy Lockdown:** If a blind check fails, the entry is locked until a "Correction Note" is provided by an authorized manager.

### 3. Compliance & Supplier Governance
- **Pre-Receipt Compliance Check:** Blocks Purchase Receipt generation if the Supplier PAN/VAT is unverified.
- **Annex 14 Materialization:** Real-time population of the Purchase Register with automated rounding error detection.

### 4. Landed Cost & Profitability Analysis
- **Landed Cost Vouchers:** Distribute shipping/customs costs by value, weight, or quantity.
- **Retroactive Margin Impact:** Visual indicator showing how landed costs affect the profit margins of items already in stock or sold.

## UI/UX Standards
- **Sovereign UI:** Slate-950 depth, Neon-Primary highlights.
- **Mobile-First Audits:** Optimized for warehouse tablets.
- **Optimistic UI:** Instant local feedback with background sync status indicators.

## Acceptance Criteria
- [ ] PO violations are logged with a "Reason" and visible in the Audit Trail.
- [ ] Blind Spot-Check algorithm selects items with >5k value 80% of the time.
- [ ] Receipts cannot be generated for unverified suppliers.
- [ ] Landed cost adjustments show "Before vs. After" margin comparisons.
