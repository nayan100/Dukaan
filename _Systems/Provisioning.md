---
type: module
path: _Systems
created: 2026-06-06
tags: [project/module, provisioning, multi-tenant]
---
# Module: Tenant Provisioning

## Overview
Establishes the foundational multi-tenant architecture of the Dukaan SaaS platform. It manages the lifecycle of business entities and tenant-specific resources.

## Technical Details
- **Source Path:** `backend/dukaan/dukaan/tenant_provisioning.py`
- **Related Tests:** `backend/dukaan/tests/test_tenant_provisioning.py`
- **Tech Stack Ref:** [[conductor/tech-stack|Tech Stack]]

## Architecture Notes
- **SaaS Infrastructure:** Automated site creation and database setup hooks.
- **Metadata Management:** Custom DocTypes for `Tenant` and `Subscription` metadata.
- **Resource Isolation:** Ensures strict separation between tenant data and platform-wide configurations.

## Key Logic
- [[conductor/archive/setup_pos_core_20260606/index|POS Core Setup Track]]
- [[conductor/product#3.-saas-control-center-platform-admin|SaaS Control Center]]

## Review History
- Last Reviewed: 2026-06-07
