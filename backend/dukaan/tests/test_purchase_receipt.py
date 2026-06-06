import pytest
from unittest.mock import MagicMock, patch
import frappe as mock_frappe
from dukaan.doctype.purchase_receipt.purchase_receipt import PurchaseReceipt

def test_purchase_receipt_on_submit_updates_annex_14():
    """Test that submitting a Purchase Receipt creates a VAT Annex 14 entry."""
    doc = PurchaseReceipt({
        "doctype": "Purchase Receipt",
        "name": "PR-001",
        "posting_date": "2026-06-07",
        "supplier_name": "Test Supplier",
        "supplier_invoice_no": "INV-12345",
        "total": 5000,
        "total_taxes_and_charges": 650,
        "grand_total": 5650
    })
    
    # Mock doc.get behavior for supplier_pan and supplier_invoice_no
    original_get = doc.get
    def mock_get(key, default=None):
        if key == "supplier_pan":
            return "987654321"
        return original_get(key, default)
    doc.get = mock_get
    
    with patch("dukaan.compliance.frappe.get_doc") as mock_get_doc:
        mock_annex_doc = MagicMock()
        mock_get_doc.return_value = mock_annex_doc
        
        doc.on_submit()
        
        # Verify get_doc was called correctly
        mock_get_doc.assert_called_once()
        call_args = mock_get_doc.call_args[0][0]
        
        assert call_args["doctype"] == "VAT Annex 14"
        assert call_args["invoice_number"] == "INV-12345"
        assert call_args["supplier_name"] == "Test Supplier"
        assert call_args["supplier_pan"] == "987654321"
        assert call_args["taxable_amount"] == 5000
        assert call_args["vat_amount"] == 650
        assert call_args["total_amount"] == 5650
        assert call_args["source_doctype"] == "Purchase Receipt"
        assert call_args["source_name"] == "PR-001"
        
        # Verify insert was called on the new document
        mock_annex_doc.insert.assert_called_once()

def test_purchase_receipt_on_cancel_removes_annex_14():
    """Test that cancelling a Purchase Receipt removes the VAT Annex 14 entry."""
    doc = PurchaseReceipt({
        "doctype": "Purchase Receipt",
        "name": "PR-001"
    })
    
    with patch("dukaan.compliance.frappe.db.delete") as mock_delete:
        doc.on_cancel()
        
        mock_delete.assert_called_once_with("VAT Annex 14", {
            "source_doctype": "Purchase Receipt",
            "source_name": "PR-001"
        })
