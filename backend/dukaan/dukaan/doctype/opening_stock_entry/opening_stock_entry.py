import frappe
from frappe.model.document import Document

class OpeningStockEntry(Document):
    def validate(self):
        self.calculate_totals()
        
    def calculate_totals(self):
        self.total_valuation = 0
        for item in self.items:
            item.amount = flt(item.qty) * flt(item.rate)
            self.total_valuation += item.amount

    def on_submit(self):
        self.update_moving_average_rates()
        self.status = "Submitted"

    def update_moving_average_rates(self):
        for item in self.items:
            existing_qty = flt(frappe.db.get_value("Bin", {"item_code": item.item_code, "warehouse": self.warehouse}, "actual_qty"))
            existing_rate = flt(frappe.db.get_value("Item", item.item_code, "valuation_rate"))
            
            new_qty = flt(item.qty)
            new_rate = flt(item.rate)
            
            total_qty = existing_qty + new_qty
            
            if total_qty > 0:
                moving_average_rate = ((existing_qty * existing_rate) + (new_qty * new_rate)) / total_qty
            else:
                moving_average_rate = new_rate
                
            frappe.db.set_value("Item", item.item_code, "valuation_rate", moving_average_rate)

def flt(val):
    try:
        return float(val or 0)
    except ValueError:
        return 0.0
