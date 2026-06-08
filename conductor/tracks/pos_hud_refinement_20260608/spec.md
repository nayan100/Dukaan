# Specification: The Cashier POS HUD ("Zero-Latency Interface")

## Overview
Track 2 of the Grand Showcase Roadmap. Refines the POS into a high-fidelity interface with keyboard-first operation and introduces a cross-branch return protocol.

## Functional Requirements

### 1. Keyboard-First Operation
*   **Search Activation**: `F1` or `/` to focus the product catalog search.
*   **Checkout Flow**: `Enter` to initiate payment; `Esc` to cancel/close.
*   **Rapid Adjustment**: `+` and `-` keys adjust the quantity of the last-added item in the cart (if within the void window).

### 2. Visual "Autonomous Void" HUD
*   **Visual Countdown**: Every item in the sidebar displays a ticking timer starting from 60s.
*   **Progress Bar**: A shrinking emerald line at the base of each card.
*   **Visual Lock**: After 60s, the "Void" button is hidden and replaced by a "Locked" padlock icon.
*   **Warning State**: Subtle amber pulsing when timer < 10s.

### 3. Fonepay Polling & Manual Override
*   **Polling Logic**: Simulated status checks every 3s when digital payment is active.
*   **Manual Intervention**: After 30s of polling, reveal a "Manual Verify" button.
*   **Audit Trail**: Manual overrides must log a `manual_intervention` flag to IndexedDB.

### 4. Sync Pulse Indicator
*   **Heartbeat UI**: Dedicated pulsing icon in the POS Header.
*   **Store Binding**: Bind UI state to `useSyncStore`:
    *   Green: Online & Synced.
    *   Amber: Offline (Caching mode).
    *   Blue: Syncing in progress.

### 5. Multi-Branch Item Return Wizard
*   **Button**: Dedicated "Process Return" button in the HUD.
*   **Wizard Flow**:
    *   **Input**: Prompt for Invoice ID.
    *   **Validate**: Verify ID against storage; retrieve item list.
    *   **Selection**: Cashier selects items to return.
    *   **Resolution**: Upon success, increment `useInventoryStore` stock levels and log the return.

## Design Constraints
*   **Palette**: Strict adherence to Slate-950 background, Emerald-500 accents.
*   **Feedback**: Animated transitions for all modal states and locking mechanisms.

## Acceptance Criteria
*   [ ] Demonstrate full hands-on-keyboard sale: `/` -> Type -> `Enter` -> `Enter` -> `Enter` (Complete).
*   [ ] Cart items show active countdowns that visually "lock" (Void button disappears) after 60s.
*   [ ] Fonepay polling simulated and manual bypass functional.
*   [ ] Heartbeat reflects store state in real-time.
*   [ ] Successfully process a return by ID and observe inventory increment.
