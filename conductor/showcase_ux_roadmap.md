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

## Track 3: The Chain Owner HQ ("Strategy & Growth") - ✅ COMPLETED
**Focus:** High-level orchestration, comparative analytics, and global workflow approvals.
*   **Integrated Multi-Page Hub:** Refactored the `/hq` route into a clean, integrated experience where "Scorecard", "Dead Stock", "Approvals", and "Growth Hub" are directly accessible from the main sidebar.
*   **Executive Scorecard:** Built a high-fidelity dashboard featuring real-time KPI aggregation and `recharts` visualizations for chain-wide revenue distribution and inventory performance.
*   **Dead Stock Rebalancer:** Implemented a stylized SVG map of Nepal with interactive, color-coded branch pins and a companion health table to visualize stagnant inventory.
*   **Global Approval Center:** Created a Unified Action Inbox for managing inter-branch transfers, procurement overrides, and exceptions with human-in-the-loop authorization guardrails.
*   **Growth Wizards:** Developed a reusable wizard infrastructure with multi-step state preservation, launching specialized "New Branch" and "Market Expansion" protocols.
*   **AI Orchestration:** Integrated the "AI Suggestions Hub" overlay for proactive inventory rebalancing suggestions.

## Track 4: The Branch Manager "Action Inbox" - ✅ COMPLETED
**Focus:** Transformed the `/branch` route into a high-fidelity, persona-driven command center for local branch orchestration.
*   **Integrated Sidebar Navigation:** Migrated sub-navigation from a layout header directly into the main sidebar, providing immediate access to **Action Inbox**, **Inventory**, **Logistics**, **Procurement**, and **Sales History**.
*   **Action Inbox:** Developed a task-card interface with automated operational intelligence, including **72-Hour Transit Alerts** and **Critical Stock warnings**.
*   **Logistics Hub:** Implemented a resilient inter-branch transfer system supporting both **Request** and **Dispatch** protocols with logical warehouse isolation.
*   **Transaction Audit (Sales History):** Built a comprehensive log of revenue events featuring **Strict Return Validation** (duplicate prevention) and support for **Partial Returns**.
*   **Local Quota Governance:** Injected visual burn-down charts into the inventory suite to track resource consumption against sovereign limits in real-time.
*   **State Management:** Leveraged `useBranchStore` for task lifecycle management and real-time operational alerts.

## Track 5: The Accountant "Compliance Grid"
**Focus:** Dense, readable, filterable data views for reconciliation and auditing.
*   **Route:** `/finance`
*   **Tabs/Views:** IRD Sync Monitor, Annex 14 / Purchase Register, Valuation & Variances.
*   **Showcase Elements:** High-performance grids (AG-Grid/TanStack Table) for financial logs, "Price Variance Auditor" flags.
