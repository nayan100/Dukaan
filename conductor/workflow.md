# Conductor Operator's Manual

## 1. Guiding Principles
- **Plan = Truth:** All work MUST be tracked in `plan.md`.
- **Tech Stack:** Document changes in `tech-stack.md` BEFORE implementing.
- **TDD:** Write failing tests first (Red), implement (Green), then Refactor.
- **Coverage:** Target >80% for all new logic.
- **CI-Aware:** Use non-interactive commands (e.g., `CI=true`).

## 2. Standard Task Lifecycle
| Step | Action | Tool/Command |
| :--- | :--- | :--- |
| **1. Select** | Choose next `[ ]` task from `plan.md`. | `read_file` |
| **2. Start** | Mark task as `[~]` in `plan.md`. | `replace` |
| **3. Red** | Create/run failing test. | `pytest` / `vitest` |
| **4. Green** | Implement minimum code to pass. | `write_file` / `replace` |
| **5. Refactor** | Clean code/tests; ensure pass. | - |
| **6. Sync** | Update `plan.md` and Git Notes. | `conductor-sync.sh --update` |
| **7. Done** | Mark task as `[x] <sha7>` in `plan.md`. | `replace` |

## 3. Phase Checkpoint Protocol
*Triggered on completion of a Plan Phase.*
1. **Audit:** `git diff --name-only <prev_checkpoint> HEAD`.
2. **Verify:** Ensure tests exist for all changed code files.
3. **Run:** Execute full test suite (`CI=true`).
4. **Manual:** Present step-by-step verification plan to user.
5. **Checkpoint:** `git commit --allow-empty -m "conductor(checkpoint): Phase X"`.
6. **Report:** Attach test results/manual logs to checkpoint commit via `git notes`.

## 4. Quality Gates (Pre-Completion)
- [ ] All tests pass.
- [ ] Coverage >80%.
- [ ] No linting/type errors.
- [ ] Documentation/Types updated.
- [ ] Mobile/Responsive verified (if UI).

## 5. Commit Guidelines
**Format:** `<type>(<scope>): <description>`
- `feat`: New feature | `fix`: Bug fix | `docs`: Documentation | `refactor`: Logic update | `test`: Adding tests.
- **Git Notes:** Use `git notes add -m "<summary>"` to attach task context to every commit.

## 6. Emergency & Deployment
- **Hotfix:** Branch from `main` -> Failing test -> Fix -> Deploy.
- **Pre-Deploy:** Tests pass -> Coverage check -> Backup -> Migration check.
