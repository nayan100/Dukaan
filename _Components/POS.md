---
type: module
path: _Components
created: 2026-06-06
tags: [project/module, ui, pos]
---
# Module: POS HUD

## Overview
The "Visual Sovereignty" optimized billing interface for cashiers. It features a zero-latency "Speed Grid" and robust offline resilience.

## Technical Details
- **Source Path:** `frontend/src/components/pos/POSHUD.tsx`
- **Related Tests:** `frontend/src/components/pos/POSHUD.test.tsx`
- **Tech Stack Ref:** [[conductor/tech-stack|Tech Stack]]

## Architecture Notes
- **Speed Grid:** High-contrast item selection and quantity management.
- **Split-Payment:** Supports Cash, Card, and Fonepay QR payments.
- **Offline Resilience:** Uses IndexedDB and localStorage (secondary) for persistent storage during outages.
- **Autonomous Void:** 60-second window for cashiers to self-correct errors before administrative lock.

## Key Logic
- [[conductor/archive/setup_pos_core_20260606/index|POS Core Setup Track]]
- [[_Components/DESIGN_SYSTEM|Design System]]

## Review History
- Last Reviewed: 2026-06-07
