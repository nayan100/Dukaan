import pytest
from unittest.mock import MagicMock, patch
import frappe as mock_frappe
from conftest import FrappeException
from dukaan.doctype.opening_stock_entry.opening_stock_entry import OpeningStockEntry

def setup_user(role):
    mock_user = MagicMock()
    mock_frappe.get_doc.return_value = mock_user
    mock_user.has_role.side_effect = lambda r: r == role
    return mock_user

def test_submit_low_value():
    doc = OpeningStockEntry({
        "doctype": "Opening Stock Entry",
        "warehouse": "Main - Local",
        "items": [MagicMock(qty=10, rate=1000)] # total 10000 < 50000
    })
    doc.validate()
    
    with patch("dukaan.doctype.opening_stock_entry.opening_stock_entry.frappe.db.get_value", return_value=0):
        with patch("dukaan.doctype.opening_stock_entry.opening_stock_entry.frappe.db.set_value"):
            doc.on_submit()
    
    assert doc.status == "Submitted"

def test_submit_high_value_requires_spot_check():
    doc = OpeningStockEntry({
        "doctype": "Opening Stock Entry",
        "warehouse": "Main - Local",
        "items": [MagicMock(qty=100, rate=1000)] # total 100000 > 50000
    })
    doc.validate()
    
    doc.on_submit()
    
    assert doc.status == "Pending Spot-Check"

def test_verify_spot_check_success():
    setup_user("Accountant")
    doc = OpeningStockEntry({
        "doctype": "Opening Stock Entry",
        "status": "Pending Spot-Check",
        "warehouse": "Main - Local",
        "items": [MagicMock(qty=100, rate=1000)]
    })
    doc.validate()
    
    with patch("dukaan.doctype.opening_stock_entry.opening_stock_entry.frappe.db.get_value", return_value=0):
        with patch("dukaan.doctype.opening_stock_entry.opening_stock_entry.frappe.db.set_value"):
            doc.verify_spot_check()
            
    assert doc.status == "Submitted"

def test_verify_spot_check_permission_denied():
    setup_user("Branch Owner")
    doc = OpeningStockEntry({
        "doctype": "Opening Stock Entry",
        "status": "Pending Spot-Check",
        "warehouse": "Main - Local",
        "items": [MagicMock(qty=100, rate=1000)]
    })
    doc.validate()
    
    with pytest.raises(FrappeException) as excinfo:
        doc.verify_spot_check()
    assert "not permitted to verify" in str(excinfo.value).lower()
