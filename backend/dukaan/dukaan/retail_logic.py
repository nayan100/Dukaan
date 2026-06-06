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

def is_within_business_hours(dt):
    """
    Checks if a given datetime is within business hours (9 AM - 6 PM, Mon-Sat).
    """
    # Monday = 0, Sunday = 6
    if dt.weekday() == 6:
        return False
    
    start = dt.replace(hour=9, minute=0, second=0, microsecond=0)
    end = dt.replace(hour=18, minute=0, second=0, microsecond=0)
    
    return start <= dt <= end

def get_current_time():
    """Wrapper for datetime.now() for testing."""
    return datetime.now()

def check_and_reject_stale_transfers():
    """
    Background job to reject transfers not approved within 5 business hours.
    """
    now = get_current_time()
    
    if not is_within_business_hours(now):
        return

    # Find transfers in 'Dispatched' status
    stale_transfers = frappe.get_all("Inter-Branch Transfer", filters={
        "status": "Dispatched"
    })

    for entry in stale_transfers:
        transfer = frappe.get_doc("Inter-Branch Transfer", entry['name'])
        
        # Calculate age in hours (simplified business-hour logic)
        age_seconds = (now - transfer.creation).total_seconds()
        age_hours = age_seconds / 3600
        
        if age_hours >= 5:
            reject_transfer(transfer)

def reject_transfer(transfer):
    """
    Rejects a transfer and reverses stock from Transit back to Local.
    """
    create_stock_entry(
        from_warehouse=f"{transfer.from_branch} - Transit",
        to_warehouse=f"{transfer.from_branch} - Local",
        items=transfer.items,
        purpose="Material Transfer"
    )
    
    transfer.db_set("status", "Rejected")
