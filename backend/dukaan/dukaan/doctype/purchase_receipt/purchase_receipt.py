import frappe
from frappe.model.document import Document
from dukaan.compliance import update_vat_annex_14

class PurchaseReceipt(Document):
    def on_submit(self):
        update_vat_annex_14(self, "on_submit")

    def on_cancel(self):
        update_vat_annex_14(self, "on_cancel")
