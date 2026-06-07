import pytest
from unittest.mock import patch, MagicMock, call
import frappe

def test_tenant_suspension_clears_cache():
    from dukaan.tenant_enforcement import handle_tenant_suspension
    
    tenant = MagicMock()
    tenant.name = "TenantA"
    tenant.status = "Suspended"
    
    # Mock users belonging to this tenant
    mock_users = [{"name": "user1@tenantA.com"}, {"name": "user2@tenantA.com"}]
    
    with patch("frappe.get_all", return_value=mock_users):
        with patch("frappe.cache") as mock_cache_func:
            mock_cache = MagicMock()
            mock_cache_func.return_value = mock_cache
            
            handle_tenant_suspension(tenant, "on_update")
            
            calls = [
                call("tenant_id_user1@tenantA.com"),
                call("tenant_id_user2@tenantA.com")
            ]
            mock_cache.delete_value.assert_has_calls(calls, any_order=True)
            
            # Verify realtime event
            frappe.publish_realtime.assert_called_with(
                event="SESSION_REVOKED",
                message={"tenant_id": "TenantA"},
                room="tenant_TenantA"
            )

def test_active_tenant_does_not_clear_cache():
    from dukaan.tenant_enforcement import handle_tenant_suspension
    
    tenant = MagicMock()
    tenant.name = "TenantA"
    tenant.status = "Active"
    
    with patch("frappe.cache") as mock_cache_func:
        mock_cache = MagicMock()
        mock_cache_func.return_value = mock_cache
        
        handle_tenant_suspension(tenant, "on_update")
        
        assert mock_cache.delete_value.call_count == 0
