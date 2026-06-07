  Track 1: SaaS Hardening & Data Isolation (The "Sovereignty" Track)
  Focus: Ensuring Tenant A never sees Tenant B's data at the database level.

   * Phase 1: Global Tenant Enforcement (Backend):
       * Implement a global Frappe hook (perm_query) that automatically injects tenant_id filters into every database query across all DocTypes.
       * Update all schemas (Item, Warehouse, Stock Entry, Invoice) to include a mandatory, non-editable tenant_id field.
   * Phase 2: SaaS Admin Control Center:
       * Build a dashboard for you (the Provider) to manage client onboarding.
       * Automate "Fresh Instance" setup: creating default warehouses (KTM - Local, KTM - Transit) and default roles for every new tenant.
   * Phase 3: Multi-Tenant Auth Polish:
       * Finalize the AuthContext to ensure session tokens are tied to a specific tenant_id and revoked if the tenant status is changed to "Suspended".

  Track 2: The High-Integrity Retail Cycle (The "Workflow" Track)
  Focus: Connecting the dots from Procurement to Sale.

   * Phase 1: Procurement to Inventory:
       * Logic: Ensure Purchase Receipt not only updates VAT Annex 14 but also triggers the Moving Average valuation update for the specific tenant's items.
       * Audit: Implement a "Landed Cost" adjustment if additional charges (freight/tax) are added after the initial receipt.
   * Phase 2: POS to Stock Deduction:
       * Logic: Implement the backend submission for POS invoices that deducts stock from the branch's local warehouse in real-time.
       * Safety: Add "Negative Stock Prevention" logic that blocks a sale if physical inventory isn't present, with a Branch Owner override.
   * Phase 3: Financial Handshake:
       * Automate the "Shift Close" protocol. Cashiers must reconcile cash-in-hand against the system total before the shift can be closed and data synced to the
         Head Office.

  Track 3: Persona-Specific Command Centers (The "Visibility" Track)
  Focus: Tailored UI views for each role within a single client business.

   * The Cashier HUD: Optimized for billing speed. Shows only item catalog and personal sales targets. Costs and margins are strictly hidden.
   * The Branch Owner Dashboard: Focus on local health. Shows low-stock alerts for their branch, employee shift status, and "Discount Velocity" flags.
   * The Chain Owner/Accountant Hub: The "Strategy View". Multi-branch comparative sales, global inventory value, and tax compliance (Annex 13/14) registers.

  Track 4: Native AI Orchestration (The "Scale" Track)
  Focus: Optimizing the workflow once the data is clean and secure.

   * Phase 1: Predictive Rebalancing: AI suggests moving stock based on sales velocity, not just stagnant time.
   * Phase 2: Security Sentinel: Identifying suspicious voids or high-discount patterns that occur just before shift closure.
   * Phase 3: Automated Procurement: Generating PO drafts based on lead times and stock-out predictions.

  ---

  Why this order?
   1. Trust: Your clients will only pay if they know their data is safe from competitors (Track 1).
   2. Functionality: A SaaS must do the basics (Buy -> Stock -> Sell) perfectly before it tries to be "smart" (Track 2 & 3).
   3. Value: AI is the "premium" feature that converts single-store owners into multi-branch chain owners (Track 4).

