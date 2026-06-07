import json

doctypes = ['warehouse', 'purchase_order', 'supplier']

for dt in doctypes:
    file_path = f'backend/dukaan/dukaan/doctype/{dt}/{dt}.json'
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    # Check if tenant_id exists
    exists = any(field.get('fieldname') == 'tenant_id' for field in data.get('fields', []))
    if not exists:
        data['fields'].append({
            "fieldname": "tenant_id",
            "fieldtype": "Link",
            "options": "Tenant",
            "label": "Tenant ID",
            "read_only": 1
        })
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=1)
