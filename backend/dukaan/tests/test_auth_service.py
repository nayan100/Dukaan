import pytest
from unittest.mock import patch, MagicMock
import frappe as mock_frappe

def test_get_current_tenant_caches_result():
    from dukaan.auth_service import get_current_tenant
    
    mock_frappe.session.user = "test@example.com"
    mock_frappe.cache().get_value.return_value = None
    mock_frappe.get_value.return_value = "TenantA"
    
    # First call - should hit DB
    tenant1 = get_current_tenant()
    assert tenant1 == "TenantA"
    mock_frappe.get_value.assert_called_once_with("User", "test@example.com", "tenant_id")
    mock_frappe.cache().set_value.assert_called_once_with("tenant_id_test@example.com", "TenantA", expires_in_sec=3600)
    
    # Reset mocks for second call
    mock_frappe.get_value.reset_mock()
    mock_frappe.cache().get_value.return_value = "TenantA"
    
    # Second call - should hit cache
    tenant2 = get_current_tenant()
    assert tenant2 == "TenantA"
    mock_frappe.get_value.assert_not_called()

def test_get_current_tenant_system_user():
    from dukaan.auth_service import get_current_tenant
    
    mock_frappe.session.user = "Administrator"
    
    # System users might not have a tenant or might have a system context
    # Use patch to mock hasattr on mock_frappe.local to ensure getattr returns default
    with patch.object(mock_frappe.local, 'current_tenant', "default", create=True):
        tenant = get_current_tenant()
        assert tenant == "default"
        
def test_with_tenant_context_manager():
    from dukaan.auth_service import with_tenant, get_current_tenant
    
    mock_frappe.session.user = "Administrator"
    
    with patch.object(mock_frappe.local, 'current_tenant', "default", create=True):
        with with_tenant("TenantB"):
            assert get_current_tenant() == "TenantB"
            
        assert get_current_tenant() == "default"

