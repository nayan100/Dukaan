import frappe
import json
import datetime

def sync_to_ird(invoice_name):
    """
    Mock service to sync an invoice to the IRD Central Billing Monitoring System.
    Returns the IRD receipt number on success.
    """
    invoice = frappe.get_doc("Sales Invoice", invoice_name)
    
    # Construct Annex 13 Payload
    payload = {
        "seller_pan": frappe.db.get_single_value("Dukaan Settings", "pan"),
        "buyer_pan": invoice.get("buyer_pan"),
        "buyer_name": invoice.get("customer_name"),
        "invoice_number": invoice.name,
        "invoice_date": invoice.posting_date,
        "total_amount": invoice.grand_total,
        "taxable_amount": invoice.total_taxes_and_charges,
        "tax_amount": invoice.total_taxes_and_charges,
        "is_offline": invoice.get("is_offline", 0),
        "synced_at": datetime.datetime.now().isoformat()
    }
    
    # Mock IRD endpoint call
    print(f"Mock IRD Syncing Payload: {json.dumps(payload, indent=2)}")
    
    # Simulate successful response
    receipt_no = f"IRD-{datetime.datetime.now().strftime('%Y%m%d')}-{invoice.name}"
    
    invoice.db_set("ird_receipt_no", receipt_no)
    invoice.db_set("ird_sync_status", "Synced")
    
    return receipt_no

def process_offline_queue():
    """
    Finds all invoices marked as offline and unsynced, and pushes them to IRD.
    """
    unsynced = frappe.get_all("Sales Invoice", filters={
        "is_offline": 1,
        "ird_sync_status": ["!=", "Synced"]
    })
    
    synced_count = 0
    for inv in unsynced:
        sync_to_ird(inv.name)
        synced_count += 1
        
    return synced_count
