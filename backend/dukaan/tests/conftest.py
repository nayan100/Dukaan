import pytest
from unittest.mock import MagicMock
import sys

# Create a single shared mock for frappe
shared_mock_frappe = MagicMock()
sys.modules["frappe"] = shared_mock_frappe

class FrappeException(Exception):
    pass

def mock_throw(msg, title=None, **kwargs):
    raise FrappeException(msg)

shared_mock_frappe.throw.side_effect = mock_throw

# Mock submodules
mock_model = MagicMock()
sys.modules["frappe.model"] = mock_model
mock_document = MagicMock()
sys.modules["frappe.model.document"] = mock_document

class MockDocument:
    def __init__(self, dictionary=None):
        if dictionary:
            for key, value in dictionary.items():
                setattr(self, key, value)
    
    def get(self, key, default=None):
        return getattr(self, key, default)

    def db_set(self, fieldname, value):
        setattr(self, fieldname, value)
        
    def insert(self):
        pass
        
    def validate(self):
        pass

mock_document.Document = MockDocument

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
