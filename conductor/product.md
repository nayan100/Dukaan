# Product Definition: Dukaan (Finalized)

## 1. Product Vision
Dukaan is a high-performance, multi-branch POS and Chain Management SaaS platform with a **Native AI Orchestration Layer**. It bridges the gap between local branch speed and global chain intelligence.

## 2. Target Personas
*   **SaaS Platform Admin:** Manages the entire platform via the **SaaS Control Center**.
*   **Chain Owner:** Strategic orchestration via the AI-augmented **Growth & KPI Hub**.
*   **Branch Owner:** Local operational autonomy via the **Branch Management Suite** featuring the persona-driven **Action Inbox**.
*   **Cashier:** Billing speed through an AI-co-piloted, high-contrast POS HUD.
*   **Accountant:** Compliance and reconciliation through dense data grids.

## 3. SaaS Control Center (Platform Admin)
*   **Tenant Provisioning:** Lifecycle management of business entities and tenant-specific database instances.
*   **Subscription Management:** Managing plan tiers, license seats, and usage-based billing metrics.
*   **Platform Health Hub:** System-wide monitoring, resource logs, and automated backup/recovery.
*   **Global Audit Trail:** Comprehensive logging of all administrative actions across the platform.

## 4. Growth & KPI Hub (Chain Owner)
*   **Growth Wizards Hub:** Automated workflows for branch onboarding, warehouse mapping, and IRD registration.
*   **Inventory Orchestration:** Global stock visibility with AI-driven 'Rebalance' triggers for stagnant inventory.
*   **Global Pricing Control:** Centralized price list management with hash-based versioning.
*   **Hierarchical Access Hub:** Unified management of permission trees and role shadowing.
*   **Multi-View Dashboards:** Executive Scorecards, Operational Heatmaps, and Comparative Analytics.
*   **Persona Showcase Portal:** Interactive, "One-Click" demo environment with predefined personas (Admin, Owner, Manager, Cashier, Accountant) for end-to-end flow validation.

## 5. Native AI Orchestration Layer
*   **Cashier Co-pilot (Edge-AI):** Real-time predictive item search and suggestions using lightweight browser-based models for offline-resilience.
*   **Security Sentinel:** Automated anomaly detection for fraud prevention and 'Discount Velocity' flags.
*   **Strategic Orchestrator:** AI-driven inventory rebalancing and demand forecasting.
*   **Human-in-the-Loop:** All AI-driven suggestions (transfers, high discounts) require human approval within set guardrails.
*   **Aggregated Intelligence:** Privacy-preserving, anonymized data aggregation to improve cross-chain predictive accuracy.

## 6. Branch Management Suite (Branch Manager)
*   **Action Inbox:** Task-oriented dashboard for daily logistics, low-stock alerts, and 72-hour transit warnings.
*   **Local Quota Governance:** Real-time visual tracking of resource consumption against sovereign limits via burn-down charts.
*   **Integrated Logistics Hub:** Consolidated view for initiating and processing inter-branch stock movements and procurement receipts.
*   **Inventory Intelligence:** Branch-scoped stock tracking with threshold-based alerting and local valuation.

## 7. Execution & Documentation Strategy
*   **Interactive Documentation:** Maintain a high-quality README and Wiki featuring Mermaid diagrams, interactive walkthroughs, and deep links to technical specs.
*   **Agile Feature Sprints:** Iterative 2-week sprints delivering functional vertical slices.
*   **E2E Quality Gates:** Automated critical path testing (Cypress/Playwright) for POS billing and IRD sync.
*   **Zero-Downtime CD:** Automated CI/CD with staging environments and Blue-Green deployments.

## 8. Design & Engineering Principles
*   **Visual Sovereignty (High-Speed UX):** Zero-latency feel with a premium Slate-950 depth palette, optimized for professional retail environments.
*   **Type-Safe Modular Code:** Strict TypeScript and 'Screaming Architecture' for long-term maintainability.
*   **TDD-First Approach:** Mandatory test coverage for all financial, sync, and compliance logic.

## 9. Core MVP Modules
*   **POS & Payment Core:** Full-screen HUD with keyboard-first navigation, 60-second "Autonomous Void" locking, Fonepay QR integration with manual bypass, and a cross-branch Item Return Wizard.
*   **Inter-Branch Protocol:** Resilient 4-step workflow (Request -> Dispatch -> Approve -> Receipt) with auto-rejection logic.
*   **Compliance & IRD Sync:** Real-time sync with the IRD Central Billing Monitoring System and immutable audit trails.
*   **Procurement & Stock Management:** High-integrity Purchase Order (PO) flows with split-order detection, multi-persona approval handshakes, and soft budget enforcement. Includes physical-first opening stock entry with moving average valuation and a blind spot-check protocol.
*   **Financial Governance Enhancements:** Introduction of Landed Cost Vouchers for accurate stock valuation and direct integration with Annex 14 Purchase Registers for compliance.
*   **Showcase & Demo Utility:** Environment seeding scripts and "Phoenix Reset" protocol for rapid deployment of test/demo scenarios.

## 10. Operational Guardrails
*   **Real-time Resilience:** PWA architecture with IndexedDB caching and real-time background sync.
*   **Financial Governance:** Cross-branch returns with auto-generated adjustments and budget enforcement.
*   **Permission Shadowing:** Client-side UI updates backed by server-side Frappe/ERPNext validation.
