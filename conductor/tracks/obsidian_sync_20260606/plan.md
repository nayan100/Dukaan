# Implementation Plan: Obsidian Sync Integration (Deep Edition)

## Phase 1: The "Digital Twin" Infrastructure (Standardization)
- [x] Task: Create `_Systems/` folder for backend logic and `_Components/` for frontend UI. 80b6877
- [x] Task: Configure `Templater` for "Auto-Pathing": New notes created via MOCs must automatically be filed in the correct project sub-directory. ab0ff4b
- [x] Task: Initialize `_ProjectAtlas.md` with "Dynamic Queries" or fixed MOCs representing logical layers (Auth, Inventory, Compliance). e769e97
- [ ] Task: Conductor - User Manual Verification 'Infrastructure Readiness' (Protocol in workflow.md)

## Phase 2: The "Vault of Truth" (Zero-Loss Migration)
- [ ] Task: Scripted Phase 0: Create a verifiable snapshot with a `MANIFEST.json` containing SHA-256 hashes of all source files.
- [ ] Task: "Gap Analysis": Identify legacy wiki sections with NO corresponding code (Zombie Docs) and mark for review.
- [ ] Task: Execute migration using non-destructive copy logic to preserve metadata.
- [ ] Task: Post-Migration Audit: Automated script to compare `MANIFEST.json` against new Obsidian Vault structure.
- [ ] Task: Create `cold-storage/` for legacy source directories.
- [ ] Task: Conductor - User Manual Verification 'Data Integrity Audit' (Protocol in workflow.md)

## Phase 3: High-Fidelity Visualization (The Advanced Canvas)
- [ ] Task: Create a `Product Command Center` Canvas linking Product Definition, Tracks, and Plans.
- [ ] Task: Create `The Data Flow` Canvas visualizing POS -> API -> IRD sequence.
- [ ] Task: Implement "Live Links": Embed markdown blocks from `spec.md` into Advanced Canvas.
- [ ] Task: Conductor - User Manual Verification 'Visualization Fidelity' (Protocol in workflow.md)

## Phase 4: Workflow Enshrinement (Conductor Sync)
- [ ] Task: Update `conductor/workflow.md` with a mandatory "Sync Check" rule.
- [ ] Task: Create a `conductor-sync.sh` helper script for automated note placeholder creation.
- [ ] Task: Configure `Obsidian Calendar` to track "Review Checkpoints" as events.
- [ ] Task: Conductor - User Manual Verification 'Workflow Automation' (Protocol in workflow.md)