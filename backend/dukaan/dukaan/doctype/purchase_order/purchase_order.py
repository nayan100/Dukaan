import frappe
from frappe.model.document import Document
from dukaan.retail_logic import validate_po_budget, validate_po_split_order

class PurchaseOrder(Document):
    def validate(self):
        # Enforce Monthly Budget
        validate_po_budget(self)
        
        # Check for split orders
        validate_po_split_order(self)
