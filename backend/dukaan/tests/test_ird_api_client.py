import pytest
from unittest.mock import MagicMock, patch
import frappe as mock_frappe

def test_ird_api_client_success():
    """
    Test IRD API client successful transmission.
    """
    from dukaan.compliance import call_ird_api
    
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {"receipt_no": "IRD-SUCCESS-001"}
    
    with patch("requests.post", return_value=mock_response) as mock_post:
        result = call_ird_api("SINV-001", {"data": "test"})
        
        assert result == "IRD-SUCCESS-001"
        # Verify idempotency key in headers
        mock_post.assert_called_once()
        headers = mock_post.call_args[1]["headers"]
        assert headers["X-Idempotency-Key"] == "SINV-001"

def test_ird_api_client_conflict():
    """
    Test IRD API client handling 409 Conflict.
    """
    from dukaan.compliance import call_ird_api
    
    mock_response = MagicMock()
    mock_response.status_code = 409
    mock_response.json.return_value = {"error": "Duplicate", "receipt_no": "IRD-EXISTING-001"}
    
    with patch("requests.post", return_value=mock_response) as mock_post:
        result = call_ird_api("SINV-001", {"data": "test"})
        
        # Should treat 409 as success and return existing receipt_no
        assert result == "IRD-EXISTING-001"
