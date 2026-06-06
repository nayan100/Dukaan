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

def update_vat_annex_13(doc, method):
    """
    Hook to update VAT Annex 13 (Sales Register) when a Sales Invoice is submitted or cancelled.
    """
    if method == "on_submit":
        annex_doc = frappe.get_doc({
            "doctype": "VAT Annex 13",
            "posting_date": doc.posting_date,
            "invoice_number": doc.name,
            "customer_name": doc.customer_name,
            "customer_pan": doc.get("customer_pan"),
            "taxable_amount": doc.total,
            "vat_amount": doc.total_taxes_and_charges,
            "total_amount": doc.grand_total,
            "source_doctype": doc.doctype,
            "source_name": doc.name
        })
        annex_doc.insert()
    elif method == "on_cancel":
        frappe.db.delete("VAT Annex 13", {
            "source_doctype": doc.doctype,
            "source_name": doc.name
        })

def update_vat_annex_14(doc, method):
    """
    Hook to update VAT Annex 14 (Purchase Register) when a Purchase Invoice is submitted or cancelled.
    """
    if method == "on_submit":
        annex_doc = frappe.get_doc({
            "doctype": "VAT Annex 14",
            "posting_date": doc.posting_date,
            "invoice_number": doc.name,
            "supplier_name": doc.supplier_name,
            "supplier_pan": doc.get("supplier_pan"),
            "taxable_amount": doc.total,
            "vat_amount": doc.total_taxes_and_charges,
            "total_amount": doc.grand_total,
            "source_doctype": doc.doctype,
            "source_name": doc.name
        })
        annex_doc.insert()
    elif method == "on_cancel":
        frappe.db.delete("VAT Annex 14", {
            "source_doctype": doc.doctype,
            "source_name": doc.name
        })

def verify_vat_registers_integrity():
    """
    Compares the grand totals between source ledger DocTypes and materialized VAT registers.
    Returns a dictionary of discrepancies found.
    """
    discrepancies = {}
    
    # Check Annex 13 (Sales)
    sales_ledger_total = frappe.db.sql("SELECT SUM(grand_total) as total FROM `tabSales Invoice` WHERE docstatus=1", as_dict=True)[0].get("total") or 0
    sales_register_total = frappe.db.sql("SELECT SUM(total_amount) as total FROM `tabVAT Annex 13` ", as_dict=True)[0].get("total") or 0
    
    if sales_ledger_total != sales_register_total:
        discrepancies["VAT Annex 13"] = {
            "ledger_total": sales_ledger_total,
            "register_total": sales_register_total,
            "diff": sales_ledger_total - sales_register_total
        }
        
    # Check Annex 14 (Purchase)
    purchase_ledger_total = frappe.db.sql("SELECT SUM(grand_total) as total FROM `tabPurchase Invoice` WHERE docstatus=1", as_dict=True)[0].get("total") or 0
    purchase_register_total = frappe.db.sql("SELECT SUM(total_amount) as total FROM `tabVAT Annex 14` ", as_dict=True)[0].get("total") or 0
    
    if purchase_ledger_total != purchase_register_total:
        discrepancies["VAT Annex 14"] = {
            "ledger_total": purchase_ledger_total,
            "register_total": purchase_register_total,
            "diff": purchase_ledger_total - purchase_register_total
        }
        
    if discrepancies:
        frappe.log_error(message=json.dumps(discrepancies, indent=2), title="VAT Register Discrepancy Detected")
        
    return discrepancies

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
