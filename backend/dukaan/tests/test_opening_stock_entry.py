import pytest
from unittest.mock import MagicMock, patch
import frappe as mock_frappe
from dukaan.doctype.opening_stock_entry.opening_stock_entry import OpeningStockEntry

def test_calculate_totals():
    """Test that total_valuation is correctly calculated."""
    doc = OpeningStockEntry({
        "doctype": "Opening Stock Entry",
        "warehouse": "Main - Local",
        "items": [
            MagicMock(qty=10, rate=150),
            MagicMock(qty=5, rate=200)
        ]
    })
    
    doc.validate()
    
    assert doc.items[0].amount == 1500
    assert doc.items[1].amount == 1000
    assert doc.total_valuation == 2500

def test_moving_average_no_existing_stock():
    """Test moving average when there is no existing stock."""
    doc = OpeningStockEntry({
        "doctype": "Opening Stock Entry",
        "warehouse": "Main - Local",
        "items": [
            MagicMock(item_code="ITEM-001", qty=10, rate=150)
        ]
    })
    
    # Mock db.get_value to return 0 for existing qty and rate
    def mock_get_value(doctype, filters_or_name, fieldname=None):
        return 0
    
    with patch("dukaan.doctype.opening_stock_entry.opening_stock_entry.frappe.db.get_value", side_effect=mock_get_value):
        with patch("dukaan.doctype.opening_stock_entry.opening_stock_entry.frappe.db.set_value") as mock_set_value:
            doc.on_submit()
            
            mock_set_value.assert_called_once_with("Item", "ITEM-001", "valuation_rate", 150.0)

def test_moving_average_with_existing_stock():
    """Test moving average when there is existing stock."""
    doc = OpeningStockEntry({
        "doctype": "Opening Stock Entry",
        "warehouse": "Main - Local",
        "items": [
            MagicMock(item_code="ITEM-001", qty=10, rate=150)
        ]
    })
    
    # Existing qty = 10, existing rate = 100
    # New qty = 10, new rate = 150
    # Total qty = 20
    # Expected rate = ((10 * 100) + (10 * 150)) / 20 = (1000 + 1500) / 20 = 2500 / 20 = 125
    
    def mock_get_value(doctype, filters_or_name, fieldname=None):
        if doctype == "Bin": return 10 # qty
        if doctype == "Item": return 100 # rate
        return 0
    
    with patch("dukaan.doctype.opening_stock_entry.opening_stock_entry.frappe.db.get_value", side_effect=mock_get_value):
        with patch("dukaan.doctype.opening_stock_entry.opening_stock_entry.frappe.db.set_value") as mock_set_value:
            doc.on_submit()
            
            mock_set_value.assert_called_once_with("Item", "ITEM-001", "valuation_rate", 125.0)

def test_flt_function():
    from dukaan.doctype.opening_stock_entry.opening_stock_entry import flt
    assert flt(10.5) == 10.5
    assert flt("10.5") == 10.5
    assert flt(None) == 0.0
    assert flt("abc") == 0.0

