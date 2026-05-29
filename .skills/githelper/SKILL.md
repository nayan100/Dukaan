---
name: githelper
description: Manages project versioning and branching strategy. Ensures a 'main' branch for stable development, a 'prod' branch for deployments, and feature branches for active work. Enforces descriptive commit messages. Use this when the user needs to commit changes, create new features, or prepare a release.
---

# GitHelper: Versioning & Branching Strategy

This skill enforces a structured Git workflow to ensure codebase stability and clear deployment history.

## Branching Strategy

### 1. `main` Branch
- **Purpose**: The most recent, fully working, and tested version of the code.
- **Rule**: Never commit directly to `main` (except for small fixes/updates if appropriate). Use Merge/Pull Requests from feature branches.

### 2. `prod` Branch
- **Purpose**: Reflects the current version of the code deployed in production.
- **Rule**: Only merge from `main` to `prod` when a release is ready.

### 3. Feature Branches (`feat/` or `fix/`)
- **Naming**: `feat/description-of-feature` or `fix/description-of-fix`.
- **Purpose**: Isolated development for new capabilities or bug fixes.
- **Rule**: Created from `main`, merged back into `main` after validation.

## Commit Message Guidelines
Use descriptive, imperative commit messages. Prefer the **Conventional Commits** format:

- `feat: [description]` for new features.
- `fix: [description]` for bug fixes.
- `docs: [description]` for documentation changes.
- `refactor: [description]` for code restructuring.
- `chore: [description]` for maintenance tasks.

**Example**: `feat: add real-time inventory deduction to billing flow`

## Workflows

### Project Initialization
If the project is not yet initialized with the remote:
1. `git init`
2. `git remote add origin git@github.com:nayan100/Dukaan.git`
3. `git fetch origin`

### Starting a New Feature
1. `git checkout main`
2. `git pull origin main`
3. `git checkout -b feat/your-feature-name`

### Finalizing a Feature
1. Ensure all tests pass.
2. `git add .`
3. `git commit -m "feat: [description]"`
4. `git checkout main`
5. `git merge feat/your-feature-name`
6. `git branch -d feat/your-feature-name`

### Deploying to Production
1. `git checkout prod`
2. `git merge main`
3. `git push origin prod`
4. Tag the release: `git tag -a v1.x.x -m "Release version 1.x.x"`

## Best Practices
- **Atomic Commits**: Keep commits small and focused on one change.
- **No Broken Code**: Never commit code that breaks the build to `main` or `prod`.
- **Rebase vs Merge**: Prefer rebasing feature branches against `main` before merging to keep history clean.
