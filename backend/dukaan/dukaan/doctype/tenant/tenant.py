import frappe
from frappe.model.document import Document
from dukaan.tenant_enforcement import handle_tenant_suspension

class Tenant(Document):
    def on_update(self):
        handle_tenant_suspension(self, "on_update")
