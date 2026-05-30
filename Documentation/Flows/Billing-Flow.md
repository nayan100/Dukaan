---
tags: [flow, billing, pos, checkout]
created: 2026-05-29
---

# Sellpoint Billing Flow

This flowchart maps the process of a cashier checking out a customer at the Sellpoint POS dashboard, emphasizing how it interacts with the headless ERPNext backend.
> [NOTE]
 This checkout logic is part of the high-level [Seller-Flow.md](./Seller-Flow.md).

```mermaid
graph TD
    Start([Cashier Scans Item]) --> FetchItem{Item in Cache?}
    FetchItem -- Yes --> AddCart[Add to Cart & Calculate Totals]
    FetchItem -- No --> API_Fetch[Fetch from ERPNext API]
    API_Fetch --> AddCart
    
    AddCart --> MoreItems{More Items?}
    MoreItems -- Yes --> Start
    MoreItems -- No --> Checkout[Click Checkout]
    
    Checkout --> ProcessPayment[Process Payment / Cash Received]
    ProcessPayment --> SubmitAPI[Submit Sales Invoice to ERPNext API]
    
    SubmitAPI --> ERP_Process{ERPNext Processing}
    ERP_Process -->|Deducts Stock| Stock[Update Inventory Ledger]
    ERP_Process -->|Applies 13% VAT| Tax[Update Tax Ledger]
    ERP_Process -->|Records Income| Ledger[Update Accounting Ledger]
    
    Stock --> ReturnSuccess[Return Success Response]
    Tax --> ReturnSuccess
    Ledger --> ReturnSuccess
    
    ReturnSuccess --> Print[Print Receipt / Digital Receipt]
    Print --> End([Ready for Next Customer])


```
