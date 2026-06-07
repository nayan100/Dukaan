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

