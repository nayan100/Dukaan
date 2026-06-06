import pytest
from unittest.mock import MagicMock, patch
import sys
from datetime import datetime

# The conftest.py already handles the shared frappe mock
import frappe as mock_frappe

def test_budget_guard_authorized():
    """
    Test that a PO is allowed if within the monthly budget.
    """
    from dukaan.retail_logic import validate_po_budget
    
    mock_po = MagicMock()
    mock_po.branch = "Branch A"
    mock_po.grand_total = 5000
    
    # Mock budget settings
    mock_frappe.db.get_value.return_value = 10000 # Budget limit
    # Mock current spent
    with patch("dukaan.retail_logic.get_monthly_spent") as mock_spent:
        mock_spent.return_value = 2000
        
        # Should not raise exception
        validate_po_budget(mock_po)

def test_budget_guard_exceeded():
    """
    Test that a PO is blocked if it exceeds the monthly budget.
    """
    from dukaan.retail_logic import validate_po_budget
    
    mock_po = MagicMock()
    mock_po.branch = "Branch A"
    mock_po.grand_total = 8000
    
    # Mock budget settings
    mock_frappe.db.get_value.return_value = 10000 # Budget limit
    
    # Mock current spent
    with patch("dukaan.retail_logic.get_monthly_spent") as mock_spent:
        mock_spent.return_value = 5000
        
        # 5000 spent + 8000 new PO = 13000 (Exceeds 10000)
        mock_frappe.throw = MagicMock(side_effect=Exception("Budget Exceeded"))
        
        with pytest.raises(Exception, match="Budget Exceeded"):
            validate_po_budget(mock_po)

def test_inter_branch_adjustment_generation():
    """
    Test that a return in Branch B for an item bought in Branch A 
    generates correct financial adjustments.
    """
    from dukaan.retail_logic import process_cross_branch_return
    
    # Item bought in Branch A
    # Return processed in Branch B
    return_details = {
        "original_branch": "Branch A",
        "return_branch": "Branch B",
        "amount": 1200.0,
        "item_code": "Item 1"
    }
    
    with patch("dukaan.retail_logic.create_journal_entry") as mock_je:
        process_cross_branch_return(return_details)
        
        # Should generate Inter-Branch Adjustment
        # Debit Branch A (they lose the revenue)
        # Credit Branch B (they issued the refund)
        mock_je.assert_called_once_with(
            debit_account="Branch A - Sales Return",
            credit_account="Branch B - Cash",
            amount=1200.0,
            remarks="Cross-Branch Return: Item 1 from Branch A"
        )
