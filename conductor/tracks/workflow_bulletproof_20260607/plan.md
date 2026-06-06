# Implementation Plan: Workflow Bulletproofing & Obsidian Sync v2

**Phase 1: Vault Optimization & Noise Reduction**
- [x] Task: Configure Obsidian `Excluded files` to suppress background noise. 598e888
    - [x] Identify or create `.obsidian/app.json`.
    - [x] Inject exclusion patterns for `node_modules`, `__pycache__`, `.git`, `dist`, `build`, and `.pytest_cache`.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Vault Optimization' (Protocol in workflow.md) 1d9a2a7

**Phase 2: Template & MOC Traceability**
- [x] Task: Implement Template Discovery in `conductor-sync.sh`.
    - [x] Update script to locate and read `Templates/Conductor-Task-Template.md`.
    - [x] Replace hardcoded `cat <<EOF` logic with a dynamic parser.
- [x] Task: Implement \"Atlas Lookup\" for bidirectional linking.
    - [x] Create a helper function to grep `_ProjectAtlas.md` for the `TRACK_ID`.
    - [x] Extract the parent MOC (Infrastructure or UI category) and inject it as a metadata link.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Template & MOC Traceability' (Protocol in workflow.md) 9f3303c

**Phase 3: The Advanced Sync Engine (Update Mode)**
- [x] Task: Implement the `--update` flag and state management.
    - [x] Refactor argument parsing to handle flags and positional arguments.
    - [x] Add logic to detect if a note already exists when `--update` is passed.
- [x] Task: Implement Frontmatter & Section Injection. fae4944
    - [x] [TDD] Write shell tests for regex-based frontmatter replacement (status/date).
    - [x] Implement robust logic to append commit SHAs to the `## Outcomes & SHAs` section without duplicate entries.
    - [x] Implement checkbox synchronization for the `## Verification Outcome` section.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Advanced Sync Engine' (Protocol in workflow.md) 692f3fb

**Phase 4: Final Integration & Workflow Polish**
- [ ] Task: Update `conductor/workflow.md` to reflect the new `--update` capabilities.
- [ ] Task: End-to-end integration test of the full loop (Draft -> Sync -> Update -> Verify).
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Integration' (Protocol in workflow.md)
