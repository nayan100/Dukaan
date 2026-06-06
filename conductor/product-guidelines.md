# Product Guidelines: Dukaan

## 1. Persona-Based Tone & Voice
The language used in Dukaan adapts to the user's role and urgency:
*   **Cashier:** **Concise & Direct.** Use action-oriented verbs (e.g., 'Submit Sale', 'Void Item'). Avoid preambles.
*   **Branch/Chain Owner:** **Instructional & Strategic.** Provide context for KPIs and 'Rebalance' suggestions. Focus on clarity for decision-making.
*   **Accountant/Admin:** **Precise & Professional.** Use strict technical and financial terminology (e.g., 'Materialized VAT Register', 'Tenant Lifecycle').

## 2. Contextual Visual Aesthetic
The UI style shifts based on the environment:
*   **POS HUD:** **Clean High-Contrast.** Large tap targets, high-legibility fonts, and a 'clean' aesthetic optimized for speed and varied retail lighting.
*   **Owner Dashboards:** **Data-Centric Professional.** High-density layouts using TanStack-style grids and area charts to maximize information visibility.
*   **Admin Console:** **Industrial High-Contrast.** Focus on system 'liveness', health statuses, and infrastructure logs with sharp visual differentiation.

## 3. UX Feedback & Liveness
Maintain user confidence through multi-layered feedback:
*   **Subtle Toasts:** Use for non-critical successes (e.g., 'Invoice Cached', 'Price Updated').
*   **Proactive Progress Bars:** Display during long-running tasks like Inter-Branch Transfers or global price syncs.
*   **Interactive Liveness:** Use subtle UI animations (pulsing sync icons) to show the system is actively processing background tasks.

## 4. AI Interaction Model: 'The Invisible Assistant'
The AI layer should feel like a native part of the UI:
*   **Non-Conversational:** Avoid 'I suggest' or 'I think'. Present AI insights as UI enhancements (e.g., highlighting a recommended stock transfer or pre-filling a search field).
*   **High-Risk Alerts:** Only use assertive language for 'Security Sentinel' alerts (e.g., 'Fraud Risk Detected: High Discount Velocity').
*   **Edge-AI Performance:** AI features must not block the main UI thread, ensuring the 'Zero-Latency' feel of the POS.
