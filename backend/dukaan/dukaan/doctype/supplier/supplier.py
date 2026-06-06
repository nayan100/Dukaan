import frappe
from frappe.model.document import Document

class Supplier(Document):
    def validate(self):
        self.validate_tax_id()

    def validate_tax_id(self):
        if not self.tax_id:
            frappe.throw("Tax ID (PAN/VAT) is mandatory for Annex 14 compliance.", title="Validation Error")
        
        if not self.tax_id.isdigit():
            frappe.throw("Tax ID (PAN/VAT) must be numeric.", title="Validation Error")
            
        if len(self.tax_id) != 9:
            frappe.throw("Tax ID (PAN/VAT) must be exactly 9 digits.", title="Validation Error")
