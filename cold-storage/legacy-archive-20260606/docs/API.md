# API Reference: Dukaan Core

This document outlines the primary API endpoints for interacting with the Dukaan headless backend.

## 1. Tenant Management
### `POST /api/method/dukaan.tenant_provisioning.create_tenant`
Provisions a new business entity.
**Payload:**
```json
{
  "company_name": "Kathmandu Retail",
  "plan": "Pro"
}
```

## 2. POS Operations
### `POST /api/method/frappe.desk.doctype.sales_invoice.sales_invoice.make_pos_invoice`
Submits a finalized transaction.
**Required compliance flags:**
- `is_offline`: Boolean
- `buyer_pan`: String (Optional)

## 3. IRD Compliance
### `GET /api/method/dukaan.compliance.get_annex_13`
Generates the VAT sales register for the current month.

---

**Note:** All requests must include a valid `Authorization` header with a Frappe API Secret.
