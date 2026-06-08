# Grand Showcase UX Refinement Roadmap

This roadmap outlines the sequence of 5 specialized tracks designed to transform the current Dukaan MVP into a visually stunning, persona-driven "Grand Showcase" application. It prioritizes the user experience (UX), structural integrity, and high-fidelity interfaces over raw backend functionality, which has already been established.

## Track 1: Architectural Foundation (The "Showcase Engine") - ✅ COMPLETED
**Focus:** Implemented robust routing, decoupled state, and established the foundational structure.
*   **Routing:** Migrated from `activeTab` state to `react-router-dom` with deep-linking (`/pos`, `/hq`, `/branch`, `/finance`, `/admin`) and role-based redirection on the index route.
*   **State Management:** Introduced Zustand, creating `inventoryStore` and `syncStore` to decouple global states and remove prop-drilling from `AppLayout`.
*   **Refactoring:** Removed legacy `AppLayout` monolithic logic and replaced with a clean `<Outlet />` based layout and `<NavLink>` navigation.

## Track 2: The Cashier POS HUD ("Zero-Latency Interface") - ✅ COMPLETED
**Focus:** Perfected the high-speed, high-contrast, keyboard-first point of sale.
*   **Keyboard Controls:** Implemented global keyboard shortcuts (`F1`/`/` for search, `Enter`/`Esc` for modals, `+`/`-` for cart adjustment).
*   **Autonomous Void HUD:** Created a 60-second visual countdown timer with progress bar, amber warning pulse, and automatic void-lock mechanism.
*   **Showcase Elements:** Implemented simulated Fonepay polling with manual override, the "Sync Pulse" heartbeat UI, and a Multi-Branch Item Return Wizard.

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
