import frappe
from frappe import _

def enforce_user_quotas(doc, method):
    """
    DocEvent hook for User `before_insert`.
    Enforces hierarchical quotas when a user is created manually (not via API).
    """
    if frappe.session.user == "Administrator" or doc.role == "Admin":
        return

    # 1. Enforce Tenant ID on User record
    if not doc.tenant_id:
        doc.tenant_id = frappe.db.get_value("User", frappe.session.user, "tenant_id")

    # 2. Check Quotas based on role
    if doc.role == "Branch Owner":
        check_branch_quota(doc.tenant_id)
    elif doc.role == "POS":
        creator = frappe.get_doc("User", frappe.session.user)
        check_pos_quota(creator, doc.tenant_id)

def check_branch_quota(tenant_id):
    max_branches = frappe.db.get_value("Tenant", tenant_id, "max_branches")
    current_branches = frappe.db.count("User", filters={"tenant_id": tenant_id, "role": "Branch Owner"})
    
    if current_branches >= max_branches:
        frappe.throw(_("Quota Exceeded: This tenant has reached the maximum allowed branches ({0}).").format(max_branches))

def check_pos_quota(creator, tenant_id):
    if creator.role == "Single Owner":
        max_pos = frappe.db.get_value("Tenant", tenant_id, "max_pos_accounts")
        current_pos = frappe.db.count("User", filters={"tenant_id": tenant_id, "role": "POS"})
        if current_pos >= max_pos:
            frappe.throw(_("Quota Exceeded: This tenant has reached the maximum allowed POS accounts ({0}).").format(max_pos))
    elif creator.role == "Branch Owner":
        allocated = creator.allocated_pos_quota
        current_pos = frappe.db.count("User", filters={"parent_user": creator.name, "role": "POS"})
        if current_pos >= allocated:
            frappe.throw(_("Quota Exceeded: You have reached your allocated POS quota ({0}).").format(allocated))
