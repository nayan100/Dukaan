import pytest
from unittest.mock import MagicMock, patch, call
import sys

# The conftest.py already handles the shared frappe mock
import frappe as mock_frappe

def test_inter_branch_transfer_dispatch_logic():
    """
    Test that dispatching a transfer moves stock from Local to Transit.
    """
    from dukaan.retail_logic import process_transfer_dispatch
    
    mock_transfer = MagicMock()
    mock_transfer.name = "IBT-001"
    mock_transfer.from_branch = "Branch A"
    mock_transfer.to_branch = "Branch B"
    mock_transfer.status = "Requested"
    mock_transfer.items = [
        {"item_code": "Item 1", "qty": 10}
    ]
    
    mock_frappe.get_doc.return_value = mock_transfer
    
    with patch("dukaan.retail_logic.create_stock_entry") as mock_create_se:
        process_transfer_dispatch("IBT-001")
        
        # Verify status update
        mock_transfer.db_set.assert_called_with("status", "Dispatched")
        
        # Verify stock entry creation (Local -> Transit)
        mock_create_se.assert_called_once_with(
            from_warehouse="Branch A - Local",
            to_warehouse="Branch A - Transit",
            items=mock_transfer.items,
            purpose="Material Transfer"
        )

def test_inter_branch_transfer_receive_logic():
    """
    Test that receiving a transfer moves stock from Transit to Local.
    """
    from dukaan.retail_logic import process_transfer_receipt
    
    mock_transfer = MagicMock()
    mock_transfer.name = "IBT-001"
    mock_transfer.from_branch = "Branch A"
    mock_transfer.to_branch = "Branch B"
    mock_transfer.status = "Approved"
    mock_transfer.items = [
        {"item_code": "Item 1", "qty": 10}
    ]
    
    mock_frappe.get_doc.return_value = mock_transfer
    
    with patch("dukaan.retail_logic.create_stock_entry") as mock_create_se:
        process_transfer_receipt("IBT-001")
        
        # Verify status update
        mock_transfer.db_set.assert_called_with("status", "Received")
        
        # Verify stock entry creation (Transit -> Local)
        mock_create_se.assert_called_once_with(
            from_warehouse="Branch A - Transit",
            to_warehouse="Branch B - Local",
            items=mock_transfer.items,
            purpose="Material Transfer"
        )

def test_create_stock_entry_calls_frappe():
    """
    Test that create_stock_entry helper correctly calls frappe.
    """
    from dukaan.retail_logic import create_stock_entry
    
    mock_se = MagicMock()
    mock_frappe.get_doc.return_value = mock_se
    
    items = [{"item_code": "Item 1", "qty": 5}]
    create_stock_entry("WH 1", "WH 2", items)
    
    mock_frappe.get_doc.assert_called_with({
        "doctype": "Stock Entry",
        "purpose": "Material Transfer",
        "from_warehouse": "WH 1",
        "to_warehouse": "WH 2",
        "items": items
    })
    mock_se.insert.assert_called_once()
    mock_se.submit.assert_called_once()
