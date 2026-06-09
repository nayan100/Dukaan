# Grand Showcase UX Refinement Roadmap

This roadmap outlines the sequence of 11 specialized tracks designed to transform the current Dukaan MVP into a visually stunning, persona-driven "Grand Showcase" application. It prioritizes the user experience (UX), structural integrity, and high-fidelity interfaces over raw backend functionality, which has already been established.

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

## Track 5: The Accountant "Compliance Grid" - ✅ COMPLETED
**Focus:** High-performance financial auditing, IRD compliance reporting, and global HQ consolidation.
*   **Compliance Grid (Annex 14):** Implemented a high-performance, virtualized data grid (TanStack Table) capable of handling 10,000+ records with real-time "Rounding Error" detection and IRD-compatible exports.
*   **Financial Governance:** Developed the "Interactive Price Variance Auditor" for purchase reconciliation and "Anomaly Sentinel" flags for tracking suspicious discount velocity and voids.
*   **Financial Visualizations:** Integrated the "Financial Health Radar" and "Revenue Heatmap Overlay" for the Nepal SVG map, providing spatial insights into revenue distribution.
*   **HQ Ecosystem Consolidation:** Fully integrated legacy Branch and User management into the refined HQ sidebar, alongside a new "Pricing Wizard" for simulation-based margin adjustments.
*   **Persona-Driven Architecture:** Established the `/finance` route with a dedicated sidebar for the Accountant persona, ensuring a focused, audit-ready workspace.

---

## Track 6: The Network Pulse (Real-Time Observability)
**Focus:** Real-time system transparency and global "liveness."
*   **Global Activity Ticker:** A scrolling, low-latency feed of events across the network (e.g., *"Kathmandu: Sale of $45.00"*, *"Pokhara: Stock Low"*).
*   **Live Sales Pulse:** Upgrading the Nepal SVG map with "active pulses"—branch pins pulse green when transactions occur in real-time.
*   **Sovereignty Isolation HUD:** A visual panel in the Admin view showing real-time proof of data sandboxing and "Isolation Shield" status.
*   **System Vital Signs:** A NOC-style dashboard showing API latency, sync health, and database load for the platform owner.

## Track 7: Industrial Logistics (Tactile Physicality)
**Focus:** Bridging the digital-physical gap with tactile warehouse HUDs and spatial inventory.
*   **Visual Bin-Tracking:** A 2D grid representation of physical storage space with "heat coloring" to visualize stock density and velocity.
*   **The "Flight Path" Map:** An interactive logistics map showing inter-branch transfers moving along routes with a "Package Progress" timeline.
*   **Warehouse "Dead Zone" Auditor:** A tool that highlights physical areas in a warehouse that haven't had stock movement in 30+ days.

## Track 8: Customer Experience & Loyalty (B2C Surface)
**Focus:** Growth, retention, and digital-to-physical customer engagement.
*   **Customer Persona Cards:** High-fidelity "Customer Profiles" showing purchase frequency, "Loyalty Tiers", and a visual "Product Affinity" cloud.
*   **The Promotion Wizard:** A step-by-step UI for HQ to launch "Flash Sales" or "Holiday Discounts" that propagate to POS units in real-time.
*   **Digital Receipt Experience:** A mobile-optimized receipt view with dynamic QR codes for loyalty points and personalized feedback loops.

## Track 9: Intelligent Autonomy (The AI Co-Pilot)
**Focus:** Moving from "reporting" to "predicting" with AI-driven insights.
*   **Predictive Stock Charting:** Visualizing dotted-line projections of when items will hit zero based on historical sales velocity.
*   **AI Procurement Drafts:** A "One-Click Restock" button that uses AI to draft purchase orders across the chain, explaining its logic based on seasonality.
*   **Anomaly Sentinel HUD:** A dedicated view for spotting "Strange Patterns" (e.g., unusual void frequencies or discount velocity) to prevent leakage.

## Track 10: The Developer Surface (Platform API)
**Focus:** Turning the app into a platform via high-fidelity API Explorers.
*   **Integrated API Explorer:** A Swagger-style playground where users can test API calls directly in the browser with "Copy to Curl" buttons.
*   **Webhook Event Simulator:** A visual dashboard to trigger and monitor webhook events (e.g., sale, stock-out) for third-party integrations.
*   **Third-Party App Cards:** A mock "App Store" showing potential integrations (e.g., Xero, Shopify, Slack notifications).

## Track 11: The "Grand Finale" (Total Polish)
**Focus:** The "Ultimate Demo" experience and final performance optimization.
*   **The "Infinite Demo" Toggle:** A master switch that populates the entire system with 12 months of beautiful, simulated data for a 50-branch empire.
*   **Latency-Zero UI:** A final pass to ensure 60FPS transitions and "instant" feel via optimistic state updates across all complex grids.
*   **The "Showcase Guided Tour":** An automated, animated overlay that walks stakeholders through the 5 personas in 120 seconds.
