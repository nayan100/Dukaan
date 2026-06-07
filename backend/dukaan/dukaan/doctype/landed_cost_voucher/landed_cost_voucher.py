import frappe
from frappe.model.document import Document

class LandedCostVoucher(Document):
    def on_submit(self):
        self.adjust_valuation()

    def adjust_valuation(self):
        pr = frappe.get_doc("Purchase Receipt", self.receipt_document)
        
        total_receipt_amount = sum([flt(item.amount) for item in pr.items])
        if total_receipt_amount == 0:
            return
            
        additional_charges = flt(self.additional_charges)
            
        for item in pr.items:
            amount = flt(item.amount)
            if amount == 0:
                continue
                
            proportion = amount / total_receipt_amount
            allocated_charge = additional_charges * proportion
            
            existing_qty = flt(frappe.db.get_value("Bin", {"item_code": item.item_code, "warehouse": self.warehouse}, "actual_qty"))
            existing_rate = flt(frappe.db.get_value("Item", item.item_code, "valuation_rate"))
            
            if existing_qty > 0:
                new_total_value = (existing_qty * existing_rate) + allocated_charge
                new_rate = new_total_value / existing_qty
                frappe.db.set_value("Item", item.item_code, "valuation_rate", new_rate)

def flt(val):
    try:
        return float(val or 0)
    except ValueError:
        return 0.0
