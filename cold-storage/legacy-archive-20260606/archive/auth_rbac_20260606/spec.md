# Specification: Advanced Auth & Hierarchical RBAC

## 1. Overview
This track implements a multi-tenant authentication system and a hierarchical Role-Based Access Control (RBAC) engine. It ensures that users only see and interact with data appropriate to their role and branch scope.

## 2. Technical Goals
*   Implement multi-tenant login flow (Tenant ID + Username + Password).
*   Develop client-side **Permission Shadowing** using encrypted `sessionStorage`.
*   Establish hierarchical routing:
    *   **Platform Admin:** Global SaaS visibility.
    *   **Chain Owner:** Multi-branch strategy view.
    *   **Branch Owner:** Scoped local branch view.
    *   **Cashier:** Locked-down POS HUD.
*   Enforce hard server-side validation for every write request.

## 3. Key Components
*   **Auth Provider (React):** Manages session state and permission tree fetching.
*   **Permission Guard:** Higher-Order Component (HOC) to protect routes and UI elements.
*   **Shadow Store:** Logic to serialize and store the Frappe `Role Profile` in the browser.
*   **UI Fix:** Update POS HUD to "Fit-to-Page" with no overflow.

## 4. Acceptance Criteria
*   User can log in with their Tenant ID and Role.
*   The Sidebar and Dashboard instantly update based on the logged-in persona.
*   Branch Owners cannot see data from other branches.
*   Cashiers are restricted from accessing the Strategy Hub or Growth Wizards.
*   POS HUD perfectly fits all screen sizes with no scrollbars.
