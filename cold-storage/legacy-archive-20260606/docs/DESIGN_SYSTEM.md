# Design System: Visual Sovereignty

Dukaan follows a **Visual Sovereignty** philosophy: professional depth, high legibility, and premium operational feedback.

## 1. Color Palette
| Token | HEX | Usage |
| :--- | :--- | :--- |
| `pos-black` | `#020617` | Background / Depth |
| `pos-surface` | `#0f172a` | Cards / Sidebars |
| `pos-primary` | `#10b981` | Success / Emerald |
| `pos-secondary`| `#f59e0b` | Warnings / Amber |
| `pos-danger` | `#ef4444` | Errors / Voids |
| `pos-border` | `#1e293b` | Structural borders |

## 2. Typography
- **Primary Font:** Inter (Google Fonts)
- **Scale:** 
  - `Base`: 14px (Standard UI)
  - `Large`: 18px (Metric titles)
  - `XL`: 24px (Sub-headers)
  - `2XL`: 32px (KPI Main Values)
  - `4XL`: 48px (Dashboard headers)

## 3. UI Principles
- **Radius:** `12px` (Standard) / `24px` (Large cards).
- **Glassmorphism:** Modals use `backdrop-blur-xl` with `bg-pos-surface/50`.
- **Transitions:** All state changes must use `framer-motion` with `duration: 0.3` and `easeOut`.

## 4. Components
- **Buttons:** Shadow-lift on hover, scale-in on click.
- **Grids:** Interactive hover-states with border-color transitions.
- **Toasts:** Dark-themed with prominent status icons.
