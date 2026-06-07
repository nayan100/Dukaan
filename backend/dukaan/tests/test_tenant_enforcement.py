import pytest
from unittest.mock import patch, MagicMock

def test_permission_query_conditions():
    from dukaan.tenant_enforcement import get_permission_query_conditions
    
    with patch("dukaan.tenant_enforcement.get_current_tenant", return_value="TenantB"):
        conditions = get_permission_query_conditions("Administrator", "Item")
        assert conditions == "" # Administrators might bypass
        
        conditions = get_permission_query_conditions("user@example.com", "Item")
        assert conditions == "`tabItem`.`tenant_id` = 'TenantB'"

def test_permission_query_conditions_no_tenant():
    from dukaan.tenant_enforcement import get_permission_query_conditions
    
    with patch("dukaan.tenant_enforcement.get_current_tenant", return_value=None):
        conditions = get_permission_query_conditions("user@example.com", "Item")
        # If no tenant is found for user, deny access entirely
        assert conditions == "1=0"

def test_before_insert_enforces_tenant():
    from dukaan.tenant_enforcement import enforce_tenant_on_write
    import frappe
    frappe.session.user = "user@example.com"
    
    mock_doc = MagicMock()
    mock_doc.tenant_id = "SpoofedTenant"
    
    with patch("dukaan.tenant_enforcement.get_current_tenant", return_value="TenantA"):
        enforce_tenant_on_write(mock_doc, "before_insert")
        # Ensure it overwrote the spoofed tenant
        assert mock_doc.tenant_id == "TenantA"

def test_validate_enforces_tenant():
    from dukaan.tenant_enforcement import enforce_tenant_on_write
    import frappe
    frappe.session.user = "user@example.com"
    
    mock_doc = MagicMock()
    mock_doc.tenant_id = "SpoofedTenant"
    
    with patch("dukaan.tenant_enforcement.get_current_tenant", return_value="TenantA"):
        enforce_tenant_on_write(mock_doc, "validate")
        assert mock_doc.tenant_id == "TenantA"

def test_enforce_tenant_no_session_raises_error():
    from dukaan.tenant_enforcement import enforce_tenant_on_write
    import frappe
    frappe.session.user = "user@example.com"
    
    mock_doc = MagicMock()
    mock_doc.tenant_id = None
    
    with patch("dukaan.tenant_enforcement.get_current_tenant", return_value=None):
        with pytest.raises(Exception):
            enforce_tenant_on_write(mock_doc, "before_insert")

