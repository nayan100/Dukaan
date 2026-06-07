import datetime
import frappe

def create_tenant(details):
    """
    Creates a Tenant record and triggers site provisioning.
    """
    tenant = frappe.get_doc({
        "doctype": "Tenant",
        "company_name": details.get("company_name"),
        "plan_tier": details.get("plan_tier"),
        "status": "Pending"
    })
    tenant.insert(ignore_permissions=True)
    
    # In a real Frappe app, this might be a background job
    provision_new_site(tenant.name)
    return tenant

def provision_new_site(tenant_name):
    """
    Simulate site creation, database setup, and default resource provisioning.
    """
    tenant = frappe.get_doc("Tenant", tenant_name)
    
    # 1. Simulate site creation logic
    site_url = f"https://{tenant_name.lower().replace(' ', '-')}.dukaan.com"
    db_name = f"db_{tenant_name.lower().replace(' ', '_')}"
    
    tenant.site_url = site_url
    tenant.db_name = db_name
    
    # 2. Provision Default Warehouse
    warehouse_name = f"{tenant_name} - Local"
    if not frappe.db.exists("Warehouse", warehouse_name):
        warehouse = frappe.get_doc({
            "doctype": "Warehouse",
            "warehouse_name": warehouse_name,
            "is_group": 0,
            "tenant_id": tenant.name
        })
        warehouse.insert(ignore_permissions=True)
        tenant.default_warehouse = warehouse.name
    
    tenant.status = "Active"
    tenant.save(ignore_permissions=True)
    
    frappe.msgprint(f"Site provisioned and warehouse '{warehouse_name}' created for {tenant_name}")

def format_tenant_metadata(data):
    """
    Formats tenant data for storage.
    """
    return {
        "company_name": data.get("name"),
        "plan_tier": data.get("plan_tier"),
        "status": "Pending",
        "created_at": datetime.datetime.now().isoformat()
    }
