import json

doctypes = ['warehouse', 'purchase_order', 'supplier']

for dt in doctypes:
    file_path = f'backend/dukaan/dukaan/doctype/{dt}/{dt}.json'
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    for field in data.get('fields', []):
        if field.get('fieldname') == 'tenant_id':
            field['reqd'] = 1
            # In frappe, if we mark something as reqd it will translate to NOT NULL constraint 
            # if we rebuild the table or via patch.
            
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=1)
