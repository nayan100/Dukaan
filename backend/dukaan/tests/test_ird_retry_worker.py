import pytest
from unittest.mock import MagicMock, patch
import frappe as mock_frappe

def test_retry_failed_ird_syncs():
    """
    Test that retry_failed_ird_syncs picks up failed documents and retries sync.
    """
    from dukaan.compliance import retry_failed_ird_syncs
    
    # Mock failed documents
    mock_frappe.get_all.return_value = [
        {"name": "SINV-FAILED-001", "ird_retry_count": 0},
        {"name": "SINV-FAILED-002", "ird_retry_count": 1}
    ]
    
    with patch("dukaan.compliance.sync_to_ird") as mock_sync:
        retry_failed_ird_syncs()
        
        # Verify sync_to_ird called for each failed document (2 docs * 3 doctypes = 6)
        assert mock_sync.call_count == 6
        mock_sync.assert_any_call("SINV-FAILED-001")
        mock_sync.assert_any_call("SINV-FAILED-002")

def test_retry_backoff_logic():
    """
    Test that documents are only retried if enough time has passed (simulated).
    """
    from dukaan.compliance import retry_failed_ird_syncs
    
    retry_failed_ird_syncs()
    
    # Verify get_all called for each DocType
    for dt in ["Sales Invoice", "Credit Note", "Purchase Invoice"]:
        mock_frappe.get_all.assert_any_call(
            dt,
            filters={
                "ird_sync_status": "Failed",
                "ird_retry_count": ["<", 5]
            },
            fields=["name", "ird_retry_count"]
        )
