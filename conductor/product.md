# Product Definition: Sellpoint

## Overview
Sellpoint is a multi-tenant web application designed for Point of Sale (POS) and inventory management. It utilizes a **Headless ERPNext** backend to ensure robust accounting and regional tax compliance (specifically Nepal's 13% VAT and IRD standards) while delivering a highly tailored, frictionless user experience via custom React dashboards.

## Goals
- Provide a scalable POS and inventory management system.
- Support multi-tenant/multi-branch operations flawlessly.
- Ensure strict tax compliance (Nepal IRD/VAT) without rebuilding complex accounting logic from scratch.
- Segment functionality based on specific user roles to minimize friction and enhance security.

## Target Audience
- **Chain Owners/Franchisees:** Managing multiple shop branches.
- **Shop Owners:** Managing individual store inventory and performance.
- **Accountants:** Handling financial audits, VAT filing, and expenditure tracking.
- **Cashiers/Billing Staff:** Processing daily transactions quickly.

## Core Features
### 1. Admin Dashboard
- Superuser control over the entire system.
- Tenant/Branch creation and global settings.

### 2. Shop Owner / Chain Owner Dashboard
- Multi-branch performance metrics.
- Global inventory tracking and transfer between stores.

### 3. Sellpoint (Billing) Dashboard
- Fast checkout interface (Barcode scanner support).
- Session/Cash drawer management.
- Direct inventory deduction upon sale (via API).

### 4. Accountant Dashboard
- Double-entry bookkeeping (powered by ERPNext).
- Automated VAT calculation and IRD report generation.
- Revenue vs. Expenditure checks and profit/loss statements.
