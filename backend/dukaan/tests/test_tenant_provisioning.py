import pytest
from unittest.mock import MagicMock, patch, call

# Mock frappe before importing modules that use it
import sys
mock_frappe = MagicMock()
sys.modules["frappe"] = mock_frappe

def test_create_tenant_triggers_site_provisioning():
    """
    Test that creating a Tenant record triggers the site provisioning logic.
    """
    from dukaan.tenant_provisioning import create_tenant
    
    tenant_details = {
        "company_name": "Test Shop",
        "plan": "Pro"
    }
    
    mock_tenant = MagicMock()
    mock_tenant.name = "Test Shop"
    mock_frappe.get_doc.return_value = mock_tenant
    
    with patch("dukaan.tenant_provisioning.provision_new_site") as mock_provision:
        create_tenant(tenant_details)
        
        # Verify frappe.get_doc was called with correct parameters
        mock_frappe.get_doc.assert_called_with({
            "doctype": "Tenant",
            "company_name": "Test Shop",
            "plan": "Pro",
            "status": "Pending"
        })
        
        # Verify tenant.insert was called
        mock_tenant.insert.assert_called_once()
        
        # Verify provisioning was triggered
        mock_provision.assert_called_once_with("Test Shop")

def test_provision_new_site_updates_tenant():
    """
    Test that site provisioning updates the tenant record with site details.
    """
    from dukaan.tenant_provisioning import provision_new_site
    
    tenant_name = "Test Shop"
    mock_tenant = MagicMock()
    mock_tenant.name = tenant_name
    mock_frappe.get_doc.return_value = mock_tenant
    
    provision_new_site(tenant_name)
    
    # Verify it fetches the tenant
    mock_frappe.get_doc.assert_called_with("Tenant", tenant_name)
    
    # Verify it updates site_url, db_name, and status
    expected_calls = [
        call("site_url", "https://test-shop.dukaan.com"),
        call("db_name", "db_test_shop"),
        call("status", "Active")
    ]
    mock_tenant.db_set.assert_has_calls(expected_calls)

def test_tenant_metadata_storage():
    """
    Test that tenant metadata is correctly formatted for storage.
    """
    from dukaan.tenant_provisioning import format_tenant_metadata
    
    raw_data = {"name": "Test", "plan": "Standard"}
    metadata = format_tenant_metadata(raw_data)
    
    assert metadata["status"] == "Pending"
    assert "created_at" in metadata
