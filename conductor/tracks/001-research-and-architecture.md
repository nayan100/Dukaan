# Track: 001 - Research and Architecture

## Description
Initial research into open-source POS/ERP systems to support a multi-role (Admin, Owner, Billing, Accountant) application with specific requirements for Nepal IRD compliance and 13% VAT.

## Status
Completed

## Key Decisions
- Adopted a **Headless ERP Architecture**.
- **Backend:** ERPNext with the `nepal-compliance` app.
- **Frontend:** Custom React/Next.js application to serve the 4 specific dashboards.

## Artifacts Generated
- `Documentation/Architecture/System-Context.md`
- `Documentation/Flows/Billing-Flow.md`
- Updated `conductor/product.md` and `conductor/tech-stack.md`
