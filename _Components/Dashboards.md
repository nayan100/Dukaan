---
type: module
path: _Components
created: 2026-06-06
tags: [project/module, ui, analytics]
---
# Module: KPI Dashboards

## Overview
Strategic visualization center for branch and chain performance. Provides real-time insights into sales velocity, stock health, and compliance status.

## Technical Details
- **Source Path:** `frontend/src/components/analytics/KPIDashboard.tsx`
- **Related Tests:** `frontend/src/components/analytics/KPIDashboard.test.tsx`, `frontend/src/components/analytics/IRDSyncDashboard.test.tsx`
- **Tech Stack Ref:** [[conductor/tech-stack|Tech Stack]]

## Architecture Notes
- **Strategy Hub:** Map-view of branch health and global rankings for Chain Owners.
- **IRD Sync Monitor:** Real-time dashboard for accountants to track transmission status (Synced vs. Pending vs. Failed).
- **Dead Stock Rebalancer:** Identifies stagnant inventory (>30 days) and triggers rebalancing transfers.
- **Dynamic HUDs:** Uses `recharts` for high-performance data visualization.

## Key Logic
- [[conductor/archive/setup_pos_core_20260606/index|POS Core Setup Track]]
- [[conductor/archive/ird_sync_20260606/index|Production IRD Sync Track]]

## Review History
- Last Reviewed: 2026-06-07
