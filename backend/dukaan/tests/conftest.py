import pytest
from unittest.mock import MagicMock
import sys

# Create a single shared mock for frappe
shared_mock_frappe = MagicMock()
sys.modules["frappe"] = shared_mock_frappe

# Make whitelist a transparent decorator
def whitelist_decorator():
    def decorator(fn):
        return fn
    return decorator

shared_mock_frappe.whitelist.side_effect = whitelist_decorator

@pytest.fixture(autouse=True)
def reset_frappe_mock():
    """Reset the shared mock before each test."""
    shared_mock_frappe.reset_mock()
    # Also reset nested mocks
    shared_mock_frappe.db.exists.reset_mock()
    shared_mock_frappe.get_doc.reset_mock()
