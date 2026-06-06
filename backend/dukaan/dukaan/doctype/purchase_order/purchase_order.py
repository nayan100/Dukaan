import frappe
from frappe.model.document import Document
from dukaan.retail_logic import validate_po_budget, validate_po_split_order

class PurchaseOrder(Document):
    def validate(self):
        # Enforce Monthly Budget
        validate_po_budget(self)
        
        # Check for split orders
        validate_po_split_order(self)

    def submit(self):
        if self.status != "Draft":
            frappe.throw("Purchase Order can only be submitted when in Draft status.")
        self.status = "Pending"

    def approve(self):
        if self.status != "Pending":
            frappe.throw("Purchase Order can only be approved when Pending.")
        self.status = "Approved"

    def receive(self):
        if self.status != "Approved":
            frappe.throw("Purchase Order can only be received when Approved.")
        self.status = "Received"
