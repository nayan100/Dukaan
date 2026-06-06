import pytest
from unittest.mock import MagicMock, patch
import sys

# The conftest.py handles the shared frappe mock
import frappe as mock_frappe

def test_pos_entry_validation_authorized():
    """
    Test that a POS entry is allowed if it belongs to the user's branch.
    """
    from dukaan.retail_logic import validate_pos_entry
    
    mock_doc = MagicMock()
    mock_doc.branch = "Branch A"
    
    # Mock user session info
    mock_frappe.session.user = "cashier1"
    mock_user = MagicMock()
    mock_user.branch = "Branch A"
    mock_frappe.get_doc.return_value = mock_user
    
    # Should not raise exception
    validate_pos_entry(mock_doc)

def test_pos_entry_validation_unauthorized():
    """
    Test that a POS entry is blocked if it belongs to a different branch.
    """
    from dukaan.retail_logic import validate_pos_entry
    
    mock_doc = MagicMock()
    mock_doc.branch = "Branch B" # Attempting to write to Branch B
    
    # Mock user session info
    mock_frappe.session.user = "cashier1"
    mock_user = MagicMock()
    mock_user.branch = "Branch A" # But belongs to Branch A
    mock_frappe.get_doc.return_value = mock_user
    
    # Should raise Frappe ValidationError
    # We mock frappe.throw
    mock_frappe.throw = MagicMock(side_effect=Exception("Unauthorized Branch"))
    
    with pytest.raises(Exception, match="Unauthorized Branch"):
        validate_pos_entry(mock_doc)
