# Specification: Hierarchical Sovereignty & Quota Enforcement (Phase 4)

## Overview
This track implements a multi-level hierarchical user model with strict resource quotas. It enables a "Line of Command" where Admins manage Tenants (Owners), and Owners manage their respective Branches and POS staff, all within hard-coded limits defined at the Tenant level.

## Functional Requirements

### 1. The Hierarchical User Model
- **Admin**: Platform-level oversight. Creates Chain Owners and Single Owners.
- **Chain Owner**: Strategic manager. Creates Branch Owners and Accountants. Draws from Tenant-level branch/POS quotas.
- **Single Owner**: Combined strategic/operational manager. Creates POS users and Accountants directly.
- **Branch Owner**: Operational manager for a specific location. Creates POS users from a sub-allocated quota.
- **POS**: High-speed billing user. Access limited strictly to the POS HUD.
- **Accountant**: Read-only compliance user. Access to IRD Monitor and Logistics.

### 2. Quota Enforcement (SaaS Hardening)
- **Tenant-Level Limits**:
    - `max_branches`: Maximum number of Branch Owner accounts allowed.
    - `max_pos_accounts`: Total pool of POS accounts for the entire Tenant.
- **Dynamic Allocation**: Chain Owners can allocate slices of their `max_pos_accounts` to specific Branch Owners.
- **Backend Guard**: A `before_insert` hook on the User DocType to prevent sub-account creation if quotas are exceeded.

### 3. Role-Based Navigation (Visibility Matrix)
Refactor the frontend `AppLayout` to show/hide modules based on role:
- **Admin**: Tenants, Provisioning, Maintenance, Overview.
- **Chain Owner**: Strategy Hub, Branch Mgmt, Quota Monitor.
- **Single Owner**: Growth Wizard, IRD Monitor, Logistics, User Mgmt.
- **Branch Owner**: IRD Monitor, Logistics, POS Staff Mgmt.
- **POS**: Point of Sale HUD (Fullscreen, Sidebar hidden).
- **Accountant**: IRD Monitor, Logistics (Read-only), Audit Trail.

### 4. Admin Command Center
- Upgrade the Tenant Management UI to allow Admins to set and update Quotas (Branches/POS) for each tenant.
- Include a visual representation of "Quota Usage" (e.g., "12/20 POS seats used").

## Non-Functional Requirements
- **Security**: Sub-account creation must be routed through a whitelisted server-side method to prevent API spoofing.
- **Performance**: Sidebar rendering and permission checks must be memoized to ensure zero-latency navigation.
- **Auditability**: All quota changes and sub-account creations must be logged in the Global Audit Trail.

## Acceptance Criteria
- [ ] Admin can create a Chain Owner and set a limit of 3 branches.
- [ ] Chain Owner cannot create a 4th Branch Owner account.
- [ ] Branch Owner can only see data for their specific branch (enforced by `tenant_id` + `branch_id`).
- [ ] POS user is automatically locked into the POS HUD upon login.
- [ ] Accountant can view invoices and stock entries but cannot edit them or create new ones.
