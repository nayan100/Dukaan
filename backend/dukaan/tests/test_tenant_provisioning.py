import pytest
from unittest.mock import MagicMock, patch, call
import sys

# Import the shared mock
import frappe as mock_frappe

def test_create_tenant_triggers_site_provisioning():
    """
    Test that creating a Tenant record triggers the site provisioning logic.
    """
    from dukaan.tenant_provisioning import create_tenant
    
    tenant_details = {
        "company_name": "Test Shop",
        "plan_tier": "Pro"
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
            "plan_tier": "Pro",
            "status": "Pending"
        })
        
        # Verify tenant.insert was called
        mock_tenant.insert.assert_called_once()
        
        # Verify provisioning was triggered
        mock_provision.assert_called_once_with("Test Shop")

def test_provision_new_site_updates_tenant_and_creates_warehouse():
    """
    Test that site provisioning updates the tenant record and creates a default warehouse.
    """
    from dukaan.tenant_provisioning import provision_new_site
    
    tenant_name = "Test Shop"
    mock_tenant = MagicMock()
    mock_tenant.name = tenant_name
    mock_frappe.get_doc.return_value = mock_tenant
    mock_frappe.db.exists.return_value = False
    
    mock_warehouse = MagicMock()
    mock_warehouse.name = "Test Shop - Local"
    
    # We need to handle multiple get_doc calls
    def side_effect(doctype_or_name, name=None):
        if doctype_or_name == "Tenant" or (doctype_or_name == "Tenant" and name == tenant_name):
            return mock_tenant
        if isinstance(doctype_or_name, dict) and doctype_or_name.get("doctype") == "Warehouse":
            return mock_warehouse
        return MagicMock()

    mock_frappe.get_doc.side_effect = side_effect
    
    provision_new_site(tenant_name)
    
    # Verify it updates site_url, db_name, and status
    assert mock_tenant.site_url == "https://test-shop.dukaan.com"
    assert mock_tenant.db_name == "db_test_shop"
    assert mock_tenant.status == "Active"
    
    # Verify warehouse creation
    mock_warehouse.insert.assert_called_once()
    assert mock_tenant.default_warehouse == "Test Shop - Local"
    
    # Verify it saves the tenant
    mock_tenant.save.assert_called_once()

def test_tenant_metadata_storage():
    """
    Test that tenant metadata is correctly formatted for storage.
    """
    from dukaan.tenant_provisioning import format_tenant_metadata
    
    raw_data = {"name": "Test", "plan_tier": "Standard"}
    metadata = format_tenant_metadata(raw_data)
    
    assert metadata["status"] == "Pending"
    assert "created_at" in metadata
