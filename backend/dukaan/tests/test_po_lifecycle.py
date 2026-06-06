import pytest
from unittest.mock import MagicMock, patch
from conftest import FrappeException
from dukaan.doctype.purchase_order.purchase_order import PurchaseOrder

def test_po_submit_flow():
    """Test that a Draft PO can be submitted, moving it to Pending."""
    doc = PurchaseOrder({
        "doctype": "Purchase Order",
        "status": "Draft"
    })
    doc.submit()
    assert doc.status == "Pending"

def test_po_approve_flow():
    """Test that a Pending PO can be approved."""
    doc = PurchaseOrder({
        "doctype": "Purchase Order",
        "status": "Pending"
    })
    doc.approve()
    assert doc.status == "Approved"

def test_po_receive_flow():
    """Test that an Approved PO can be marked as Received."""
    doc = PurchaseOrder({
        "doctype": "Purchase Order",
        "status": "Approved"
    })
    doc.receive()
    assert doc.status == "Received"

def test_invalid_approval_flow():
    """Test that a Draft PO cannot be approved directly."""
    doc = PurchaseOrder({
        "doctype": "Purchase Order",
        "status": "Draft"
    })
    with pytest.raises(FrappeException) as excinfo:
        doc.approve()
    assert "can only be approved when pending" in str(excinfo.value).lower()

def test_invalid_submission_flow():
    """Test that an already Approved PO cannot be re-submitted."""
    doc = PurchaseOrder({
        "doctype": "Purchase Order",
        "status": "Approved"
    })
    with pytest.raises(FrappeException) as excinfo:
        doc.submit()
    assert "can only be submitted when in draft status" in str(excinfo.value).lower()
