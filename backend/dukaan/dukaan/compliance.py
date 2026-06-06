import frappe
import json
import datetime
import requests

def sync_to_ird(invoice_name):
    """
    Syncs an invoice to the IRD Central Billing Monitoring System.
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
        "taxable_amount": invoice.total,
        "tax_amount": invoice.total_taxes_and_charges,
        "is_offline": invoice.get("is_offline", 0),
        "synced_at": datetime.datetime.now().isoformat()
    }
    
    try:
        receipt_no = call_ird_api(invoice.name, payload)
        
        invoice.db_set("ird_receipt_no", receipt_no)
        invoice.db_set("ird_sync_status", "Synced")
        return receipt_no
    except Exception as e:
        invoice.db_set("ird_sync_status", "Failed")
        frappe.log_error(message=str(e), title="IRD Sync Failed")
        raise e

def call_ird_api(idempotency_key, payload):
    """
    Makes the actual POST request to IRD API with idempotency handling.
    """
    # In a real scenario, the URL would be in Site Config
    ird_url = "https://api.ird.gov.np/v1/sync"
    headers = {
        "Content-Type": "application/json",
        "X-Idempotency-Key": idempotency_key
    }
    
    response = requests.post(ird_url, json=payload, headers=headers, timeout=10)
    
    if response.status_code == 200:
        return response.json().get("receipt_no")
    elif response.status_code == 409:
        # Conflict: Document already exists at IRD. Treat as success.
        return response.json().get("receipt_no")
    else:
        raise Exception(f"IRD API Error ({response.status_code}): {response.text}")

def on_invoice_submit(doc, method):
    """
    Hook to set IRD status to Pending upon submission.
    """
    if doc.doctype in ["Sales Invoice", "Credit Note", "Purchase Invoice"]:
        doc.db_set("ird_sync_status", "Pending")

def validate_ird_lock(doc, method):
    """
    Prevents editing or cancellation of documents that are already Pending or Synced with IRD.
    """
    if doc.get("ird_sync_status") in ["Pending", "Synced"]:
        # Allow cancelling only if it's explicitly handled via Credit Note (not implemented here)
        frappe.throw(
            "Document is locked for IRD Sync. Status: {}".format(doc.ird_sync_status),
            title="Compliance Lock"
        )

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

@frappe.whitelist()
def get_vat_annex_13(filters=None):
    """
    API endpoint to fetch Sales Register records with filtering.
    """
    if isinstance(filters, str):
        filters = json.loads(filters)
    
    frappe_filters = {}
    if filters:
        if filters.get("from_date"):
            frappe_filters["posting_date"] = [">=", filters.get("from_date")]
        if filters.get("to_date"):
            # If both from and to date are provided, we need to handle it carefully in Frappe
            # But for simplicity in this mock, we just overwrite or use list
            if "posting_date" in frappe_filters:
                # Use list of lists for multiple conditions on same field
                frappe_filters["posting_date"] = [
                    [">=", filters.get("from_date")],
                    ["<=", filters.get("to_date")]
                ]
            else:
                frappe_filters["posting_date"] = ["<=", filters.get("to_date")]
        
        # Add other filters
        for key, value in filters.items():
            if key not in ["from_date", "to_date"]:
                frappe_filters[key] = value

    return frappe.get_all("VAT Annex 13", filters=frappe_filters, fields=["*"])

@frappe.whitelist()
def get_vat_annex_14(filters=None):
    """
    API endpoint to fetch Purchase Register records with filtering.
    """
    if isinstance(filters, str):
        filters = json.loads(filters)
        
    frappe_filters = {}
    if filters:
        if filters.get("from_date"):
            frappe_filters["posting_date"] = [">=", filters.get("from_date")]
        if filters.get("to_date"):
            if "posting_date" in frappe_filters:
                frappe_filters["posting_date"] = [
                    [">=", filters.get("from_date")],
                    ["<=", filters.get("to_date")]
                ]
            else:
                frappe_filters["posting_date"] = ["<=", filters.get("to_date")]
        
        for key, value in filters.items():
            if key not in ["from_date", "to_date"]:
                frappe_filters[key] = value

    return frappe.get_all("VAT Annex 14", filters=frappe_filters, fields=["*"])

def ensure_ird_fields():
    """
    Ensures that mandatory IRD compliance fields exist on Sales Invoice, 
    Credit Note, and Purchase Invoice.
    """
    doctypes = ["Sales Invoice", "Credit Note", "Purchase Invoice"]
    
    fields = [
        {
            "fieldname": "ird_sync_token",
            "label": "IRD Sync Token",
            "fieldtype": "Data",
            "read_only": 1,
            "insert_after": "grand_total"
        },
        {
            "fieldname": "ird_sync_status",
            "label": "IRD Sync Status",
            "fieldtype": "Select",
            "options": "Pending\nSynced\nFailed",
            "default": "Pending",
            "insert_after": "ird_sync_token"
        },
        {
            "fieldname": "ird_idempotency_key",
            "label": "IRD Idempotency Key",
            "fieldtype": "Data",
            "read_only": 1,
            "insert_after": "ird_sync_status"
        }
    ]
    
    for dt in doctypes:
        for field in fields:
            if not frappe.db.exists("Custom Field", {"dt": dt, "fieldname": field["fieldname"]}):
                custom_field = frappe.get_doc({
                    "doctype": "Custom Field",
                    "dt": dt,
                    **field
                })
                custom_field.insert()

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
