import frappe
from frappe import _

ROLE_HIERARCHY = {
    "Admin": ["Chain Owner", "Single Owner"],
    "Chain Owner": ["Branch Owner", "Accountant"],
    "Single Owner": ["POS", "Accountant"],
    "Branch Owner": ["POS"],
}

@frappe.whitelist()
def create_sub_account(email, full_name, role, branch=None):
    """
    Whitelisted API to create sub-accounts within a tenant hierarchy.
    Enforces quotas and role-based creation rules.
    """
    creator = frappe.get_doc("User", frappe.session.user)
    creator_role = creator.role # Assuming user has a 'role' field or we check roles
    
    # In Frappe, we usually use frappe.get_roles(frappe.session.user)
    # For this simulation, we'll assume a primary 'role' field as per Task 3.1
    
    # 1. Validate Hierarchy
    allowed_roles = ROLE_HIERARCHY.get(creator_role, [])
    if role not in allowed_roles:
        frappe.throw(_("Unauthorized: You cannot create a user with the role '{0}'").format(role))
        
    tenant_id = creator.tenant_id
    if not tenant_id and creator_role != "Admin":
        frappe.throw(_("Unauthorized: No tenant found for creator."))

    # 2. Check Quotas
    if role == "Branch Owner":
        check_branch_quota(tenant_id)
    elif role == "POS":
        check_pos_quota(creator, tenant_id)

    # 3. Create User
    new_user = frappe.get_doc({
        "doctype": "User",
        "email": email,
        "first_name": full_name,
        "role": role,
        "parent_user": creator.name,
        "tenant_id": tenant_id,
        "branch": branch or creator.branch
    })
    
    # In a real app, we'd also assign the Frappe Role
    # new_user.add_roles(role)
    
    new_user.insert(ignore_permissions=True)
    
    return {
        "status": "Success",
        "message": f"User {email} created successfully as {role}.",
        "name": new_user.name
    }

def check_branch_quota(tenant_id):
    max_branches = frappe.db.get_value("Tenant", tenant_id, "max_branches")
    current_branches = frappe.db.count("User", filters={"tenant_id": tenant_id, "role": "Branch Owner"})
    
    if current_branches >= max_branches:
        frappe.throw(_("Quota Exceeded: This tenant has reached the maximum allowed branches ({0}).").format(max_branches))

def check_pos_quota(creator, tenant_id):
    if creator.role == "Single Owner":
        # Single Owner uses the global tenant pool
        max_pos = frappe.db.get_value("Tenant", tenant_id, "max_pos_accounts")
        current_pos = frappe.db.count("User", filters={"tenant_id": tenant_id, "role": "POS"})
        if current_pos >= max_pos:
            frappe.throw(_("Quota Exceeded: This tenant has reached the maximum allowed POS accounts ({0}).").format(max_pos))
    elif creator.role == "Branch Owner":
        # Branch Owner uses their sub-allocated quota
        allocated = creator.allocated_pos_quota
        current_pos = frappe.db.count("User", filters={"parent_user": creator.name, "role": "POS"})
        if current_pos >= allocated:
            frappe.throw(_("Quota Exceeded: You have reached your allocated POS quota ({0}).").format(allocated))

@frappe.whitelist()
def get_tenant_quota_usage(tenant_id=None):
    """
    Returns usage stats for the tenant's quotas.
    """
    if not tenant_id:
        tenant_id = frappe.db.get_value("User", frappe.session.user, "tenant_id")
        
    if not tenant_id:
        return {}
        
    max_branches = frappe.db.get_value("Tenant", tenant_id, "max_branches")
    max_pos = frappe.db.get_value("Tenant", tenant_id, "max_pos_accounts")
    
    current_branches = frappe.db.count("User", filters={"tenant_id": tenant_id, "role": "Branch Owner"})
    current_pos = frappe.db.count("User", filters={"tenant_id": tenant_id, "role": "POS"})
    
    return {
        "branches": {"used": current_branches, "max": max_branches},
        "pos": {"used": current_pos, "max": max_pos}
    }
