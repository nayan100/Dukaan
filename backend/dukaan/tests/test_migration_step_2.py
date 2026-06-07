import pytest
from unittest.mock import patch, MagicMock, call
import frappe as mock_frappe

def test_run_staged_migration_step_2():
    from dukaan.schema_hardening import run_staged_migration_step_2
    
    # Mocking db.sql and db.commit
    mock_frappe.db.sql.side_effect = [
        # First call to UPDATE Item
        [("some_result",)],
        # Second call returns empty meaning no more rows updated
        [],
        # Similarly for other tables, let's just use empty for the rest
        [], [], [], [], [], [], []
    ]
    
    run_staged_migration_step_2()
    
    # We should have attempted to update the tables in batches
    tables_to_update = ["tabItem", "tabWarehouse", "`tabStock Entry`", "`tabSales Invoice`", "`tabPurchase Invoice`", "`tabPurchase Order`", "tabSupplier"]
    
    for table in tables_to_update:
        expected_sql = f"UPDATE {table} SET tenant_id='default' WHERE tenant_id IS NULL LIMIT 5000"
        # We check if it's in the call args string
        found = any(expected_sql in str(c) for c in mock_frappe.db.sql.call_args_list)
        assert found, f"Expected {expected_sql} not found in calls"
        
    assert mock_frappe.db.commit.called

