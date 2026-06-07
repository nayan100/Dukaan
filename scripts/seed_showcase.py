#!/usr/bin/env python3
import sys
import os
import random
from datetime import datetime, timedelta

# Try to import frappe, if not available, provide a minimal mock for standalone execution
try:
    import frappe
except ImportError:
    print("⚠️  Frappe not found. Running in simulation mode.")
    from unittest.mock import MagicMock
    frappe = MagicMock()
    # Mock some basic behaviors
    frappe.db.exists.return_value = False
    class MockDoc:
        def __init__(self, d): 
            self.__dict__.update(d)
            self.doctype = d.get('doctype', 'Unknown')
            self.name = d.get('name') or d.get('company_name') or d.get('item_code') or d.get('branch_name') or 'mock-name'
        def insert(self, **kwargs): 
            name_val = getattr(self, 'item_code', getattr(self, 'company_name', getattr(self, 'supplier_name', getattr(self, 'branch_name', ''))))
            print(f"  [Sim] Inserting {self.doctype}: {name_val}")
            return self
        def save(self, **kwargs): return self
        def submit(self, **kwargs): return self
        def db_set(self, k, v): setattr(self, k, v)
    frappe.get_doc.side_effect = lambda d, n=None: MockDoc(d) if isinstance(d, dict) else MockDoc({'name': d, 'doctype': 'LinkedDoc'})

def provision_tenant(name, tier):
    print(f"Provisioning Tenant: {name} ({tier})...")
    if not frappe.db.exists("Tenant", name):
        tenant = frappe.get_doc({
            "doctype": "Tenant",
            "company_name": name,
            "plan_tier": tier,
            "status": "Active"
        })
        tenant.insert(ignore_permissions=True)
        return tenant
    return frappe.get_doc("Tenant", name)

def seed_business_data(tenant, items, branches, suppliers):
    print(f"\n--- Seeding data for {tenant.company_name} ---")
    
    # 1. Suppliers
    for s_name in suppliers:
        if not frappe.db.exists("Supplier", {"supplier_name": s_name, "tenant_id": tenant.name}):
            frappe.get_doc({
                "doctype": "Supplier",
                "supplier_name": s_name,
                "tenant_id": tenant.name
            }).insert(ignore_permissions=True)

    # 2. Items
    for item in items:
        if not frappe.db.exists("Item", {"item_code": item["item_code"], "tenant_id": tenant.name}):
            frappe.get_doc({
                "doctype": "Item",
                "item_code": item["item_code"],
                "item_name": item["item_name"],
                "valuation_rate": item["valuation_rate"],
                "tenant_id": tenant.name
            }).insert(ignore_permissions=True)

    # 3. Branches & Warehouses
    for b_name in branches:
        if not frappe.db.exists("Branch", {"branch_name": b_name, "tenant_id": tenant.name}):
            frappe.get_doc({
                "doctype": "Branch",
                "branch_name": b_name,
                "monthly_budget": 1000000,
                "tenant_id": tenant.name
            }).insert(ignore_permissions=True)
            
            # Seed Warehouses for Branch
            for wh_type in ["Local", "Transit"]:
                wh_name = f"{b_name} - {wh_type}"
                if not frappe.db.exists("Warehouse", {"warehouse_name": wh_name, "tenant_id": tenant.name}):
                    frappe.get_doc({
                        "doctype": "Warehouse",
                        "warehouse_name": wh_name,
                        "branch": b_name,
                        "tenant_id": tenant.name
                    }).insert(ignore_permissions=True)

    # 4. Historical Data
    seed_history(tenant, items, branches, suppliers)

def seed_history(tenant, items, branches, suppliers):
    print(f"Generating 6 months of history for {tenant.company_name}...")
    now = datetime.now()
    
    # Track "stock" loosely for realistic sales
    stock = {item['item_code']: 1000 for item in items}

    for i in range(180, 0, -1): # 180 days ago to today
        date = now - timedelta(days=i)
        
        # 4.1 Periodic Purchase Orders (Stocking)
        if i % 7 == 0: # Every week
            branch = random.choice(branches)
            supplier = random.choice(suppliers)
            item = random.choice(items)
            qty = random.randint(100, 500)
            
            frappe.get_doc({
                "doctype": "Purchase Order",
                "supplier": supplier,
                "branch": branch,
                "transaction_date": date.strftime("%Y-%m-%d"),
                "items": [{"item_code": item["item_code"], "qty": qty, "rate": item["valuation_rate"]}],
                "docstatus": 1,
                "tenant_id": tenant.name
            }).insert(ignore_permissions=True)
            stock[item['item_code']] += qty

        # 4.2 Daily Sales
        for _ in range(random.randint(2, 8)): # A few sales per day
            branch = random.choice(branches)
            item = random.choice(items)
            qty = random.randint(1, 10)
            
            if stock[item['item_code']] >= qty:
                frappe.get_doc({
                    "doctype": "Sales Invoice",
                    "branch": branch,
                    "transaction_date": date.strftime("%Y-%m-%d %H:%M:%S"),
                    "items": [{"item_code": item["item_code"], "qty": qty, "rate": item["valuation_rate"] * 1.3}],
                    "docstatus": 1,
                    "tenant_id": tenant.name
                }).insert(ignore_permissions=True)
                stock[item['item_code']] -= qty

def main():
    print("🚀 Starting Grand Showcase Seeding...")
    
    # 1. Provision Tenants
    everest = provision_tenant("Everest Groceries", "Enterprise")
    annapurna = provision_tenant("Annapurna Apparel", "Business")
    
    # 2. Seed Everest Groceries
    seed_business_data(everest, [
        {"item_code": "G-COFFEE-01", "item_name": "Organic Coffee", "valuation_rate": 450},
        {"item_code": "G-TEA-02", "item_name": "Green Tea", "valuation_rate": 200},
        {"item_code": "G-MILK-03", "item_name": "Fresh Milk", "valuation_rate": 100},
        {"item_code": "G-RICE-04", "item_name": "Basmati Rice", "valuation_rate": 1500}
    ], ["KTM Main", "PKR Lakeside", "BTP Industrial"], ["Narayani Suppliers", "Himalayan Traders"])
    
    # 3. Seed Annapurna Apparel
    seed_business_data(annapurna, [
        {"item_code": "A-SHIRT-01", "item_name": "Cotton Shirt", "valuation_rate": 1200},
        {"item_code": "A-PANTS-02", "item_name": "Denim Jeans", "valuation_rate": 2500},
        {"item_code": "A-JACKET-03", "item_name": "Winter Jacket", "valuation_rate": 4500}
    ], ["Lalitpur Hub", "Butwal Outlet"], ["Textile World", "Fashion Fabricators"])
    
    print("\n✅ Showcase Seeding Complete!")

if __name__ == "__main__":
    main()
