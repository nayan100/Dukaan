import pytest
from unittest.mock import MagicMock, patch
import sys

# The conftest.py handles the shared frappe mock
import frappe as mock_frappe

def test_login_success_with_valid_tenant():
    """
    Test that a user can successfully login with a valid Tenant ID and credentials.
    """
    from dukaan.auth import login
    
    tenant_id = "T1"
    username = "cashier1"
    password = "password123"
    
    # Mock tenant exists
    mock_frappe.db.exists.return_value = True
    # Mock user belongs to the tenant
    mock_user = MagicMock()
    mock_user.tenant = tenant_id
    mock_frappe.get_doc.return_value = mock_user
    
    result = login(tenant_id, username, password)
    
    assert result["status"] == "Success"
    assert result["tenant_id"] == tenant_id

def test_login_failure_with_invalid_tenant():
    """
    Test that login fails if the Tenant ID does not exist.
    """
    from dukaan.auth import login
    
    tenant_id = "NON_EXISTENT"
    mock_frappe.db.exists.return_value = False
    
    result = login(tenant_id, "user", "pass")
    
    assert result["status"] == "Failed"
    assert "Invalid Tenant" in result["message"]

def test_cross_tenant_isolation():
    """
    Test that a user from one tenant cannot access another tenant.
    This simulates the logic where we verify the user belongs to the tenant.
    """
    from dukaan.auth import login
    
    tenant_id = "TenantA"
    username = "user@tenantB.com"
    
    # Mock tenant exists
    mock_frappe.db.exists.return_value = True
    # Mock user exists but belongs to a different tenant
    mock_user = MagicMock()
    mock_user.tenant = "TenantB"
    mock_frappe.get_doc.return_value = mock_user
    
    result = login(tenant_id, username, "pass")
    
    assert result["status"] == "Failed"
    assert "Access Denied" in result["message"]
