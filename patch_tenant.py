import json
import os

file_path = 'backend/dukaan/dukaan/doctype/tenant/tenant.json'
with open(file_path, 'r') as f:
    data = json.load(f)

for field in data['fields']:
    if field['fieldname'] == 'plan':
        field['fieldname'] = 'plan_tier'

data['fields'].append({
    "fieldname": "default_warehouse",
    "fieldtype": "Link",
    "label": "Default Warehouse",
    "options": "Warehouse"
})

# Adding Trial to status options
for field in data['fields']:
    if field['fieldname'] == 'status':
        field['options'] = "Pending\nActive\nSuspended\nTrial\nDeleted"

with open(file_path, 'w') as f:
    json.dump(data, f, indent=1)
