import frappe

def setup_warehouse_hierarchy(branch_name):
    """
    Creates local and transit warehouses for a given branch.
    """
    create_warehouse(f"{branch_name} - Local", is_group=0, branch=branch_name)
    create_warehouse(f"{branch_name} - Transit", is_group=0, branch=branch_name)

def create_warehouse(warehouse_name, is_group=0, branch=None):
    """
    Helper to create a Warehouse record.
    """
    if frappe.db.exists("Warehouse", warehouse_name):
        return
    
    doc = frappe.get_doc({
        "doctype": "Warehouse",
        "warehouse_name": warehouse_name,
        "is_group": is_group,
        "branch": branch
    })
    doc.insert(ignore_permissions=True)
    return doc

def get_ird_naming_series(branch_code, year):
    """
    Returns an IRD compliant naming series.
    Format: BRANCH-YEAR-.#####
    """
    return f"{branch_code}-{year}-.#####"
