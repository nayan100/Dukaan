import pytest
from unittest.mock import MagicMock, patch, call
import sys
from datetime import datetime, time

# The conftest.py already handles the shared frappe mock
import frappe as mock_frappe

def test_is_within_business_hours():
    """
    Test that business hours (9 AM to 6 PM) are correctly identified.
    """
    from dukaan.retail_logic import is_within_business_hours
    
    # 10 AM (Within)
    assert is_within_business_hours(datetime(2026, 6, 6, 10, 0, 0)) == True
    
    # 8 PM (Outside)
    assert is_within_business_hours(datetime(2026, 6, 6, 20, 0, 0)) == False
    
    # Sunday (Assuming 6 days working)
    # Sat is 6, Sun is 0 in weekday()
    assert is_within_business_hours(datetime(2026, 6, 7, 10, 0, 0)) == False

def test_auto_rejection_timer_paused_outside_hours():
    """
    Test that the rejection logic does not trigger outside business hours.
    """
    from dukaan.retail_logic import check_and_reject_stale_transfers
    
    # Mocking current time to 8 PM
    with patch("dukaan.retail_logic.get_current_time") as mock_now:
        mock_now.return_value = datetime(2026, 6, 6, 20, 0, 0)
        
        with patch("dukaan.retail_logic.reject_transfer") as mock_reject:
            check_and_reject_stale_transfers()
            mock_reject.assert_not_called()

def test_auto_rejection_trigger_and_reversal():
    """
    Test that a stale transfer is rejected and stock is reversed.
    """
    from dukaan.retail_logic import check_and_reject_stale_transfers
    
    # Mocking current time to 4 PM
    with patch("dukaan.retail_logic.get_current_time") as mock_now:
        mock_now.return_value = datetime(2026, 6, 6, 16, 0, 0)
        
        # Mock a stale transfer (created 6 hours ago)
        mock_transfer = MagicMock()
        mock_transfer.name = "IBT-STALE"
        mock_transfer.creation = datetime(2026, 6, 6, 10, 0, 0)
        mock_transfer.status = "Dispatched"
        mock_transfer.from_branch = "Branch A"
        mock_transfer.items = [{"item_code": "Item 1", "qty": 5}]
        
        mock_frappe.get_all.return_value = [{"name": "IBT-STALE"}]
        mock_frappe.get_doc.return_value = mock_transfer
        
        with patch("dukaan.retail_logic.create_stock_entry") as mock_create_se:
            check_and_reject_stale_transfers()
            
            # Verify rejection
            mock_transfer.db_set.assert_called_with("status", "Rejected")
            
            # Verify stock reversal (Transit -> Local)
            mock_create_se.assert_called_once_with(
                from_warehouse="Branch A - Transit",
                to_warehouse="Branch A - Local",
                items=mock_transfer.items,
                purpose="Material Transfer"
            )
