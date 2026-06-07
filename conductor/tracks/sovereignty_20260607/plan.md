# Implementation Plan: SaaS Hardening & Data Isolation (The "Sovereignty" Track)

## Phase 1: Global Tenant Enforcement & Schema Hardening
- [x] Task: Create `Tenant` DocType in Frappe (Fields: name, status, default_warehouse, plan_tier). [39ada48]
- [x] Task: Implement `AuthService` utility to fetch and cache `tenant_id` for the current user session. [6cdabb9]
- [x] Task: **Staged Migration (Step 1)**: Add nullable `tenant_id` field to `Item`, `Warehouse`, `Stock Entry`, `Invoice`, `Purchase Order`, and `Supplier`. [73c2d66]
- [x] Task: **Staged Migration (Step 2)**: Write and execute a batch background script to populate `tenant_id` with 'default' for existing records. [bf27179]
- [x] Task: Implement `permission_query_conditions` hook to inject `tenant_id` filters into all reads. [263260b]
- [x] Task: Implement `before_insert` and `validate` hooks to enforce `tenant_id` on all writes (preventing spoofing). [edb4ff1]
- [x] Task: **Staged Migration (Step 3)**: Finalize schema by making `tenant_id` mandatory (NOT NULL) and adding database indexes. [4c00ad7]
- [x] Task: Conductor - User Manual Verification 'Phase 1: Global Tenant Enforcement' (Protocol in workflow.md) [f530cd8]

## Phase 2: SaaS Admin Control Center
- [ ] Task: Build the `SaaS Admin Dashboard` shell in React (Slate-950 theme).
- [ ] Task: Implement `Tenant Management` list and detail views (Status toggles: Active, Suspended, Trial).
- [ ] Task: Create a `Tenant Provisioning Service` in Frappe to automate warehouse and role creation.
- [ ] Task: Develop the `Monitoring Hub` widgets: Branch Activity (active POS sessions) and Resource Usage (doc counts).
- [ ] Task: Implement the "Onboarding Wizard" for new tenants within the Admin Center.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: SaaS Admin Control Center' (Protocol in workflow.md)

## Phase 3: Multi-Tenant Auth Polish & Revocation
- [ ] Task: Update Frontend `AuthContext` to store and validate `tenant_id` on every route change.
- [ ] Task: Implement backend logic to clear Redis session cache when a Tenant is "Suspended".
- [ ] Task: Integrate `Socket.io` to emit a 'SESSION_REVOKED' event to all clients of a suspended tenant for instant logout.
- [ ] Task: Write E2E Isolation Tests: Verify that Tenant A can NEVER access Tenant B data via API or UI.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Multi-Tenant Auth Polish' (Protocol in workflow.md)
