---
type: module
path: _Systems
created: 2026-06-06
tags: [project/module, inventory, supply-chain]
---
# Module: Inventory Orchestration

## Overview
Manages the global supply chain and multi-branch warehouse hierarchy. It includes the "4-Step Inter-Branch Protocol" and "Dead Stock Rebalancing" logic.

## Technical Details
- **Source Path:** `backend/dukaan/dukaan/retail_logic.py`
- **Related Tests:** `backend/dukaan/tests/test_retail_logic.py`, `backend/dukaan/tests/test_inter_branch_transfer.py`
- **Tech Stack Ref:** [[conductor/tech-stack|Tech Stack]]

## Architecture Notes
- **Warehouse Hierarchy:** Each branch has a "Local" and a "Transit" warehouse.
- **Inter-Branch Protocol:** 
    1. Request -> 2. Dispatch -> 3. Approve -> 4. Receipt.
- **Transit Safety:** Goods are physically moved to a "Transit" warehouse during the dispatch phase to prevent ghost stock.
- **Dead Stock Rebalancing:** AI-driven triggers identify stagnant stock and suggest rebalancing transfers.

## Key Logic
- [[conductor/archive/inter_branch_20260606/index|Inter-Branch Transfer Track]]
- [[conductor/tracks/procurement_init_20260606/index|Procurement Track]]

## Review History
- Last Reviewed: 2026-06-07
