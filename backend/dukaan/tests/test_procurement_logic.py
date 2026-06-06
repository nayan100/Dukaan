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

def test_validate_po_split_order_warning():
    """
    Test that PO validation throws a warning (not a hard error) if split order detected.
    Actually, spec says: "escalation to Chain Owner for overrides".
    For now, let's just test it calls frappe.msgprint or similar if we want a soft warning,
    or frappe.throw if we want to block it.
    Spec says: "Soft Budget Enforcement: Warnings on PO creation".
    """
    from dukaan.retail_logic import validate_po_split_order
    
    mock_po = MagicMock()
    mock_po.supplier = "Test Supplier"
    
    with patch("dukaan.retail_logic.detect_split_order", return_value=True):
        with patch("frappe.msgprint") as mock_msgprint:
            validate_po_split_order(mock_po)
            mock_msgprint.assert_called()
            # Check if it was called with msg keyword or as first positional
            args, kwargs = mock_msgprint.call_args
            msg = kwargs.get("msg") or args[0]
            assert "Suspicious Split-Order Pattern Detected" in msg
