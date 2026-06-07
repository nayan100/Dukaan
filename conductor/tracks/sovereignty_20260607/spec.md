# Specification: SaaS Hardening & Data Isolation (The "Sovereignty" Track)

## Overview
This track focuses on implementing strict database-level multi-tenancy (Sovereignty) to ensure absolute data isolation between clients. It moves the system from a shared-schema model to a logically partitioned model enforced by global database hooks and a centralized administration suite.

## Functional Requirements

### Phase 1: Global Tenant Enforcement (Backend)
- **Automatic Query Filtering**: Implement a global Frappe `perm_query` hook.
  - Every MariaDB query across all DocTypes must include a `WHERE tenant_id = current_session.tenant_id` clause.
  - Source `tenant_id` strictly from the authenticated user's session.
- **Access Guard**: Implement a `doc_events` hook for `before_load` to check the `tenant_id` against the session for every single document access.
- **Write Isolation (Spoofing Protection)**: Implement a global `before_insert` hook that overwrites any `tenant_id` passed by the client with the one from the authenticated session.
- **Schema Hardening**: Update core DocTypes (`Item`, `Warehouse`, `Stock Entry`, `Invoice`, `Purchase Order`, `Supplier`) to include a mandatory, non-editable `tenant_id` field.
- **Staged Data Migration**: 
  - 1. Add `tenant_id` as nullable first.
  - 2. Batch update existing records in chunks of 5,000.
  - 3. Finalize as NOT NULL with indexes.

### Phase 2: SaaS Admin Control Center
- **Admin Dashboard**: Build a dedicated interface for the Provider (Super Admin) to manage client lifecycle.
- **Onboarding Automation**:
  - Automate "Fresh Instance" setup for new tenants.
  - Create default warehouses: `{Tenant} - Local`, `{Tenant} - Transit`.
  - Provision default Roles and Permission sets.
- **Monitoring Hub**:
  - Track Branch Activity (active POS sessions).
  - Monitor Resource Usage (DB size, document counts).
  - Manage Subscription Status (Active, Suspended, Trial).

### Phase 3: Multi-Tenant Auth Polish
- **AuthContext Enhancement**: Ensure `AuthContext` in the React frontend is strictly tied to a `tenant_id`.
- **Real-time Revocation**: Implement instant session revocation.
  - If a tenant's status is changed to "Suspended", all active session tokens for that tenant must be invalidated immediately across the cluster using Socket.io and Redis cache clearing.

## Non-Functional Requirements
- **Performance**: The `perm_query` hook must be optimized (e.g., ensuring `tenant_id` is indexed on all tables).
- **Security**: No database read/write operation should be possible without a valid `tenant_id` filter.
- **Auditability**: All tenant status changes (Suspension/Activation) must be logged in the Global Audit Trail.

## Acceptance Criteria
- [ ] A user from Tenant A cannot see any record (Item, Invoice, etc.) belonging to Tenant B, even via direct API calls.
- [ ] New tenants are fully operational (with default warehouses/roles) within 10 seconds of creation.
- [ ] Suspending a tenant in the Admin Dashboard immediately boots all active users of that tenant from the system.
- [ ] Database queries show the injected `tenant_id` filter in the query logs.

## Out of Scope
- Physical database separation (separate MariaDB instances per tenant).
- Custom domain mapping per tenant (stays on subdomains/subpaths for now).
- Tenant-specific feature flagging (Phase 4).
