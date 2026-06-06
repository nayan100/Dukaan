# Specification: Workflow Bulletproofing & Obsidian Sync v2

## Overview
This track focuses on closing the loop between the Conductor CLI and the Obsidian Vault. It transforms the `conductor-sync.sh` script from a simple placeholder generator into a robust synchronization engine that maintains "Living Documentation" with bidirectional traceability.

## Functional Requirements
- **Upgraded Sync Script:**
    - Support for an `--update` flag to refresh existing task notes.
    - Automated updates to YAML frontmatter (status, updated date).
    - Intelligent injection of commit SHAs and verification outcomes into the `## Outcomes & SHAs` section.
    - Synchronizing `[ ]` checkboxes for verification status.
- **Template Unification:**
    - The script will read directly from `Templates/Conductor-Task-Template.md` within the vault as the single source of truth for formatting.
- **Bidirectional Traceability:**
    - The script will perform an \"Atlas Lookup\" using the Track ID to automatically infer and inject links to the corresponding System or Component MOC (e.g., `[[_Systems/Compliance]]`).
- **Vault Noise Reduction:**
    - Automated configuration to exclude high-noise directories from the Obsidian Vault, including `node_modules`, `__pycache__`, `.git`, build directories (`dist/`, `build/`), and test caches (`.pytest_cache`).

## Non-Functional Requirements
- **Performance:** Synchronization should complete in under 2 seconds for a standard task.
- **Idempotency:** Running the sync script multiple times on the same task should not duplicate data.

## Acceptance Criteria
- [ ] Running `./conductor-sync.sh --update <track_id> <task_name>` correctly appends the latest commit SHA and updates the note status.
- [ ] New task notes automatically include a wikilink back to the relevant System/Component MOC.
- [ ] Obsidian Graph View is noticeably cleaner after noise directory exclusion.
- [ ] The script correctly uses the Obsidian template for all new note generation.

## Out of Scope
- Automated creation of new System/Component MOCs.
- Synchronization of non-task documentation (e.g., product specs).
