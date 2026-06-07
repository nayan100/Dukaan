import frappe

@frappe.whitelist(allow_guest=True)
def validate_tenant(tenant_id):
    """
    Checks the status of a tenant.
    Used by the frontend to enforce instant revocation.
    """
    try:
        status = frappe.db.get_value("Tenant", tenant_id, "status")
        return {
            "status": status or "Invalid"
        }
    except Exception:
        return {
            "status": "Error"
        }


def login(tenant_id, username, password):
    """
    Unified multi-tenant authentication logic.
    """
    # 1. Verify Tenant Existence
    if not frappe.db.exists("Tenant", tenant_id):
        return {
            "status": "Failed",
            "message": f"Invalid Tenant ID: {tenant_id}"
        }
    
    # 2. Authenticate User (Simulation of LoginManager)
    # In a real Frappe app, this would use frappe.auth.LoginManager
    # Here we mock the behavior for the TDD cycle
    try:
        user = frappe.get_doc("User", username)
        
        # 3. Cross-Tenant Isolation Check
        # Every user record must be linked to a Tenant
        if getattr(user, 'tenant', None) != tenant_id:
            return {
                "status": "Failed",
                "message": "Access Denied: User does not belong to this tenant."
            }
            
        return {
            "status": "Success",
            "tenant_id": tenant_id,
            "username": username
        }
    except Exception:
        return {
            "status": "Failed",
            "message": "Authentication Failed."
        }
