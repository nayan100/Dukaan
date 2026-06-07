# Implementation Plan: Hierarchical Sovereignty & Quota Enforcement

## Phase 1: Schema Surgery (Backend)
- [x] **Task 1.1**: Update `Tenant` DocType to include `max_branches` (Int), `max_pos_accounts` (Int), and `plan_tier` (Select).
- [x] **Task 1.2**: Update `User` DocType to include `parent_user` (Link: User), `allocated_pos_quota` (Int), and `branch_id` (Link: Warehouse/Branch).
- [x] **Task 1.3**: Create a new DocType `Sovereignty Quota Log` to track allocations and usage for auditing.

## Phase 2: The Enforcer (Backend Logic)
- [x] **Task 2.1**: Implement `create_sub_account` whitelisted API in `backend/dukaan/dukaan/auth.py`.
    - Logic: Validate role hierarchy (Chain Owner can't create Admin, etc.) and check quota limits.
- [x] **Task 2.2**: Add `before_insert` hook to `User` to enforce quotas at the database level.
- [x] **Task 2.3**: Implement `get_tenant_quota_usage` API for frontend progress bars.

## Phase 3: Sovereign Shell Refactor (Frontend)
- [x] **Task 3.1**: Update `AuthContext` to fetch `role`, `parent_user`, and `permissions` on login.
- [x] **Task 3.2**: Refactor `AppLayout.tsx` to use a `navConfig` object that filters `navItems` based on the user's role and tenant capabilities.
- [x] **Task 3.3**: Implement "Locked POS Mode" for the `POS` role (removes sidebar, force-redirects to `/pos`).

## Phase 4: Admin & Owner Tooling (UI)
- [x] **Task 4.1**: Upgrade `TenantManagement.tsx` with quota sliders and usage metrics for Admins.
- [x] **Task 4.2**: Create `BranchManagement.tsx` for Chain Owners to manage their allocated branches and POS seats.
- [x] **Task 4.3**: Implement `UserManagement.tsx` for Single Owners and Branch Owners to manage their cashiers.

## Phase 5: Verification & Hardening
- [x] **Task 5.1**: Write `test_quota_enforcement.py` to verify backend rejection of over-quota users.
- [ ] **Task 5.2**: Write `test_role_visibility.tsx` to verify sidebar item hiding/showing.
- [x] **Task 5.3**: Perform a "Revocation Stress Test" to ensure parent account suspension cascades to all sub-accounts.

## Phase: Review Fixes
- [x] Task: Apply review suggestions (Role mismatch & missing personas) 7cebce0
