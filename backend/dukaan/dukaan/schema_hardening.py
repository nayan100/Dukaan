import frappe

def run_staged_migration_step_1():
    """
    Step 1: Add nullable tenant_id field to standard Frappe/ERPNext doctypes.
    The custom Dukaan doctypes (Warehouse, Purchase Order, Supplier) are handled via their JSON schema.
    """
    # The requirement asks for Item, Stock Entry, Invoice
    # We will use 'Sales Invoice' and 'Purchase Invoice' for Invoice
    doctypes = ["Item", "Stock Entry", "Sales Invoice", "Purchase Invoice"]
    
    for dt in doctypes:
        if not frappe.db.exists("Custom Field", {"dt": dt, "fieldname": "tenant_id"}):
            custom_field = frappe.get_doc({
                "doctype": "Custom Field",
                "dt": dt,
                "fieldname": "tenant_id",
                "fieldtype": "Link",
                "options": "Tenant",
                "label": "Tenant ID",
                "insert_after": "naming_series", # usually a good place
                "read_only": 1
            })
            custom_field.insert(ignore_permissions=True)

