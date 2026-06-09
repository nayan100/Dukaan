# Track Specification: Track 5 - The Accountant "Compliance Grid" (Showcase Edition)

## 1. Overview
This track transforms the `/finance` route into a premium **Accountant Command Center** and upgrades the `/hq` experience with advanced orchestration tools. It focuses on dense, interactive "Intelligence Grids," AI-augmented auditing, and high-fidelity visual reporting.

## 2. Functional Requirements
### 2.1 Finance Hub: The Compliance Command Center (`/finance`)
- **Multi-Page Layout:** Implement a "Dense Depth" sidebar with a unique **Slate-950/Gold** palette for the Accountant.
- **IRD Sync Monitor & Sales Register (`/finance/sync`):**
    - **Visual "Seal of Compliance":** A stylized digital seal for each synced invoice in the grid.
    - **Sync Heartbeat:** A real-time pulse animation indicating the connection to IRD servers.
- **Purchase Register & VAT Auditor (`/finance/purchase`):**
    - **TanStack Table Grid:** Filterable, sortable, and virtualized for 10k+ entries.
    - **One-Click IRD Export:** Export Annex 14 directly to IRD-compatible Excel/CSV formats.
- **Financial Governance Suite (`/finance/audit`):**
    - **Interactive Price Variance Auditor:** Highlight "Suspicious" price fluctuations with a "Request Re-evaluation" workflow.
    - **Financial Health Radar:** A Radar Chart comparing **Budget vs. Actual vs. Forecast** performance.
    - **Anomaly Sentinel:** Automated flags for "High-Frequency Voids" and "Discount Velocity" anomalies at the branch level.

### 2.2 HQ Layout: The Unified Strategic Hub (`/hq`)
- **Multi-Page Expansion:** Add sub-routes for all Chain Owner management and strategic tools:
    - **Strategy Hub (`/hq/scorecard`):** KPI aggregations and Executive AI Summary.
    - **Analytics Hub (`/hq/analytics`):** `ComparativeAnalytics` and `ProcurementAnalyticsHub`.
    - **Branch Orchestration (`/hq/branches`):** Integration of legacy `BranchManagement` and `BranchDashboard`.
    - **Access Control (`/hq/users`):** Integration of legacy `UserManagement`.
    - **Logistics Hub (`/hq/rebalancer`):** `DeadStockMap` with geographic heatmap revenue overlay.
    - **Approval Center (`/hq/approvals`):** Unified inbox for chain-wide authorizations.
- **Global Features:**
    - **Pricing Wizard:** Centralized price updates with impact simulation.
    - **Leaderboard:** Branch-wise sales competition gamification.

## 3. Technical Requirements
- **Grid Engine:** **TanStack Table v8** with row virtualization.
- **Visuals:** `framer-motion` for layout transitions and `recharts` for the Radar and Heatmap charts.
- **State:** `useFinanceStore` (Zustand) for audit flags; `useHQStore` for global pricing simulations.

## 4. Acceptance Criteria
- [ ] `/finance` sub-routes are fully navigable and aesthetic.
- [ ] Annex 14 export generates a file with correct IRD-style headers.
- [ ] Pricing Wizard allows simulating a 5% increase and seeing the "Global Margin Impact."
- [ ] Heatmap overlay on the Nepal map responds to revenue data changes.
