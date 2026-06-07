import frappe
from dukaan.auth_service import get_current_tenant

def get_permission_query_conditions(user, doctype):
    """
    Frappe hook for `permission_query_conditions`.
    Injects tenant_id filter into list queries.
    """
    if user == "Administrator":
        return ""
        
    tenant_id = get_current_tenant()
    
    if not tenant_id:
        return "1=0"
        
    return f"`tab{doctype}`.`tenant_id` = '{tenant_id}'"


def enforce_tenant_on_write(doc, method):
    """
    DocEvent hook for `before_insert` and `validate`.
    Forces the document's tenant_id to be the current session's tenant_id.
    """
    # System users or docs that don't need tenant_id (like Tenant itself)
    if doc.doctype in ["Tenant", "User", "Role"]:
        return
        
    if frappe.session.user == "Administrator":
        # Allow administrator to set tenant_id explicitly if they want, 
        # but if current_tenant context manager is used, use that.
        current = get_current_tenant()
        if current and current != "default":
            doc.tenant_id = current
        return

    tenant_id = get_current_tenant()
    
    if not tenant_id:
        frappe.throw("Cannot write document without an active Tenant Session.")
        
    doc.tenant_id = tenant_id


def handle_tenant_suspension(doc, method):
    """
    DocEvent hook for Tenant DocType on_update.
    Clears session cache for all users of a suspended tenant.
    """
    if doc.status != "Suspended":
        return
        
    # Get all users belonging to this tenant
    users = frappe.get_all("User", filters={"tenant_id": doc.name}, fields=["name"])
    
    cache = frappe.cache()
    for user in users:
        username = user.get("name")
        # Clear the tenant_id cache used by auth_service.py
        cache.delete_value(f"tenant_id_{username}")
        # In a real Frappe app, we would also clear session keys:
        # frappe.clear_cache(user=username)

    # Emit Socket.io event for instant logout
    frappe.publish_realtime(
        event="SESSION_REVOKED",
        message={"tenant_id": doc.name},
        room=f"tenant_{doc.name}"
    )

