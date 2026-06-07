import frappe

def get_current_tenant():
    user = frappe.session.user
    
    if user == "Administrator":
        return getattr(frappe.local, "current_tenant", "default")
        
    cache_key = f"tenant_id_{user}"
    tenant_id = frappe.cache().get_value(cache_key)
    
    if not tenant_id:
        tenant_id = frappe.get_value("User", user, "tenant_id")
        if tenant_id:
            frappe.cache().set_value(cache_key, tenant_id, expires_in_sec=3600)
            
    return tenant_id

def set_current_tenant(tenant_id):
    """Context manager equivalent helper to force tenant_id for system jobs."""
    frappe.local.current_tenant = tenant_id

class with_tenant:
    def __init__(self, tenant_id):
        self.tenant_id = tenant_id
        self.previous_tenant = getattr(frappe.local, "current_tenant", None)
        
    def __enter__(self):
        frappe.local.current_tenant = self.tenant_id
        
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.previous_tenant:
            frappe.local.current_tenant = self.previous_tenant
        else:
            if hasattr(frappe.local, "current_tenant"):
                delattr(frappe.local, "current_tenant")

