import frappe

def run_hierarchy_migration():
    """
    Phase 4: Add hierarchy and quota fields to User DocType.
    """
    fields = [
        {
            "fieldname": "parent_user",
            "fieldtype": "Link",
            "options": "User",
            "label": "Parent User",
            "insert_after": "email"
        },
        {
            "fieldname": "allocated_pos_quota",
            "fieldtype": "Int",
            "label": "Allocated POS Quota",
            "default": 0,
            "insert_after": "parent_user"
        },
        {
            "fieldname": "branch",
            "fieldtype": "Link",
            "options": "Warehouse",
            "label": "Assigned Branch",
            "insert_after": "allocated_pos_quota"
        },
        {
            "fieldname": "tenant_id",
            "fieldtype": "Link",
            "options": "Tenant",
            "label": "Tenant ID",
            "insert_after": "branch",
            "read_only": 1
        }
    ]
    
    for field_data in fields:
        if not frappe.db.exists("Custom Field", {"dt": "User", "fieldname": field_data["fieldname"]}):
            custom_field = frappe.get_doc({
                "doctype": "Custom Field",
                "dt": "User",
                **field_data
            })
            custom_field.insert(ignore_permissions=True)
            print(f"Added custom field {field_data['fieldname']} to User")

if __name__ == "__main__":
    # This would be called by a migration runner
    run_hierarchy_migration()
