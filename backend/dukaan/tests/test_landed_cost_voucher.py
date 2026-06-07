import pytest
from unittest.mock import MagicMock, patch
import frappe as mock_frappe
from dukaan.doctype.landed_cost_voucher.landed_cost_voucher import LandedCostVoucher

def test_landed_cost_voucher_valuation_adjustment():
    """Test that submitting an LCV adjusts item valuation rates retroactively."""
    
    doc = LandedCostVoucher({
        "doctype": "Landed Cost Voucher",
        "receipt_document": "PR-001",
        "additional_charges": 1000.0,
        "warehouse": "Main - Local"
    })
    
    mock_pr = MagicMock()
    mock_pr.items = [
        MagicMock(item_code="ITEM-A", qty=10, amount=4000),
        MagicMock(item_code="ITEM-B", qty=20, amount=6000)
    ]
    
    def mock_get_doc(doctype, name):
        if doctype == "Purchase Receipt" and name == "PR-001":
            return mock_pr
        return MagicMock()
        
    def mock_get_value(doctype, filters_or_name, fieldname=None):
        if doctype == "Bin": 
            if filters_or_name.get("item_code") == "ITEM-A": return 50
            if filters_or_name.get("item_code") == "ITEM-B": return 100
        if doctype == "Item":
            if filters_or_name == "ITEM-A": return 100.0 
            if filters_or_name == "ITEM-B": return 50.0  
        return 0
        
    with patch("dukaan.doctype.landed_cost_voucher.landed_cost_voucher.frappe.get_doc", side_effect=mock_get_doc):
        with patch("dukaan.doctype.landed_cost_voucher.landed_cost_voucher.frappe.db.get_value", side_effect=mock_get_value):
            with patch("dukaan.doctype.landed_cost_voucher.landed_cost_voucher.frappe.db.set_value") as mock_set_value:
                doc.on_submit()
                
                mock_set_value.assert_any_call("Item", "ITEM-A", "valuation_rate", 108.0)
                mock_set_value.assert_any_call("Item", "ITEM-B", "valuation_rate", 56.0)
