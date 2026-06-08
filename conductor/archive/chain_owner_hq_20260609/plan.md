# Implementation Plan: Track 3 - The Chain Owner HQ

## Phase 1: Routing & State Management Foundation
- [x] ae0d553 Task: Setup Protected Route for `/hq`
    - [ ] Write failing test for unauthorized access redirection
    - [ ] Implement `ChainOwnerRoute` guard in React Router
    - [ ] Verify test passes
- [x] bfa7c1c Task: Initialize HQ Zustand Store
    - [ ] Define state interface for analytics, approval queue, and wizard progress
    - [ ] Write tests for initial state and basic actions
    - [ ] Implement `useHQStore`
- [x] 4d98a4e Task: Conductor - User Manual Verification 'Phase 1: Routing & State Management Foundation' (Protocol in workflow.md)

## Phase 2: Executive Scorecard & Dead Stock Rebalancer
- [x] fe615d8 Task: Implement Global Metrics Dashboard
    - [ ] Write unit tests for data aggregation utility functions
    - [ ] Implement UI with `recharts` for Total Revenue and Volumes
    - [ ] Integrate with mock/simulated data API
- [x] f9d33b5 Task: Implement Comparative Analytics View
    - [ ] Build side-by-side performance matrix UI
- [x] 7ace523 Task: Implement Dead Stock Rebalancer Map
    - [ ] Setup map library (e.g., Leaflet or custom UI map)
    - [ ] Implement color-coded pins and cluster regions based on inventory health
    - [ ] Build companion AG-Grid/TanStack Table for map data
- [x] 0632575 Task: Integrate AI Suggestions UI
    - [ ] Build UI overlay for AI-suggested transfers
    - [ ] Implement "Requires Human Approval" visual guardrails
- [x] 0fef578 Task: Conductor - User Manual Verification 'Phase 2: Executive Scorecard & Dead Stock Rebalancer' (Protocol in workflow.md)

## Phase 3: Global Approval Center
- [x] dabb7a7 Task: Build Unified Action Inbox UI
    - [ ] Create layout and list views for pending approvals
- [x] 0999658 Task: Implement Transfer Approvals Workflow
    - [ ] Write failing tests for approve/reject logic and state updates
    - [ ] Implement action handlers
    - [ ] Verify tests pass
- [x] 0999658 Task: Implement Procurement & Exception Approvals
    - [ ] Write failing tests for PO approvals and Void flags
    - [ ] Implement action handlers
    - [ ] Verify tests pass
- [x] 9b96dee Task: Conductor - User Manual Verification 'Phase 3: Global Approval Center' (Protocol in workflow.md)

## Phase 4: Growth Wizards Hub
- [x] 93e58ee Task: Build Wizard Infrastructure
    - [ ] Implement base wizard component with multi-step state preservation
- [x] 12da8b7 Task: Implement Branch Onboarding Wizard
    - [ ] Write form validation tests
    - [ ] Implement UI steps (setup, managers, quotas)
- [x] 12da8b7 Task: Implement Warehouse Mapping & IRD Wizards
    - [ ] Write form validation tests
    - [ ] Implement UI steps for both wizards
- [x] 12da8b7 Task: Implement Expansion & Strategy Wizards
    - [ ] Build wizard UI for regional expansion planning
- [x] 65a79a9 Task: Conductor - User Manual Verification 'Phase 4: Growth Wizards Hub' (Protocol in workflow.md)

## Phase 5: Polish & Quality Gates
- [x] 46f0d05 Task: UI/UX Refinement
    - [ ] Apply Slate-950 depth palette consistency
    - [ ] Add `framer-motion` layout transitions
- [x] 46f0d05 Task: Final Quality Audit
    - [ ] Run full test suite (ensure >80% coverage)
    - [ ] Check for linting/type errors
    - [ ] Verify offline resilience (IndexedDB caching)
- [x] 46f0d05 Task: Conductor - User Manual Verification 'Phase 5: Polish & Quality Gates' (Protocol in workflow.md)
