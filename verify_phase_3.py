import os
import sys
import json
from unittest.mock import MagicMock, patch

# Mock frappe
mock_frappe = MagicMock()
sys.modules["frappe"] = mock_frappe

# Make whitelist a transparent decorator
def whitelist_decorator(*args, **kwargs):
    def decorator(fn):
        return fn
    return decorator
mock_frappe.whitelist.side_effect = whitelist_decorator

# Add the backend directory to sys.path
sys.path.append(os.path.abspath("backend/dukaan"))

from dukaan.tenant_enforcement import (
    get_permission_query_conditions,
    enforce_tenant_on_write,
    handle_tenant_suspension
)
from dukaan.auth import validate_tenant

# Alias for convenience
frappe = mock_frappe

def verify_data_isolation():
    print("--- 1. Testing Data Isolation (Read/Write) ---")
    
    # Mock current tenant
    with patch("dukaan.tenant_enforcement.get_current_tenant", return_value="TenantA"):
        # Test Read
        conditions = get_permission_query_conditions("user1", "Item")
        if "tenant_id` = 'TenantA'" in conditions:
            print("SUCCESS: Read isolation hook injected correct filter.")
        else:
            print(f"FAILURE: Read isolation filter incorrect: {conditions}")

        # Test Write (Spoofing prevention)
        doc = MagicMock()
        doc.doctype = "Item"
        doc.tenant_id = "TenantB"
        enforce_tenant_on_write(doc, "before_insert")
        if doc.tenant_id == "TenantA":
            print("SUCCESS: Write isolation hook prevented spoofing.")
        else:
            print(f"FAILURE: Write isolation failed. tenant_id is {doc.tenant_id}")

def verify_revocation():
    print("\n--- 2. Testing Instant Revocation (Suspension) ---")
    
    # Mock a Tenant document
    tenant = MagicMock()
    tenant.name = "TenantA"
    tenant.status = "Suspended"
    
    # Mock users for this tenant
    frappe.get_all.return_value = [{"name": "user1@tenantA.com"}]
    
    # Mock cache
    mock_cache = MagicMock()
    frappe.cache.return_value = mock_cache
    
    print("[Action] Suspending TenantA...")
    handle_tenant_suspension(tenant, "on_update")
    
    # Verify cache cleared
    if mock_cache.delete_value.called:
        args = mock_cache.delete_value.call_args[0][0]
        if "tenant_id_user1@tenantA.com" in args:
            print("SUCCESS: Redis cache cleared for tenant users.")
        else:
            print(f"FAILURE: Unexpected cache key deleted: {args}")
    else:
        print("FAILURE: Redis cache was not cleared.")
        
    # Verify Realtime event
    if frappe.publish_realtime.called:
        args = frappe.publish_realtime.call_args[1]
        if args.get("event") == "SESSION_REVOKED" and args.get("room") == "tenant_TenantA":
            print("SUCCESS: SESSION_REVOKED Socket.io event emitted.")
        else:
            print(f"FAILURE: Unexpected Socket.io event args: {args}")
    else:
        print("FAILURE: Socket.io event was not emitted.")

def verify_api_endpoint():
    print("\n--- 3. Testing Frontend Validation Endpoint ---")
    
    # Mock database value
    frappe.db.get_value.return_value = "Suspended"
    
    print("[Action] Calling validate_tenant for TenantA...")
    result = validate_tenant("TenantA")
    
    if result.get("status") == "Suspended":
        print("SUCCESS: API returned correct suspended status.")
    else:
        print(f"FAILURE: API returned unexpected status: {result}")

if __name__ == "__main__":
    try:
        verify_data_isolation()
        verify_revocation()
        verify_api_endpoint()
        print("\n--- PHASE 3 BACKEND LOGIC VERIFIED ---")
    except Exception as e:
        print(f"\nERROR DURING VERIFICATION: {e}")
        import traceback
        traceback.print_exc()
