# Implementation Plan: Advanced Auth & Hierarchical RBAC

## Phase 1: Authentication Engine [checkpoint: eec2410]
Build the multi-tenant login foundation.

- [x] Task: Backend - Implement Tenant-Aware Auth Hooks 4cad937
    - [x] [TDD] Write tests for cross-tenant login isolation.
    - [x] Create custom Frappe API for unified multi-tenant authentication.
- [x] Task: Frontend - Develop Login Interface 11c4de4
    - [x] Build the premium 'Sovereign' login page with Tenant ID selection.
    - [x] Implement secure session storage and token management.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Authentication Engine' (Protocol in workflow.md) eec2410

## Phase 2: Hierarchical RBAC & Shadowing
Implement the "Smart" UI that adapts to user roles.

- [x] Task: Frontend - Implement Permission Shadowing Service c3c7fc1
    - [ ] Create an `AuthProvider` and `usePermissions` hook.
    - [ ] Implement logic to fetch and "shadow" Frappe Role Profiles in `sessionStorage`.
- [x] Task: Frontend - Implement Guarded Routing & UI Components 19dc609
    - [ ] Create `<PermissionGuard />` component for fine-grained UI control.
    - [ ] Setup protected routes based on the Persona Matrix.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Hierarchical RBAC & Shadowing' (Protocol in workflow.md)

## Phase 3: Operations & UI Polish
Finalize the persona-based experience and fix POS layout.

- [ ] Task: UI - Fix POS HUD Layout (Fit-to-Page)
    - [ ] Refactor `POSHUD.tsx` to use flex-box/grid with 100vh/100vw constraints.
    - [ ] Ensure all components (Catalog, Cart, Payment) are responsive without overflow.
- [ ] Task: Backend - Implement Strict Write Validation
    - [ ] [TDD] Write tests for unauthorized branch write attempts.
    - [ ] Implement Frappe `validate` hooks to enforce branch-scoping for POS entries.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Operations & UI Polish' (Protocol in workflow.md)
