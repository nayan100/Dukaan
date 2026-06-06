import pytest
from unittest.mock import MagicMock, patch
import frappe as mock_frappe
from conftest import FrappeException

def test_supplier_tax_id_validation_valid():
    """
    Test that a valid 9-digit Tax ID passes validation.
    """
    from dukaan.doctype.supplier.supplier import Supplier
    
    doc = Supplier({
        "doctype": "Supplier",
        "supplier_name": "Test Supplier",
        "tax_id": "987654321"
    })
    
    doc.validate()
    # Should not raise exception

def test_supplier_tax_id_validation_invalid_length():
    """
    Test that a Tax ID with incorrect length fails validation.
    """
    from dukaan.doctype.supplier.supplier import Supplier
    
    doc = Supplier({
        "doctype": "Supplier",
        "supplier_name": "Test Supplier",
        "tax_id": "12345678" # 8 digits
    })
    
    with pytest.raises(FrappeException) as excinfo:
        doc.validate()
    assert "Tax ID (PAN/VAT) must be exactly 9 digits." in str(excinfo.value)

def test_supplier_tax_id_validation_non_numeric():
    """
    Test that a non-numeric Tax ID fails validation.
    """
    from dukaan.doctype.supplier.supplier import Supplier
    
    doc = Supplier({
        "doctype": "Supplier",
        "supplier_name": "Test Supplier",
        "tax_id": "12345678A"
    })
    
    with pytest.raises(FrappeException) as excinfo:
        doc.validate()
    assert "Tax ID (PAN/VAT) must be numeric." in str(excinfo.value)

def test_supplier_tax_id_mandatory():
    """
    Test that Tax ID is mandatory.
    """
    from dukaan.doctype.supplier.supplier import Supplier
    
    doc = Supplier({
        "doctype": "Supplier",
        "supplier_name": "Test Supplier",
        "tax_id": ""
    })
    
    with pytest.raises(FrappeException) as excinfo:
        doc.validate()
    assert "Tax ID (PAN/VAT) is mandatory for Annex 14 compliance." in str(excinfo.value)
