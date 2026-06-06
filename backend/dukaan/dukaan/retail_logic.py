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

def validate_pos_entry(doc):
    """
    Strictly enforces that a POS entry belongs to the user's assigned branch.
    """
    # 1. Skip check for SaaS Admins
    user = frappe.get_doc("User", frappe.session.user)
    if user.role == "SaaS Admin":
        return

    # 2. Verify Branch Scoping
    if doc.branch != user.branch:
        frappe.throw(
            f"Unauthorized Access: You are assigned to {user.branch}, but attempted to write to {doc.branch}.",
            title="Permission Denied"
        )

def process_transfer_dispatch(transfer_name):
    """
    Handles the dispatch of an inter-branch transfer.
    Moves stock from Local to Transit.
    """
    transfer = frappe.get_doc("Inter-Branch Transfer", transfer_name)
    
    create_stock_entry(
        from_warehouse=f"{transfer.from_branch} - Local",
        to_warehouse=f"{transfer.from_branch} - Transit",
        items=transfer.items,
        purpose="Material Transfer"
    )
    
    transfer.db_set("status", "Dispatched")

def process_transfer_receipt(transfer_name):
    """
    Handles the receipt of an inter-branch transfer.
    Moves stock from Transit to Local.
    """
    transfer = frappe.get_doc("Inter-Branch Transfer", transfer_name)
    
    create_stock_entry(
        from_warehouse=f"{transfer.from_branch} - Transit",
        to_warehouse=f"{transfer.to_branch} - Local",
        items=transfer.items,
        purpose="Material Transfer"
    )
    
    transfer.db_set("status", "Received")

def create_stock_entry(from_warehouse, to_warehouse, items, purpose="Material Transfer"):
    """
    Helper to create a Stock Entry in Frappe.
    """
    se = frappe.get_doc({
        "doctype": "Stock Entry",
        "purpose": purpose,
        "from_warehouse": from_warehouse,
        "to_warehouse": to_warehouse,
        "items": items
    })
    se.insert(ignore_permissions=True)
    se.submit()
    return se
