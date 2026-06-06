# Implementation Plan: Inter-Branch Inventory Protocol

## Phase 1: Core Transfer Logic [checkpoint: 1db0fbd]
Build the 4-step state machine and warehouse movements.

- [x] Task: Backend - Implement Inter-Branch Transfer DocType 9dfbb49
    - [x] [TDD] Write tests for Stock Entry movements (Local -> Transit).
    - [x] Create the state machine for the 4-step protocol.
- [x] Task: Frontend - Build Transfer Request & Dispatch UI e7cad4e
    - [x] Create a searchable item picker for branch-to-branch requests.
    - [x] Implement the 'Dispatch' interface for the sender branch.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Core Transfer Logic' (Protocol in workflow.md) 1db0fbd

## Phase 2: Intelligence & SLA Enforcement
Implement timers, rejection logic, and rebalancing alerts.

- [x] Task: Backend - Implement Business-Hour Aware Timers 7ce90d1
    - [x] Develop logic to pause the 5-hour timer during non-operational hours.
    - [x] Implement automated stock reversal on auto-rejection.
- [x] Task: Analytics - Develop Dead Stock Rebalancer HUD c0d7c96
    - [x] Create a view for Chain Owners showing stagnant items (>30 days).
    - [x] Implement 'Quick-Transfer' triggers from the rebalance list.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Intelligence & SLA Enforcement' (Protocol in workflow.md) c0d7c96
