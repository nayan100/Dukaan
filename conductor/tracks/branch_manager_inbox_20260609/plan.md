# Track: The Branch Manager "Action Inbox" (Refined)

## Objective
Transform the `/branch` route from a flat dashboard into a persona-driven command center for Branch Managers. This track recovers and integrates "hidden" high-fidelity modules (`TransferUI`, `ProcurementSuite`) to create a comprehensive Action Inbox, Logistics Hub, and Procurement Center, all unified under "Visual Sovereignty."

## Key Files & Context
- **Layout:** `frontend/src/components/branch/BranchLayout.tsx` (New)
- **Views:**
    - `frontend/src/components/branch/ActionInbox.tsx` (New)
    - `frontend/src/components/branch/BranchInventory.tsx` (New - refactored from `BranchDashboard.tsx`)
    - `frontend/src/components/branch/BranchLogistics.tsx` (Adapting `frontend/src/components/logistics/TransferUI.tsx`)
    - `frontend/src/components/branch/BranchProcurement.tsx` (Adapting `frontend/src/components/ProcurementSuite/ProcurementSuite.tsx`)
- **Store:** `frontend/src/store/useBranchStore.ts` (New)
- **Existing Files to Update:**
    - `frontend/src/App.tsx`: Register the new `BranchLayout` and nested routes.
    - `frontend/src/components/layout/AppLayout.tsx`: Update navigation for branch sub-routes.

## Implementation Steps

### 1. State Management (`useBranchStore.ts`)
Create a new store to manage branch-specific tasks, notifications, and logistics state.
- [ ] Define `BranchTask` type (Logistics, Stock Alert, Quota Warning, Procurement Approval).
- [ ] Implement actions for completing/resolving tasks.
- [ ] Mock initial tasks for the showcase (including a "72-Hour Transit Alert").

### 2. Layout & Routing (`BranchLayout.tsx`)
- [ ] Implement a sub-navigation bar (Tabs) for "Inbox", "Inventory", "Logistics", and "Procurement".
- [ ] Use `framer-motion` for smooth view transitions.
- [ ] Update `App.tsx` to use `BranchLayout` at the `/branch` path with nested routes:
    - `/branch/inbox`
    - `/branch/inventory`
    - `/branch/logistics`
    - `/branch/procurement`

### 3. Action Inbox (`ActionInbox.tsx`)
- [ ] Create a task-card-based interface.
- [ ] Implement specialized cards for:
    - **Inter-Branch Requests:** Link to Logistics Hub.
    - **Low Stock Alerts:** Link to Inventory Hub.
    - **72-Hour Transit Alert:** Visual warning for stock stuck in dispatch.
    - **Procurement Tasks:** Link to Procurement Hub for pending receipts/POs.

### 4. Refined Inventory View (`BranchInventory.tsx`)
- [ ] Refactor existing `BranchDashboard.tsx` logic into this dedicated component.
- [ ] Add "Local Quota Burn-Down" charts (SVG or simple CSS bars) to visualize resource usage against limits.

### 5. Logistics Hub (`BranchLogistics.tsx`)
- [ ] Adapt `TransferUI.tsx` to fit within the `BranchLayout`.
- [ ] Ensure it supports both "Request" and "Dispatch" modes.
- [ ] Connect to `useInventoryStore` for real-time stock availability.

### 6. Procurement Hub (`BranchProcurement.tsx`)
- [ ] Adapt `ProcurementSuite.tsx` for local branch use.
- [ ] Simplify or focus on PO Tracking and Receipt Entry for the Branch Manager persona.
- [ ] Integrate "Budget Warning UI" if relevant for local procurement.

### 7. Visual Refinements & Integration
- [ ] Ensure all components adhere to the "Visual Sovereignty" palette (`Slate-950`).
- [ ] Update `AppLayout.tsx` navigation labels and icons.
- [ ] Task: Conductor - User Manual Verification 'Branch Manager Showcase' (Protocol in workflow.md)

## Verification & Testing
- **Unit Tests:** Create `frontend/src/store/useBranchStore.test.ts` to verify task state transitions.
- **Component Tests:** Verify rendering of task cards and "72-Hour Alert" logic.
- **Manual Verification:**
    - Navigate through all sub-routes and verify UI consistency.
    - Confirm `TransferUI` and `ProcurementSuite` functionality within the new layout.
