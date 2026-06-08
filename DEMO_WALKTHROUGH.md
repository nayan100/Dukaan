# Dukaan Grand Showcase: The Item Odyssey Walkthrough

This guide walks you through the end-to-end lifecycle of an item in the Dukaan Sovereign ecosystem, demonstrating multi-tenant isolation, hierarchical procurement, and compliance.

## Pre-requisites
1. Ensure the database is seeded: `python3 scripts/seed_showcase.py`
2. Start the frontend: `npm run dev` (if applicable)

---

## Step 1: Strategic Creation (Chain Owner)
**Persona:** Everest Groceries Owner  
1. On the Landing Page, click **Chain Owner**.
2. Navigate to **Strategy Hub**.
3. Verify that you see aggregated data for Everest Groceries (KTM, PKR, BTP).
4. Go to **Branch Management** to see the 3 active branches.

## Step 2: Operational Stocking (Branch Manager)
**Persona:** Branch Manager (KTM)  
1. Logout and click **Branch Manager** on the Landing Page.
2. Navigate to **Stock & Supply (Procurement Suite)**.
3. Create a **Purchase Order** for `G-COFFEE-01` (Organic Coffee) from `Narayani Suppliers`.
4. Submit the PO and notice the **Budget Guardrail** check.
5. Record a **Purchase Receipt** to increase local stock.

## Step 3: Logistics & Movement (Inter-Branch)
**Persona:** Branch Manager (KTM)  
1. Navigate to **Logistics**.
2. Initiate an **Inter-Branch Transfer** of 10 units of Coffee to `PKR Lakeside`.
3. Verify the status changes to `Dispatched`.
4. (Simulation) In a real scenario, the PKR Manager would then mark it as `Received`.

## Step 4: Frontline Sale (Cashier)
**Persona:** Cashier  
1. Logout and click **Cashier** on the Landing Page.
2. Notice the "Locked POS Mode" (Sidebar hidden, forced to POS).
3. Search for "Organic Coffee".
4. Complete a sale of 2 units.
5. Notice the **Offline-First** sync indicator in the header.

## Step 5: Compliance & Audit (Accountant)
**Persona:** Accountant  
1. Logout and click **Accountant** on the Landing Page.
2. Navigate to **IRD Monitor**.
3. Verify the sale from Step 4 is listed in the sync logs.
4. Check **VAT Annex 13** to see the transaction recorded for government reporting.

## Step 6: Platform Sovereignty (SaaS Admin)
**Persona:** SaaS Admin  
1. Logout and click **SaaS Admin**.
2. Navigate to **Admin Panel**.
3. Locate `Everest Groceries` and `Annapurna Apparel`.
4. (Optional) Simulate a suspension to see the "Sovereignty Revoked" lock screen in action.

---

## Verification Checklist
- [ ] No Everest data leaked to Annapurna.
- [ ] Budget guardrails prevented over-spending.
- [ ] Inter-branch transfer correctly adjusted transit stock.
- [ ] IRD sync logs match POS sales.
