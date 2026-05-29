# GEMINI.md - Sellpoint Project

## Project Overview
**Sellpoint** is a new project directory located at `/home/gunmetal/nayan/sellpoint`. This folder is configured as an **Obsidian Vault** for integrated documentation and visualization.

## Project Type
- **Current State:** Initialized (Obsidian Vault enabled)
- **Inferred Type:** Code Project with heavy emphasis on documentation.

## Directory Structure
```text
/home/gunmetal/nayan/sellpoint/
├── .obsidian/          # Obsidian configuration
├── .skills/            # Local skill development
├── Documentation/      # Project documentation root
│   ├── Architecture/   # System diagrams (Mermaid)
│   ├── Changelogs/     # Version history
│   └── Flows/          # Process maps
└── GEMINI.md           # Project instructions and context
```

## Key Files
- **GEMINI.md**: This file.
- **.obsidian/obsidian-vault-config.md**: Guidance for Obsidian plugins and setup.

## Skills & Capabilities
- **obsidian-docs**: (User Scope) Provides specialized workflows for creating changelogs, Mermaid diagrams (flowcharts, architecture), and charts within the Obsidian vault.
- **githelper**: (User Scope) Enforces a Git branching strategy (`main`, `prod`, `feat/`) and descriptive, conventional commit messages for robust versioning.

## Building and Running
*No build or run scripts are currently available.*

- **TODO:** Initialize the project (e.g., `npm init`, `git init`).
- **TODO:** Start documenting architecture in `Documentation/Architecture/`.

## Development Conventions
1. **Documentation First**: All major features should have a corresponding architectural diagram or flow map in the `Documentation/` directory.
2. **Visuals**: Use Mermaid.js syntax for all diagrams to ensure they are renderable within Obsidian.
3. **Changelogs**: Maintain a strict version history in `Documentation/Changelogs/`.

## Usage
Currently, this directory serves as the root for the Sellpoint project. Use standard terminal commands to begin scaffolding the application.
