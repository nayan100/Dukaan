# Implementation Plan: The Cashier POS HUD ("Zero-Latency Interface")

**Goal:** Transform POS MVP into a high-fidelity, high-contrast, keyboard-first interface.

## Phase 1: Advanced Keyboard Controls
- [ ] **Task 1.1**: Implement global keyboard listeners in `POSHUD.tsx` for `F1` and `/` to focus the search input.
- [ ] **Task 1.2**: Add `+` and `-` key listeners to adjust the quantity of the most recently added cart item.
- [ ] **Task 1.3**: Refine `Enter` and `Esc` behavior for seamless modal transitions.
- [ ] **Task: Conductor - User Manual Verification 'Phase 1: Keyboard Controls' (Protocol in workflow.md)**

## Phase 2: Visual "Autonomous Void" HUD
- [ ] **Task 2.1**: Update the cart item component to include a `countdown` state (60s timer).
- [ ] **Task 2.2**: Implement a shrinking Emerald progress bar at the bottom of each cart item card.
- [ ] **Task 2.3**: Add logic to replace the "Void" button with a Lock icon when the timer hits zero.
- [ ] **Task 2.4**: Implement the "Amber Warning Pulse" for the critical 10s window.
- [ ] **Task: Conductor - User Manual Verification 'Phase 2: Void HUD' (Protocol in workflow.md)**

## Phase 3: Fonepay v2 & Sync Pulse
- [ ] **Task 3.1**: Implement simulated polling logic in `PaymentModal.tsx` for digital payments.
- [ ] **Task 3.2**: Add a "Manual Verification" button that appears after 30s of unsuccessful polling.
- [ ] **Task 3.3**: Build the `SyncHeartbeat` UI component in the POS header, hooked into `useSyncStore`.
- [ ] **Task: Conductor - User Manual Verification 'Phase 3: Liveness Indicators' (Protocol in workflow.md)**

## Phase 4: Multi-Branch Return Wizard
- [ ] **Task 4.1**: Create `ReturnWizard.tsx` modal component with a multi-step verification flow.
- [ ] **Task 4.2**: Implement "Invoice ID Check" logic using local storage (IndexedDB).
- [ ] **Task 4.3**: Integrate "Inventory Increment" logic with the `useInventoryStore`.
- [ ] **Task 4.4**: Ensure return actions are logged in the Global Audit Trail.
- [ ] **Task: Conductor - User Manual Verification 'Phase 4: Return Protocol' (Protocol in workflow.md)**
