import pytest
import json
import os
from unittest.mock import patch, MagicMock
import frappe as mock_frappe

def test_tenant_id_is_mandatory_in_json_schemas():
    doctypes_to_check = ['warehouse', 'purchase_order', 'supplier']
    
    for dt in doctypes_to_check:
        file_path = os.path.join(os.path.dirname(__file__), f'../dukaan/doctype/{dt}/{dt}.json')
        with open(file_path, 'r') as f:
            schema = json.load(f)
            
        field = next((f for f in schema.get('fields', []) if f.get('fieldname') == 'tenant_id'), None)
        assert field is not None
        assert field.get('reqd') == 1, f"tenant_id is not mandatory in {dt}.json"

def test_run_staged_migration_step_3():
    from dukaan.schema_hardening import run_staged_migration_step_3
    
    run_staged_migration_step_3()
    
    # We should have created indexes and made Custom Fields required
    calls = mock_frappe.db.sql.call_args_list
    
    tables_to_index = ["tabItem", "tabWarehouse", "`tabStock Entry`", "`tabSales Invoice`", "`tabPurchase Invoice`", "`tabPurchase Order`", "tabSupplier"]
    for table in tables_to_index:
        expected_sql = f"ALTER TABLE {table} ADD INDEX idx_tenant_id (tenant_id)"
        found = any(expected_sql in str(c) for c in calls)
        assert found, f"Expected {expected_sql} not found in calls"

