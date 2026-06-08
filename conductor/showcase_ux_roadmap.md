# Grand Showcase UX Refinement Roadmap

This roadmap outlines the sequence of 5 specialized tracks designed to transform the current Dukaan MVP into a visually stunning, persona-driven "Grand Showcase" application. It prioritizes the user experience (UX), structural integrity, and high-fidelity interfaces over raw backend functionality, which has already been established.

## Track 1: Architectural Foundation (The "Showcase Engine")
**Focus:** Implement robust routing, decouple state, and establish the visual design system container scaffolding.
*   **Routing:** Migrate from `activeTab` state to `react-router-dom` for true URL-based deep-linking (e.g., `/pos`, `/hq`, `/branch`).
*   **State Management:** Introduce Zustand to decouple global states (`sharedInventory`, `syncStatus`, `authRole`) from the top-level `AppLayout`.
*   **Design System Scaffold:** Standardize the "Glassmorphic" container logic defined in `product-guidelines.md` for all upcoming dashboards.

## Track 2: The Cashier POS HUD ("Zero-Latency Interface")
**Focus:** Perfecting the high-speed, high-contrast, keyboard-first point of sale.
*   **Route:** `/pos`
*   **Tabs/Views:** Speed Grid (Predictive search), Split-Checkout Terminal.
*   **Showcase Elements:** "Autonomous Void" 60-second visual timer, Live Fonepay QR polling, and the "Sync Pulse" offline/online visual indicator.

## Track 3: The Chain Owner HQ ("Strategy & Growth")
**Focus:** High-level orchestration, comparative analytics, and global workflow approvals.
*   **Route:** `/hq`
*   **Tabs/Views:** Executive Scorecard (Map View), Global Approval Center, Growth Wizards.
*   **Showcase Elements:** "Dead Stock Rebalancer" map overlay highlighting stagnant inventory and suggesting automated inter-branch transfers.

## Track 4: The Branch Manager "Action Inbox"
**Focus:** Action-oriented dashboard for day-to-day branch management and logistics.
*   **Route:** `/branch`
*   **Tabs/Views:** Action Inbox (Task cards), Inter-Branch Logistics, Local Procurement & Stock.
*   **Showcase Elements:** "72-Hour Alert" visual flag for stock trapped in transit, Local Quota Burn-Down charts.

## Track 5: The Accountant "Compliance Grid"
**Focus:** Dense, readable, filterable data views for reconciliation and auditing.
*   **Route:** `/finance`
*   **Tabs/Views:** IRD Sync Monitor, Annex 14 / Purchase Register, Valuation & Variances.
*   **Showcase Elements:** High-performance grids (AG-Grid/TanStack Table) for financial logs, "Price Variance Auditor" flags.
