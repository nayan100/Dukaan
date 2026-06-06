# Implementation Plan: Workflow Bulletproofing & Obsidian Sync v2

**Phase 1: Vault Optimization & Noise Reduction**
- [ ] Task: Configure Obsidian `Excluded files` to suppress background noise.
    - [ ] Identify or create `.obsidian/app.json`.
    - [ ] Inject exclusion patterns for `node_modules`, `__pycache__`, `.git`, `dist`, `build`, and `.pytest_cache`.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Vault Optimization' (Protocol in workflow.md)

**Phase 2: Template & MOC Traceability**
- [ ] Task: Implement Template Discovery in `conductor-sync.sh`.
    - [ ] Update script to locate and read `Templates/Conductor-Task-Template.md`.
    - [ ] Replace hardcoded `cat <<EOF` logic with a dynamic parser.
- [ ] Task: Implement \"Atlas Lookup\" for bidirectional linking.
    - [ ] Create a helper function to grep `_ProjectAtlas.md` for the `TRACK_ID`.
    - [ ] Extract the parent MOC (Infrastructure or UI category) and inject it as a metadata link.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Template & MOC Traceability' (Protocol in workflow.md)

**Phase 3: The Advanced Sync Engine (Update Mode)**
- [ ] Task: Implement the `--update` flag and state management.
    - [ ] Refactor argument parsing to handle flags and positional arguments.
    - [ ] Add logic to detect if a note already exists when `--update` is passed.
- [ ] Task: Implement Frontmatter & Section Injection.
    - [ ] [TDD] Write shell tests for regex-based frontmatter replacement (status/date).
    - [ ] Implement robust logic to append commit SHAs to the `## Outcomes & SHAs` section without duplicate entries.
    - [ ] Implement checkbox synchronization for the `## Verification Outcome` section.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Advanced Sync Engine' (Protocol in workflow.md)

**Phase 4: Final Integration & Workflow Polish**
- [ ] Task: Update `conductor/workflow.md` to reflect the new `--update` capabilities.
- [ ] Task: End-to-end integration test of the full loop (Draft -> Sync -> Update -> Verify).
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Integration' (Protocol in workflow.md)
