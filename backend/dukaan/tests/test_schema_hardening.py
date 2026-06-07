import pytest
import json
import os
from unittest.mock import patch, MagicMock
import frappe as mock_frappe

def test_tenant_id_in_json_schemas():
    # Check if tenant_id is in the JSON files of our custom doctypes
    doctypes_to_check = ['warehouse', 'purchase_order', 'supplier']
    
    for dt in doctypes_to_check:
        file_path = os.path.join(os.path.dirname(__file__), f'../dukaan/doctype/{dt}/{dt}.json')
        with open(file_path, 'r') as f:
            schema = json.load(f)
            
        fields = [field.get('fieldname') for field in schema.get('fields', [])]
        assert 'tenant_id' in fields, f"tenant_id missing in {dt}.json"

def test_schema_hardening_script_adds_custom_fields():
    from dukaan.schema_hardening import run_staged_migration_step_1
    
    # Mock frappe.db.exists to return False so it tries to create the fields
    mock_frappe.db.exists.return_value = False
    
    run_staged_migration_step_1()
    
    # It should insert Custom Fields for Item, Stock Entry, and Sales/Purchase Invoice
    # Check that frappe.get_doc was called with these
    calls = mock_frappe.get_doc.call_args_list
    dts_created = [call[0][0]['dt'] for call in calls if call[0][0]['doctype'] == 'Custom Field']
    
    assert 'Item' in dts_created
    assert 'Stock Entry' in dts_created
    # Can be 'Invoice' or 'Sales Invoice', let's check for either
    assert any('Invoice' in dt for dt in dts_created)

