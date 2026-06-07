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
        frappe.throw("Cannot write document without an active Tenant Session.", exc=frappe.exceptions.ValidationError)
        
    doc.tenant_id = tenant_id

