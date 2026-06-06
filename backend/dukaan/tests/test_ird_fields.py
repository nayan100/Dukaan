import pytest
from unittest.mock import MagicMock, call
import frappe as mock_frappe

def test_ensure_ird_fields_creation():
    """
    Test that ensure_ird_fields creates custom fields for IRD compliance.
    """
    from dukaan.compliance import ensure_ird_fields
    
    mock_frappe.db.exists.return_value = False
    
    ensure_ird_fields()
    
    # Verify Custom Field creation for Sales Invoice
    expected_calls = [
        call({
            "doctype": "Custom Field",
            "dt": "Sales Invoice",
            "fieldname": "ird_sync_token",
            "label": "IRD Sync Token",
            "fieldtype": "Data",
            "read_only": 1,
            "insert_after": "grand_total"
        }),
        call({
            "doctype": "Custom Field",
            "dt": "Sales Invoice",
            "fieldname": "ird_sync_status",
            "label": "IRD Sync Status",
            "fieldtype": "Select",
            "options": "Pending\nSynced\nFailed",
            "default": "Pending",
            "insert_after": "ird_sync_token"
        }),
        call({
            "doctype": "Custom Field",
            "dt": "Sales Invoice",
            "fieldname": "ird_idempotency_key",
            "label": "IRD Idempotency Key",
            "fieldtype": "Data",
            "read_only": 1,
            "insert_after": "ird_sync_status"
        })
    ]
    
    # Verify for Credit Note and Purchase Invoice as well
    for dt in ["Credit Note", "Purchase Invoice"]:
        mock_frappe.get_doc.assert_any_call({
            "doctype": "Custom Field",
            "dt": dt,
            "fieldname": "ird_sync_token",
            "label": "IRD Sync Token",
            "fieldtype": "Data",
            "read_only": 1,
            "insert_after": "grand_total"
        })
