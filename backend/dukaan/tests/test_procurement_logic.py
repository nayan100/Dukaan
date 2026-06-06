import pytest
from unittest.mock import MagicMock, patch, call
from datetime import datetime, timedelta
import frappe as mock_frappe
from conftest import FrappeException

def test_detect_split_order_suspicious():
    """
    Test that multiple POs to the same supplier within 24h are flagged as suspicious.
    """
    from dukaan.retail_logic import detect_split_order
    
    mock_po = MagicMock()
    mock_po.supplier = "Test Supplier"
    mock_po.transaction_date = datetime.now()
    mock_po.grand_total = 40000
    mock_po.branch = "Main Branch"
    
    # Mock existing POs in the last 24h
    mock_frappe.get_all.return_value = [
        {"name": "PO-001", "grand_total": 45000},
        {"name": "PO-002", "grand_total": 30000}
    ]
    
    # We expect it to return True (is suspicious)
    is_suspicious = detect_split_order(mock_po)
    
    assert is_suspicious is True
    
    # Verify get_all called with correct filters
    # Last 24 hours
    args, kwargs = mock_frappe.get_all.call_args
    assert args[0] == "Purchase Order"
    assert kwargs["filters"]["supplier"] == "Test Supplier"
    assert kwargs["filters"]["docstatus"] == 1
    # transaction_date filter should be >= now - 24h

def test_detect_split_order_clean():
    """
    Test that a single PO or widely spaced POs are not flagged.
    """
    from dukaan.retail_logic import detect_split_order
    
    mock_po = MagicMock()
    mock_po.supplier = "Test Supplier"
    mock_po.transaction_date = datetime.now()
    mock_po.grand_total = 40000
    mock_po.branch = "Main Branch"
    
    # No other POs in the last 24h
    mock_frappe.get_all.return_value = []
    
    is_suspicious = detect_split_order(mock_po)
    
    assert is_suspicious is False

def test_purchase_order_validation_triggers_budget_check():
    """
    Test that PurchaseOrder.validate() triggers the budget and split-order checks.
    """
    from dukaan.doctype.purchase_order.purchase_order import PurchaseOrder
    
    doc = PurchaseOrder({
        "doctype": "Purchase Order",
        "supplier": "Test Supplier",
        "branch": "Main Branch",
        "grand_total": 50000
    })
    
    with patch("dukaan.doctype.purchase_order.purchase_order.validate_po_budget") as mock_budget:
        with patch("dukaan.doctype.purchase_order.purchase_order.validate_po_split_order") as mock_split:
            doc.validate()
            mock_budget.assert_called_once_with(doc)
            mock_split.assert_called_once_with(doc)

def test_validate_po_budget_exceeded():
    """
    Test that validate_po_budget throws FrappeException if budget exceeded.
    """
    from dukaan.retail_logic import validate_po_budget
    
    mock_po = MagicMock()
    mock_po.branch = "Main Branch"
    mock_po.grand_total = 200000
    
    # Mock budget limit
    mock_frappe.db.get_value.return_value = 100000 # Limit
    
    # Mock current spent
    with patch("dukaan.retail_logic.get_monthly_spent", return_value=50000):
        with pytest.raises(FrappeException) as excinfo:
            validate_po_budget(mock_po)
        assert "Budget Exceeded" in str(excinfo.value)

def test_validate_po_budget_ok():
    """
    Test that validate_po_budget passes if within budget.
    """
    from dukaan.retail_logic import validate_po_budget
    
    mock_po = MagicMock()
    mock_po.branch = "Main Branch"
    mock_po.grand_total = 30000
    
    mock_frappe.db.get_value.return_value = 100000 # Limit
    
    with patch("dukaan.retail_logic.get_monthly_spent", return_value=50000):
        validate_po_budget(mock_po)
        # Should not raise
