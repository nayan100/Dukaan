import pytest
from unittest.mock import MagicMock, patch
import frappe as mock_frappe

def test_update_vat_annex_13_on_submit():
    """
    Test that update_vat_annex_13 creates a new record in VAT Annex 13 when an invoice is submitted.
    """
    from dukaan.compliance import update_vat_annex_13
    
    mock_invoice = MagicMock()
    mock_invoice.doctype = "Sales Invoice"
    mock_invoice.name = "SINV-001"
    mock_invoice.posting_date = "2026-06-06"
    mock_invoice.customer_name = "Test Customer"
    mock_invoice.get.return_value = "123456789" # For doc.get("customer_pan")
    mock_invoice.total = 1000
    mock_invoice.total_taxes_and_charges = 130
    mock_invoice.grand_total = 1130
    
    mock_annex_doc = MagicMock()
    mock_frappe.get_doc.return_value = mock_annex_doc
    
    update_vat_annex_13(mock_invoice, "on_submit")
    
    # Verify get_doc called with correct params for VAT Annex 13
    mock_frappe.get_doc.assert_called_with({
        "doctype": "VAT Annex 13",
        "posting_date": "2026-06-06",
        "invoice_number": "SINV-001",
        "customer_name": "Test Customer",
        "customer_pan": "123456789",
        "taxable_amount": 1000,
        "vat_amount": 130,
        "total_amount": 1130,
        "source_doctype": "Sales Invoice",
        "source_name": "SINV-001"
    })
    
    # Verify insert called
    mock_annex_doc.insert.assert_called_once()

def test_update_vat_annex_13_on_cancel():
    """
    Test that update_vat_annex_13 removes the record from VAT Annex 13 when an invoice is cancelled.
    """
    from dukaan.compliance import update_vat_annex_13
    
    mock_invoice = MagicMock()
    mock_invoice.doctype = "Sales Invoice"
    mock_invoice.name = "SINV-001"
    
    update_vat_annex_13(mock_invoice, "on_cancel")
    
    # Verify record is deleted
    mock_frappe.db.delete.assert_called_with("VAT Annex 13", {
        "source_doctype": "Sales Invoice",
        "source_name": "SINV-001"
    })

def test_update_vat_annex_14_on_submit():
    """
    Test that update_vat_annex_14 creates a new record in VAT Annex 14 when a purchase invoice is submitted.
    """
    from dukaan.compliance import update_vat_annex_14
    
    mock_invoice = MagicMock()
    mock_invoice.doctype = "Purchase Invoice"
    mock_invoice.name = "PINV-001"
    mock_invoice.posting_date = "2026-06-06"
    mock_invoice.supplier_name = "Test Supplier"
    mock_invoice.get.return_value = "987654321" # For doc.get("supplier_pan")
    mock_invoice.total = 2000
    mock_invoice.total_taxes_and_charges = 260
    mock_invoice.grand_total = 2260
    
    mock_annex_doc = MagicMock()
    mock_frappe.get_doc.return_value = mock_annex_doc
    
    update_vat_annex_14(mock_invoice, "on_submit")
    
    # Verify get_doc called with correct params for VAT Annex 14
    mock_frappe.get_doc.assert_called_with({
        "doctype": "VAT Annex 14",
        "posting_date": "2026-06-06",
        "invoice_number": "PINV-001",
        "supplier_name": "Test Supplier",
        "supplier_pan": "987654321",
        "taxable_amount": 2000,
        "vat_amount": 260,
        "total_amount": 2260,
        "source_doctype": "Purchase Invoice",
        "source_name": "PINV-001"
    })
    
    # Verify insert called
    mock_annex_doc.insert.assert_called_once()

def test_update_vat_annex_14_on_cancel():
    """
    Test that update_vat_annex_14 removes the record from VAT Annex 14 when a purchase invoice is cancelled.
    """
    from dukaan.compliance import update_vat_annex_14
    
    mock_invoice = MagicMock()
    mock_invoice.doctype = "Purchase Invoice"
    mock_invoice.name = "PINV-001"
    
    update_vat_annex_14(mock_invoice, "on_cancel")
    
    # Verify record is deleted
    mock_frappe.db.delete.assert_called_with("VAT Annex 14", {
        "source_doctype": "Purchase Invoice",
        "source_name": "PINV-001"
    })

def test_verify_vat_registers_integrity_mismatch():
    """
    Test that verify_vat_registers_integrity detects discrepancies between ledger and registers.
    """
    from dukaan.compliance import verify_vat_registers_integrity
    
    # Mock totals from Sales Invoice ledger
    mock_frappe.db.sql.side_effect = [
        [{"total": 5000}], # Sales Invoice total
        [{"total": 4500}], # VAT Annex 13 total (Mismatch!)
        [{"total": 3000}], # Purchase Invoice total
        [{"total": 3000}]  # VAT Annex 14 total (Match)
    ]
    
    discrepancies = verify_vat_registers_integrity()
    
    assert "VAT Annex 13" in discrepancies
    assert discrepancies["VAT Annex 13"]["ledger_total"] == 5000
    assert discrepancies["VAT Annex 13"]["register_total"] == 4500
    assert "VAT Annex 14" not in discrepancies

def test_get_vat_annex_13_api():
    """
    Test the API endpoint for fetching Annex 13 records.
    """
    from dukaan.compliance import get_vat_annex_13
    
    mock_frappe.get_all.return_value = [{"invoice_number": "SINV-001"}]
    
    filters = {"from_date": "2026-06-01", "to_date": "2026-06-30"}
    result = get_vat_annex_13(filters)
    
    mock_frappe.get_all.assert_called_with(
        "VAT Annex 13",
        filters={
            "posting_date": [
                [">=", "2026-06-01"],
                ["<=", "2026-06-30"]
            ]
        },
        fields=["*"]
    )
    assert result == [{"invoice_number": "SINV-001"}]

def test_get_vat_annex_14_api():
    """
    Test the API endpoint for fetching Annex 14 records.
    """
    from dukaan.compliance import get_vat_annex_14
    
    mock_frappe.get_all.return_value = [{"invoice_number": "PINV-001"}]
    
    filters = {"supplier_name": "Test Supplier"}
    result = get_vat_annex_14(filters)
    
    mock_frappe.get_all.assert_called_with(
        "VAT Annex 14",
        filters={"supplier_name": "Test Supplier"},
        fields=["*"]
    )
    assert result == [{"invoice_number": "PINV-001"}]
