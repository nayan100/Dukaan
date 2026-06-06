import datetime
import frappe

def create_tenant(details):
    """
    Creates a Tenant record and triggers site provisioning.
    """
    tenant = frappe.get_doc({
        "doctype": "Tenant",
        "company_name": details.get("company_name"),
        "plan": details.get("plan"),
        "status": "Pending"
    })
    tenant.insert(ignore_permissions=True)
    
    # In a real Frappe app, this might be a background job
    provision_new_site(tenant.name)
    return tenant

def provision_new_site(tenant_name):
    """
    Simulation of site creation and database setup.
    """
    tenant = frappe.get_doc("Tenant", tenant_name)
    
    # Simulate site creation logic
    site_url = f"https://{tenant_name.lower().replace(' ', '-')}.dukaan.com"
    db_name = f"db_{tenant_name.lower().replace(' ', '_')}"
    
    tenant.db_set("site_url", site_url)
    tenant.db_set("db_name", db_name)
    tenant.db_set("status", "Active")
    
    frappe.msgprint(f"Site provisioned for {tenant_name}")

def format_tenant_metadata(data):
    """
    Formats tenant data for storage.
    """
    return {
        "company_name": data.get("name"),
        "plan": data.get("plan"),
        "status": "Pending",
        "created_at": datetime.datetime.now().isoformat()
    }
