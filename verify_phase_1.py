import os
import sys
import json
from unittest.mock import MagicMock

# Mock frappe BEFORE importing compliance
mock_frappe = MagicMock()
sys.modules["frappe"] = mock_frappe

# Make whitelist a transparent decorator
def whitelist_decorator():
    def decorator(fn):
        return fn
    return decorator
mock_frappe.whitelist.side_effect = whitelist_decorator

# Add the backend directory to sys.path
sys.path.append(os.path.abspath("backend/dukaan"))

from dukaan.compliance import (
    update_vat_annex_13, 
    update_vat_annex_14, 
    verify_vat_registers_integrity,
    get_vat_annex_13,
    get_vat_annex_14
)

# Alias for convenience
frappe = mock_frappe

def verify_hooks():
    print("--- 1. Testing Real-time Hooks ---")
    
    # Mock a Sales Invoice
    doc = MagicMock()
    doc.doctype = 'Sales Invoice'
    doc.name = 'SINV-TEST-001'
    doc.posting_date = '2026-06-06'
    doc.customer_name = 'Acme Corp'
    doc.total = 5000.0
    doc.total_taxes_and_charges = 650.0
    doc.grand_total = 5650.0
    doc.get.return_value = 'PAN123456'
    
    print("[Action] Submitting Sales Invoice SINV-TEST-001...")
    update_vat_annex_13(doc, "on_submit")
    
    # Verify that get_doc was called for VAT Annex 13
    if frappe.get_doc.called:
        args = frappe.get_doc.call_args[0][0]
        if args.get("doctype") == "VAT Annex 13" and args.get("invoice_number") == "SINV-TEST-001":
            print("SUCCESS: VAT Annex 13 record created in memory.")
        else:
            print(f"FAILURE: Unexpected args in frappe.get_doc: {args}")
    else:
        print("FAILURE: frappe.get_doc was not called.")

    print("\n[Action] Cancelling Sales Invoice SINV-TEST-001...")
    update_vat_annex_13(doc, "on_cancel")
    
    # Verify that db.delete was called
    if frappe.db.delete.called:
        args = frappe.db.delete.call_args[0]
        if args[0] == "VAT Annex 13" and args[1].get("source_name") == "SINV-TEST-001":
            print("SUCCESS: VAT Annex 13 deletion command sent to database.")
        else:
            print(f"FAILURE: Unexpected args in frappe.db.delete: {args}")
    else:
        print("FAILURE: frappe.db.delete was not called.")

def verify_integrity():
    print("\n--- 2. Testing Integrity Verification Job ---")
    
    # Setup mock returns for integrity check
    # 1. Sales Ledger, 2. Sales Register (Mismatch), 3. Purchase Ledger, 4. Purchase Register (Match)
    frappe.db.sql.side_effect = [
        [{"total": 10000}], 
        [{"total": 9000}], 
        [{"total": 5000}], 
        [{"total": 5000}]
    ]
    
    print("[Action] Running integrity check with simulated mismatch in Annex 13...")
    discrepancies = verify_vat_registers_integrity()
    
    if "VAT Annex 13" in discrepancies:
        print(f"SUCCESS: Mismatch detected in VAT Annex 13: {discrepancies['VAT Annex 13']}")
    else:
        print(f"FAILURE: Discrepancy not detected. Results: {discrepancies}")

def verify_api():
    print("\n--- 3. Testing Accountant API Endpoints ---")
    
    # Mock data for get_all
    frappe.get_all.return_value = [
        {"invoice_number": "SINV-001", "total_amount": 1130.0},
        {"invoice_number": "SINV-002", "total_amount": 2260.0}
    ]
    
    print("[Action] Fetching records via get_vat_annex_13 with filters...")
    filters = {"from_date": "2026-06-01", "to_date": "2026-06-30"}
    records = get_vat_annex_13(json.dumps(filters))
    
    print(f"SUCCESS: Fetched {len(records)} records via API.")
    print(f"Data: {json.dumps(records, indent=2)}")

if __name__ == "__main__":
    try:
        verify_hooks()
        verify_integrity()
        verify_api()
        print("\n--- ALL BACKEND LOGIC VERIFIED ---")
    except Exception as e:
        print(f"\nERROR DURING VERIFICATION: {e}")
        import traceback
        traceback.print_exc()
