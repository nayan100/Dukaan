# Product Guidelines: Dukaan

## 1. Persona-Based Tone & Voice
The language used in Dukaan adapts to the user's role and urgency:
*   **Cashier:** **Concise & Direct.** Use action-oriented verbs (e.g., 'Submit Sale', 'Void Item'). Avoid preambles.
*   **Branch/Chain Owner:** **Instructional & Strategic.** Provide context for KPIs and 'Rebalance' suggestions. Focus on clarity for decision-making.
*   **Accountant/Admin:** **Precise & Sovereign.** Use strict technical terminology. The tone should feel like an 'Enterprise Intelligence Layer'.

## 2. Contextual Visual Aesthetic
Dukaan follows the **Visual Sovereignty** specification:
*   **Palette:** Deep `Slate-950` backgrounds with `Slate-900` surfaces. High-sophistication `Emerald-500` accents for primary actions.
*   **Glassmorphism:** Use `backdrop-blur-xl` and `bg-surface/50` for modals and sidebars to create depth and hierarchy.
*   **Typography:** Strict adherence to the `Inter` font family with optimized weights (SemiBold/Black) for high legibility in retail environments.
*   **Components:** Refined `12px` border radius (Standard) and `24px` (Premium containers). Shadow-lifts and scale-interactions for all clickable elements.

## 3. UX Feedback & Liveness
Every action must feel 'alive' and responsive:
*   **Subtle Toasts:** Use for non-critical successes (e.g., 'Invoice Cached', 'Price Updated').
*   **Micro-interactions:** Use `framer-motion` for all layout transitions, tab switching, and modal entries.
*   **Animated States:** Pulsing icons for sync and 'Growth' progress bars to communicate active background orchestration.

## 4. AI Interaction Model: 'The Invisible Assistant'
The AI layer should feel like a native part of the UI:
*   **Non-Conversational:** Avoid 'I suggest' or 'I think'. Present AI insights as UI enhancements (e.g., highlighting a recommended stock transfer or pre-filling a search field).
*   **High-Risk Alerts:** Only use assertive language for 'Security Sentinel' alerts (e.g., 'Fraud Risk Detected: High Discount Velocity').
*   **Edge-AI Performance:** AI features must not block the main UI thread, ensuring the 'Zero-Latency' feel of the POS.
