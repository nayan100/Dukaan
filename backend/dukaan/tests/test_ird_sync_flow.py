import pytest
from unittest.mock import MagicMock, patch, ANY
import frappe as mock_frappe

def test_ird_sync_status_flow():
    """
    Test the two-stage status flow for IRD synchronization.
    """
    from dukaan.compliance import on_invoice_submit, sync_to_ird
    
    # 1. Test on_invoice_submit sets status to Pending
    mock_invoice = MagicMock()
    mock_invoice.doctype = "Sales Invoice"
    mock_invoice.name = "SINV-001"
    mock_invoice.posting_date = "2026-06-06"
    mock_invoice.customer_name = "Test"
    mock_invoice.total = 1000.0
    mock_invoice.total_taxes_and_charges = 130.0
    mock_invoice.grand_total = 1130.0
    mock_invoice.ird_sync_status = "Draft"
    mock_invoice.get.return_value = "PAN-123"
    
    on_invoice_submit(mock_invoice, "on_submit")
    
    # Verify status update to Pending
    mock_invoice.db_set.assert_any_call("ird_sync_status", "Pending")
    
    # 2. Test sync_to_ird updates status to Synced
    mock_frappe.get_doc.return_value = mock_invoice
    mock_frappe.db.get_single_value.return_value = "PAN-123"
    
    with patch("dukaan.compliance.call_ird_api") as mock_api:
        mock_api.return_value = "IRD-SUCCESS-001"
        sync_to_ird("SINV-001")
    
    # Verify status update to Synced
    mock_invoice.db_set.assert_any_call("ird_sync_status", "Synced")
    # Verify receipt number is set
    mock_invoice.db_set.assert_any_call("ird_receipt_no", ANY)

def test_prevent_edit_if_pending_or_synced():
    """
    Test that invoices cannot be modified if they are Pending or Synced.
    """
    from dukaan.compliance import validate_ird_lock
    
    mock_invoice = MagicMock()
    mock_invoice.ird_sync_status = "Pending"
    mock_invoice.get.side_effect = lambda k: "Pending" if k == "ird_sync_status" else None
    
    mock_frappe.throw.side_effect = Exception("Document is locked for IRD Sync")
    
    with pytest.raises(Exception, match="Document is locked for IRD Sync"):
        validate_ird_lock(mock_invoice, "on_update")
    
    mock_invoice.get.side_effect = lambda k: "Synced" if k == "ird_sync_status" else None
    with pytest.raises(Exception, match="Document is locked for IRD Sync"):
        validate_ird_lock(mock_invoice, "on_update")
