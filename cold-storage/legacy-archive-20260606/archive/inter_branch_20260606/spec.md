# Specification: Inter-Branch Inventory Protocol

## 1. Overview
This track implements the resilient 4-step inventory transfer protocol between branches, including automated transit warehouse management and intelligence-driven rebalancing.

## 2. Technical Goals
*   Implement the **Inter-Branch Transfer** DocType with state machine (Requested, Dispatched, Approved, Received).
*   Develop automated **Transit Warehouse** logic for moving stock between nodes.
*   Implement the **5-Hour Auto-Rejection** timer (pausing during non-business hours).
*   Develop the **Dead Stock Rebalancer** (suggests transfers for stagnant items >30 days).

## 3. Key Components
*   **Transfer Service (Backend):** Manages Stock Entry (Issue/Receipt) and status transitions.
*   **Auto-Reject Job:** Background worker to enforce the 5-hour SLA.
*   **Dead Stock Engine:** AI-driven or rule-based logic to identify stagnant inventory.
*   **72-Hour Auditor Alert:** System-wide notification if stock is in transit >72 business hours.

## 4. Acceptance Criteria
*   Branch A can request items from Branch B.
*   Stock is moved to 'Transit' during dispatch and cannot be 'ghosted'.
*   Chain Owner approval correctly triggers the "Pending Receipt" state.
*   Auto-rejection returns stock to the sender if not approved within 5 business hours.
