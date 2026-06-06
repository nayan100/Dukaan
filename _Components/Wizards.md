---
type: module
path: _Components
created: 2026-06-06
tags: [project/module, ui, workflow]
---
# Module: Growth Wizards

## Overview
A set of automated, step-by-step workflows that simplify complex orchestration tasks for Chain Owners, such as onboarding a new branch or initializing stock.

## Technical Details
- **Source Path:** `frontend/src/components/wizards/OnboardingWizard.tsx`
- **Related Tests:** `frontend/src/components/wizards/OnboardingWizard.test.tsx`
- **Tech Stack Ref:** [[conductor/tech-stack|Tech Stack]]

## Architecture Notes
- **Interactive Protocols:** Guides users through mandatory setup steps (Warehouse mapping, IRD registration).
- **Single-to-Chain Transition:** Automates the migration of local stock to a multi-branch hierarchy.
- **Workflow Guards:** Prevents moving to subsequent steps until compliance and technical prerequisites are met.

## Key Logic
- [[conductor/archive/setup_pos_core_20260606/index|POS Core Setup Track]]
- [[conductor/product#6.-lifecycle-wizards|Lifecycle Wizards]]

## Review History
- Last Reviewed: 2026-06-07
