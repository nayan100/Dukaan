---
type: module
path: _Systems
created: 2026-06-06
tags: [project/module, auth, rbac]
---
# Module: Authentication & RBAC

## Overview
Dukaan uses a unified multi-tenant authentication engine built on top of the Frappe Framework. It implements a "Hierarchical RBAC" system where permissions are shadowed from the backend to the frontend for zero-latency UI responsiveness.

## Technical Details
- **Source Path:** `backend/dukaan/dukaan/auth.py`
- **Related Tests:** `backend/dukaan/tests/test_auth.py`, `backend/dukaan/tests/test_ird_sync_flow.py`
- **Tech Stack Ref:** [[conductor/tech-stack|Tech Stack]]

## Architecture Notes
- **Multi-Tenant Isolation:** Login logic validates `tenant_id` before authenticating users.
- **Permission Shadowing:** Role profiles are fetched at login and stored in encrypted `sessionStorage`.
- **Permission Guards:** React components use the `<PermissionGuard />` to conditionally render UI based on shadowed roles.
- **Hard Validation:** All critical backend actions perform a secondary server-side permission check.

## Key Logic
- [[conductor/archive/auth_rbac_20260606/index|Auth & RBAC Track]]
- [[_Systems/API|API Reference]]

## Review History
- Last Reviewed: 2026-06-07
