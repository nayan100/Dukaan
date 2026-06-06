import pytest
from unittest.mock import MagicMock, patch
import frappe as mock_frappe
from conftest import FrappeException
from dukaan.doctype.purchase_order.purchase_order import PurchaseOrder

def setup_user(role):
    mock_user = MagicMock()
    mock_frappe.get_doc.return_value = mock_user
    mock_user.has_role.side_effect = lambda r: r == role
    return mock_user

def test_accountant_can_approve_pending():
    """Test that an Accountant can approve a Pending PO."""
    setup_user("Accountant")
    doc = PurchaseOrder({"doctype": "Purchase Order", "status": "Pending"})
    doc.approve() # Should not raise
    assert doc.status == "Approved"

def test_branch_owner_cannot_approve():
    """Test that a Branch Owner cannot approve a PO, only submit."""
    setup_user("Branch Owner")
    doc = PurchaseOrder({"doctype": "Purchase Order", "status": "Pending"})
    with pytest.raises(FrappeException) as excinfo:
        doc.approve()
    assert "not permitted to approve" in str(excinfo.value).lower()

def test_chain_owner_can_approve_pending():
    """Test that a Chain Owner can also approve a Pending PO."""
    setup_user("Chain Owner")
    doc = PurchaseOrder({"doctype": "Purchase Order", "status": "Pending"})
    doc.approve() # Should not raise
    assert doc.status == "Approved"

def test_branch_owner_can_submit():
    """Test that a Branch Owner can submit a Draft PO."""
    setup_user("Branch Owner")
    doc = PurchaseOrder({"doctype": "Purchase Order", "status": "Draft"})
    doc.submit()
    assert doc.status == "Pending"

def test_accountant_cannot_submit():
    """Test that an Accountant cannot submit a new PO."""
    setup_user("Accountant")
    doc = PurchaseOrder({"doctype": "Purchase Order", "status": "Draft"})
    with pytest.raises(FrappeException) as excinfo:
        doc.submit()
    assert "not permitted to submit" in str(excinfo.value).lower()
