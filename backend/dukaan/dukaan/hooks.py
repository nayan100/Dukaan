app_name = "dukaan"
app_title = "Dukaan"
app_publisher = "Nayan"
app_description = "High-performance Multi-tenant POS"
app_email = "nayan@example.com"
app_license = "MIT"

# Permission Query Conditions
# ---------------------------
# This will inject the tenant_id filter into all list queries for the specified DocTypes.
permission_query_conditions = {
    "Item": "dukaan.tenant_enforcement.get_permission_query_conditions",
    "Warehouse": "dukaan.tenant_enforcement.get_permission_query_conditions",
    "Stock Entry": "dukaan.tenant_enforcement.get_permission_query_conditions",
    "Sales Invoice": "dukaan.tenant_enforcement.get_permission_query_conditions",
    "Purchase Invoice": "dukaan.tenant_enforcement.get_permission_query_conditions",
    "Purchase Order": "dukaan.tenant_enforcement.get_permission_query_conditions",
    "Supplier": "dukaan.tenant_enforcement.get_permission_query_conditions",
    "VAT Annex 13": "dukaan.tenant_enforcement.get_permission_query_conditions",
    "VAT Annex 14": "dukaan.tenant_enforcement.get_permission_query_conditions",
}

# Document Events
# ---------------
# This will enforce the tenant_id on all writes and handle suspension logic.
doc_events = {
    "*": {
        "before_insert": "dukaan.tenant_enforcement.enforce_tenant_on_write",
        "validate": "dukaan.tenant_enforcement.enforce_tenant_on_write",
    },
    "Tenant": {
        "on_update": "dukaan.tenant_enforcement.handle_tenant_suspension",
    },
    "User": {
        "before_insert": "dukaan.quota_enforcement.enforce_user_quotas",
    }
}
