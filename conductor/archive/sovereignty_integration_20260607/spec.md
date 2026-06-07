# Specification: Dashboard Hardening & Sovereignty Integration

## Overview
This track integrates the database-level multi-tenancy and session revocation features implemented in the "Sovereignty" track into the existing frontend dashboards. It ensures that the "Logical Data Isolation" is reflected in the UI and that administrative actions (like suspension) have an immediate effect on the user experience.

## Functional Requirements

### 1. Unified Shell Integration
- **AppLayout Migration**: Transition the application from the basic `App.tsx` view switcher to the professional `AppLayout` shell.
- **Sovereignty Header**: Display the current `tenantId` and session status (Active/Suspended) in the global navigation bar.

### 2. Dashboard Hardening
- **POS HUD**: 
  - Ensure every transaction is tagged with the current `tenantId` before submission.
  - Disable the "Pay" button if the tenant status is not "Active".
- **Admin Dashboard**: 
  - Integrate real-time status checks using the `validate_tenant` API.
  - Provide a visual trigger for "Instant Revocation" when a tenant's status is changed.
- **Strategy Hub (KPIs)**: Ensure all data fetching for analytics is scoped by the `tenantId`.

### 3. Resilience & Revocation
- **Lockdown Overlay**: Implement a global UI overlay that blocks all interactions if the session is revoked or the tenant is suspended.
- **Background Validation**: Trigger `validateTenant` checks on every major tab switch (navigation) within the `AppLayout`.

## Acceptance Criteria
- [ ] User can see their current Tenant ID in the header at all times.
- [ ] Changing a tenant to "Suspended" in the Admin UI immediately triggers a "Revoked" state in any active POS session for that tenant.
- [ ] All data displayed in POS and KPI dashboards is confirmed to be filtered by the active tenant.
- [ ] The application remains responsive while performing background tenant validation.
