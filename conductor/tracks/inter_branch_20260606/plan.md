# Implementation Plan: Inter-Branch Inventory Protocol

## Phase 1: Core Transfer Logic
Build the 4-step state machine and warehouse movements.

- [ ] Task: Backend - Implement Inter-Branch Transfer DocType
    - [ ] [TDD] Write tests for Stock Entry movements (Local -> Transit).
    - [ ] Create the state machine for the 4-step protocol.
- [ ] Task: Frontend - Build Transfer Request & Dispatch UI
    - [ ] Create a searchable item picker for branch-to-branch requests.
    - [ ] Implement the 'Dispatch' interface for the sender branch.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Core Transfer Logic' (Protocol in workflow.md)

## Phase 2: Intelligence & SLA Enforcement
Implement timers, rejection logic, and rebalancing alerts.

- [ ] Task: Backend - Implement Business-Hour Aware Timers
    - [ ] Develop logic to pause the 5-hour timer during non-operational hours.
    - [ ] Implement automated stock reversal on auto-rejection.
- [ ] Task: Analytics - Develop Dead Stock Rebalancer HUD
    - [ ] Create a view for Chain Owners showing stagnant items (>30 days).
    - [ ] Implement 'Quick-Transfer' triggers from the rebalance list.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Intelligence & SLA Enforcement' (Protocol in workflow.md)
