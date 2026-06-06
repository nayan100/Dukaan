# Specification: Obsidian Sync Integration

## Overview
This track integrates the project documentation with the existing Obsidian vault, establishing a "living documentation" system for the entire project structure. This will improve maintainability, visualization, and traceability by linking Obsidian to the Conductor workflow.

## Functional Requirements
- Establish a centralized `Templates/` folder in Obsidian for Project Modules, Conductor Tasks, and Emergency Incidents.
- **Base Documentation Structure:**
    - Initialize `_ProjectAtlas.md` with base MOCs for core Conductor files (`product.md`, `tech-stack.md`, `workflow.md`).
    - Mirror project directory structure in `_ProjectAtlas.md` with MOC notes for Backend, Frontend, and Conductor.
- **Mapping Existing Assets:**
    - **Audit & Classify:**
        - `conductor/archive/`: Treat as historical reference. Classify and summarize in `_ProjectAtlas.md` archives section.
        - Legacy wiki/documentation: Audit, classify (`Keep-Migrated`, `Keep-As-Archive`, `To-Be-Verified`).
    - Apply `Project-Module-Template` and map to `_ProjectAtlas.md`.
    - Rename and structure according to Conductor conventions.
- **Migration Strategy Options:**
    - *Gradual Migration:* Migrate documentation per track as they are updated or created.
    - *Full Inventory First:* Map and migrate all legacy assets at once before proceeding with new developments.
- **Future-Proofing & Maintenance:**
    - Establish a "Documentation-as-Code" pipeline in Obsidian.
    - Automated check for link integrity between Obsidian and project codebase.
    - Monthly audit of MOCs against current project directory structure.
- **Rigorous Validation Protocol:**
    - Implement checksum-based verification for all copied assets during migration.
    - Mandatory "No-Deletion" policy: legacy data must be moved to `cold-storage/` instead of deleted.
    - Verification report required for every migrated module.
- Create system-wide architectural visualizations in `Advanced Canvas`.
- Automate task-to-note linking for Conductor tasks.
- Implement weekly maintenance review in Obsidian Calendar plugin.

## Non-Functional Requirements
- Maintain Conductor as the "Source of Truth."
- Ensure bidirectional linking between Obsidian and project files.
- Adhere to the "Zero-Loss Migration Protocol" (copy-verify-archive).

## Acceptance Criteria
- [ ] Templates folder created and functional in Obsidian.
- [ ] `_ProjectAtlas.md` initialized with base Conductor MOCs and directory MOCs.
- [ ] `conductor/archive/` assets summarized and linked in `_ProjectAtlas.md`.
- [ ] Legacy assets audited and classified per `Zero-Loss Migration Protocol`.
- [ ] Checksum verification report generated for all migrated assets.
- [ ] Migration strategy selected and documented.
- [ ] Future-proofing maintenance routine established.
- [ ] High-level architecture mapped in `Advanced Canvas`.
- [ ] Conductor tasks successfully linked to Obsidian notes via `Conductor-Task-Template`.
- [ ] Weekly review process established in Obsidian Calendar.
- [ ] All documentation synchronized according to defined standards.

## Out of Scope
- Automated code-to-docs generation (manual mapping is required).
- Third-party integrations beyond existing Obsidian plugins.