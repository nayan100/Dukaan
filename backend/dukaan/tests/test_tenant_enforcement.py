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

