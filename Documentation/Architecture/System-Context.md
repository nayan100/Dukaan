---
tags: [architecture, headless, erpnext, react]
created: 2026-05-29
---

# System Context: Headless ERP Architecture

This diagram outlines the high-level architecture for the Sellpoint application, utilizing ERPNext as a headless backend engine to handle complex accounting and Nepal-specific compliance, while exposing a custom React frontend for the specific user dashboards.

```mermaid
graph TD
    %% External Entities
    Suppliers[Suppliers / Vendors]
    PaymentGateway[Payment Gateways e.g., Fonepay]
    IRD[Nepal IRD API]

    %% Frontend Dashboards
    subgraph Custom Frontend [React / Next.js Web App]
        Admin[Admin Dashboard]
        Owner[Chain/Shop Owner Dashboard]
        Billing[Sellpoint Billing Dashboard]
        Accountant[Accountant Dashboard]
    end

    %% API Gateway / Backend For Frontend
    API[Node.js / Express API Gateway]

    %% Core ERP Engine
    subgraph Headless Backend [ERPNext Docker Container]
        ERP[ERPNext Core]
        NepalApp[nepal-compliance App]
        MariaDB[(MariaDB)]
        
        ERP --- MariaDB
        ERP --- NepalApp
    end

    %% Connections
    Admin -->|REST API| API
    Owner -->|REST API| API
    Billing -->|REST API| API
    Accountant -->|REST API| API
    
    API -->|ERPNext REST API| ERP

    %% External Connections
    Owner -.->|Purchase Orders| Suppliers
    Billing -.->|Process Payments| PaymentGateway
    NepalApp -.->|Tax Compliance| IRD
```

## Key Decisions
- **ERPNext** is used strictly as a backend to bypass the need to rebuild double-entry accounting, 13% VAT, and IRD compliance.
- The **API Gateway** acts as a middle layer to format data specifically for the React dashboards, ensuring the frontend is decoupled from Frappe's specific data structures.
