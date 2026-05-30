---
tags: [flow, seller, pos, shift]
created: 2026-05-30
---

# Seller: POS & Shift Operations Flow

This flow covers the day-to-day operations of a seller/cashier, including shift management and customer service.

```mermaid
graph TD
    Start([Shift Start]) --> OpenDrawer[Count Opening Cash & Open Drawer]
    OpenDrawer --> Ready[Ready for Customers]
    
    Ready --> Transaction{Transaction?}
    Transaction -- Sales --> BillingFlow[Execute Billing Flow: Scan, Pay, Print]
    Transaction -- Return --> PolicyCheck{Follow Owner Return Policy?}
    PolicyCheck -- Yes --> InitiateReturn[Process Refund / Stock Re-entry]
    
    Ready --> InventoryLookup{Check Stock?}
    InventoryLookup -- Yes --> SearchItem[View Real-time Stock in Local/Branch]
    
    Ready --> EndShift{End of Day?}
    EndShift -- Yes --> CloseDrawer[Count Closing Cash & QR Totals]
    CloseDrawer --> ShiftReport[Generate Shift Settlement Report]
    ShiftReport --> LogOff([Shift Closed])
    
    BillingFlow -.-> Ready
    InitiateReturn --> Ready
    SearchItem --> Ready
```

> [!NOTE]
> Detailed checkout process logic is documented in [Billing-Flow.md](./Billing-Flow.md).
