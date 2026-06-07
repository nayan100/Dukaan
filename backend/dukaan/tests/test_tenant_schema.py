import pytest
import json
import os

def test_tenant_doctype_has_required_fields():
    # Load the tenant.json file
    file_path = os.path.join(os.path.dirname(__file__), '../dukaan/doctype/tenant/tenant.json')
    with open(file_path, 'r') as f:
        tenant_schema = json.load(f)
        
    fields = [field.get('fieldname') for field in tenant_schema.get('fields', [])]
    
    # Assert required fields are present according to the spec
    assert 'name' in fields or 'company_name' in fields # name/company_name
    assert 'status' in fields
    assert 'default_warehouse' in fields
    assert 'plan_tier' in fields
