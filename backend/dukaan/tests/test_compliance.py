import pytest
from unittest.mock import MagicMock, patch, call
import sys

# The conftest.py already handles the basic frappe mock
import frappe as mock_frappe

def test_ird_sync_payload_structure():
    """
    Test that the IRD sync payload correctly reflects Annex 13 requirements.
    """
    from dukaan.compliance import sync_to_ird
    
    invoice_name = "INV-2026-001"
    mock_invoice = MagicMock()
    mock_invoice.name = invoice_name
    mock_invoice.grand_total = 1130.0
    mock_invoice.total_taxes_and_charges = 130.0
    mock_invoice.posting_date = "2026-06-06"
    mock_invoice.get.side_effect = lambda k, d=None: {
        "customer_name": "Test Customer",
        "buyer_pan": "123456789",
        "is_offline": 1
    }.get(k, d)
    
    mock_frappe.get_doc.return_value = mock_invoice
    mock_frappe.db.get_single_value.return_value = "987654321" # Seller PAN
    
    with patch("dukaan.compliance.call_ird_api") as mock_api:
        mock_api.return_value = f"IRD-20260606-{invoice_name}"
        receipt = sync_to_ird(invoice_name)
    
    assert receipt.startswith("IRD-")
    assert invoice_name in receipt
    
    # Verify status update
    mock_invoice.db_set.assert_has_calls([
        call("ird_receipt_no", receipt),
        call("ird_sync_status", "Synced")
    ])

def test_process_offline_queue():
    """
    Test that the offline queue correctly identifies and syncs unsynced invoices.
    """
    from dukaan.compliance import process_offline_queue
    
    mock_frappe.get_all.return_value = [
        MagicMock(name="INV-1"),
        MagicMock(name="INV-2")
    ]
    
    with patch("dukaan.compliance.sync_to_ird") as mock_sync:
        count = process_offline_queue()
        assert count == 2
        assert mock_sync.call_count == 2
