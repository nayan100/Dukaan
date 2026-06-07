import pytest
from unittest.mock import patch, MagicMock
import frappe

def test_e2e_tenant_isolation_read():
    """
    Scenario: User A logs in. System must prevent seeing records from User B.
    """
    from dukaan.tenant_enforcement import get_permission_query_conditions
    from dukaan.auth_service import set_current_tenant
    import frappe
    frappe.session.user = "Administrator"
    
    # 1. Login as TenantA
    set_current_tenant("TenantA")
    
    # 2. Simulate a list query for 'Item'
    conditions = get_permission_query_conditions("user_a@example.com", "Item")
    assert "tenant_id` = 'TenantA'" in conditions
    
    # 3. Switch to TenantB
    set_current_tenant("TenantB")
    conditions = get_permission_query_conditions("user_b@example.com", "Item")
    assert "tenant_id` = 'TenantB'" in conditions

def test_e2e_tenant_isolation_write_prevention():
    """
    Scenario: User A tries to insert a record for Tenant B. 
    System must overwrite it with Tenant A.
    """
    from dukaan.tenant_enforcement import enforce_tenant_on_write
    from dukaan.auth_service import set_current_tenant
    import frappe
    frappe.session.user = "Administrator"
    
    # 1. Login as TenantA
    set_current_tenant("TenantA")
    
    # 2. Mock a document being saved with TenantB manually set (spoofing attempt)
    mock_doc = MagicMock()
    mock_doc.doctype = "Item"
    mock_doc.tenant_id = "TenantB"
    
    # 3. Trigger write hook
    enforce_tenant_on_write(mock_doc, "before_insert")
    
    # 4. Verify isolation enforced
    assert mock_doc.tenant_id == "TenantA"
    assert mock_doc.tenant_id != "TenantB"

def test_e2e_suspended_tenant_access_denied():
    """
    Scenario: Tenant is Suspended. validate_tenant endpoint must reflect this.
    """
    from dukaan.auth import validate_tenant
    
    with patch("frappe.db.get_value", return_value="Suspended"):
        result = validate_tenant("SuspendedTenant")
        assert result["status"] == "Suspended"
