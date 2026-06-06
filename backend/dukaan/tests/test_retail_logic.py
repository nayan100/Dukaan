import pytest
from unittest.mock import MagicMock, patch, call

# Mock frappe
import sys
mock_frappe = MagicMock()
sys.modules["frappe"] = mock_frappe

def setup_function():
    """Reset the mock before each test."""
    mock_frappe.reset_mock()

def test_warehouse_hierarchy_logic():
    """
    Test that the warehouse hierarchy is correctly established.
    """
    from dukaan.retail_logic import setup_warehouse_hierarchy
    
    branch_name = "KTM Main"
    mock_branch = MagicMock()
    mock_branch.name = branch_name
    mock_frappe.get_doc.return_value = mock_branch
    
    with patch("dukaan.retail_logic.create_warehouse") as mock_create_wh:
        setup_warehouse_hierarchy(branch_name)
        
        # Should create a transit and a local warehouse
        expected_calls = [
            call(f"{branch_name} - Local", is_group=0, branch=branch_name),
            call(f"{branch_name} - Transit", is_group=0, branch=branch_name)
        ]
        mock_create_wh.assert_has_calls(expected_calls, any_order=True)

def test_create_warehouse_calls_frappe():
    """
    Test that create_warehouse correctly interacts with frappe.
    """
    from dukaan.retail_logic import create_warehouse
    
    warehouse_name = "New WH"
    mock_frappe.db.exists.return_value = False
    mock_doc = MagicMock()
    mock_frappe.get_doc.return_value = mock_doc
    
    create_warehouse(warehouse_name, is_group=1, branch="Test Branch")
    
    mock_frappe.get_doc.assert_called_with({
        "doctype": "Warehouse",
        "warehouse_name": warehouse_name,
        "is_group": 1,
        "branch": "Test Branch"
    })
    mock_doc.insert.assert_called_once()

def test_create_warehouse_exists():
    """
    Test that create_warehouse returns early if the warehouse exists.
    """
    from dukaan.retail_logic import create_warehouse
    
    mock_frappe.db.exists.return_value = True
    
    create_warehouse("Existing WH")
    
    # get_doc should NOT be called
    mock_frappe.get_doc.assert_not_called()

def test_ird_naming_series():
    """
    Test that the naming series for invoices is IRD compliant.
    """
    from dukaan.retail_logic import get_ird_naming_series
    
    branch_code = "KTM"
    year = "2081" # BS year
    series = get_ird_naming_series(branch_code, year)
    
    # Format: BRANCH-YEAR-.#####
    assert series == "KTM-2081-.#####"
