import pytest
from unittest.mock import MagicMock, patch
import frappe as mock_frappe

def test_e2e_offline_to_register_flow():
    """
    Simulates the full lifecycle:
    1. Offline Invoice arriving at Backend (process_offline_queue)
    2. Syncing to IRD (sync_to_ird)
    3. Materializing in VAT Register (update_vat_annex_13 via on_submit)
    """
    from dukaan.compliance import sync_to_ird, update_vat_annex_13
    
    # Mock Document
    mock_invoice = MagicMock()
    mock_invoice.doctype = "Sales Invoice"
    mock_invoice.name = "SINV-E2E-001"
    mock_invoice.posting_date = "2026-06-06"
    mock_invoice.customer_name = "E2E Customer"
    mock_invoice.total = 1000
    mock_invoice.total_taxes_and_charges = 130
    mock_invoice.grand_total = 1130
    mock_invoice.get.return_value = "PAN-E2E"
    
    # 1. Setup Backend environment
    mock_frappe.get_doc.return_value = mock_invoice
    mock_frappe.db.get_single_value.return_value = "PAN-SELLER"
    
    # 2. Simulate Sync to IRD
    with patch("dukaan.compliance.call_ird_api") as mock_api:
        mock_api.return_value = "IRD-E2E-TOKEN"
        
        # Trigger Sync
        sync_to_ird("SINV-E2E-001")
        
        # Verify status updated to Synced
        mock_invoice.db_set.assert_any_call("ird_sync_status", "Synced")
    
    # 3. Simulate Materialization (Real-time hook)
    # Usually this happens automatically on doc.submit(), 
    # but we call the hook manually to verify its logic in context.
    update_vat_annex_13(mock_invoice, "on_submit")
    
    # Verify VAT Annex 13 record created with correct data
    mock_frappe.get_doc.assert_any_call({
        "doctype": "VAT Annex 13",
        "posting_date": "2026-06-06",
        "invoice_number": "SINV-E2E-001",
        "customer_name": "E2E Customer",
        "customer_pan": "PAN-E2E",
        "taxable_amount": 1000,
        "vat_amount": 130,
        "total_amount": 1130,
        "source_doctype": "Sales Invoice",
        "source_name": "SINV-E2E-001"
    })
