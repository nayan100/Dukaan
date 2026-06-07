import pytest
import frappe
from dukaan.quota_management import create_sub_account
from unittest.mock import MagicMock, patch

@pytest.fixture
def mock_creator():
    creator = MagicMock()
    creator.name = "owner@tenant.com"
    creator.tenant_id = "TenantA"
    creator.branch = "Branch A"
    creator.allocated_pos_quota = 2
    return creator

def test_branch_quota_enforcement(mock_creator):
    """
    Scenario: Chain Owner tries to create a branch when quota is reached.
    """
    mock_creator.role = "Chain Owner"
    
    with patch("frappe.session.user", "owner@tenant.com"), \
         patch("frappe.get_doc", return_value=mock_creator), \
         patch("frappe.db.get_value", return_value=1), \
         patch("frappe.db.count", return_value=1): # Current branches = 1, Max = 1
        
        with pytest.raises(frappe.ValidationError) as exc:
            create_sub_account("branch2@tenant.com", "Branch 2 Owner", "Branch Owner")
        
        assert "Quota Exceeded" in str(exc.value)
        assert "maximum allowed branches (1)" in str(exc.value)

def test_pos_quota_enforcement_single_owner(mock_creator):
    """
    Scenario: Single Owner tries to create a POS account when tenant quota is reached.
    """
    mock_creator.role = "Single Owner"
    
    with patch("frappe.session.user", "owner@tenant.com"), \
         patch("frappe.get_doc", return_value=mock_creator), \
         patch("frappe.db.get_value", return_value=3), \
         patch("frappe.db.count", return_value=3): # Current POS = 3, Max = 3
        
        with pytest.raises(frappe.ValidationError) as exc:
            create_sub_account("pos4@tenant.com", "POS 4", "POS")
            
        assert "Quota Exceeded" in str(exc.value)
        assert "maximum allowed POS accounts (3)" in str(exc.value)

def test_pos_quota_enforcement_branch_owner(mock_creator):
    """
    Scenario: Branch Owner tries to create a POS account when their allocated quota is reached.
    """
    mock_creator.role = "Branch Owner"
    mock_creator.allocated_pos_quota = 2
    
    with patch("frappe.session.user", "branch1@tenant.com"), \
         patch("frappe.get_doc", return_value=mock_creator), \
         patch("frappe.db.count", return_value=2): # Current POS for this branch = 2
        
        with pytest.raises(frappe.ValidationError) as exc:
            create_sub_account("pos3@tenant.com", "POS 3", "POS")
            
        assert "Quota Exceeded" in str(exc.value)
        assert "allocated POS quota (2)" in str(exc.value)

def test_role_hierarchy_violation(mock_creator):
    """
    Scenario: Branch Owner tries to create a Chain Owner (Hierarchy Violation).
    """
    mock_creator.role = "Branch Owner"
    
    with patch("frappe.session.user", "branch1@tenant.com"), \
         patch("frappe.get_doc", return_value=mock_creator):
        
        with pytest.raises(frappe.ValidationError) as exc:
            create_sub_account("illegal@tenant.com", "Illegal User", "Chain Owner")
            
        assert "Unauthorized" in str(exc.value)
        assert "cannot create a user with the role 'Chain Owner'" in str(exc.value)
