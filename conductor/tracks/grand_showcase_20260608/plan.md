# Track: The Grand Showcase (Sovereignty & Flow)

## 1. Objective
Transform the project from a collection of isolated modules into a touchable, end-to-end "Showcase" that proves sovereignty, persona-based workflows, and the "Item Odyssey" lifecycle.

## 2. Personas & Credentials
| Persona | Business | Role | Primary Hub |
| :--- | :--- | :--- | :--- |
| **SaaS Admin** | Platform | Superuser | SaaS Control Center |
| **Chain Owner** | Everest Groceries | owner | Growth & KPI Hub |
| **Branch Manager** | Everest - KTM | manager | Branch Suite |
| **Cashier** | Everest - KTM | cashier | POS HUD |
| **Accountant** | Everest - KTM | accountant | Compliance Hub |

## 3. The "Item Odyssey" Flow
1. **Creation:** Chain Owner defines `G-COFFEE-01` (Organic Coffee).
2. **Stocking:** Branch Manager runs PO -> Receipt (100 qty).
3. **Movement:** Branch Manager PKR requests 10 qty from KTM (Inter-Branch).
4. **Sale:** Cashier KTM sells 2 qty via POS.
5. **Audit:** Accountant verifies VAT Annex 13 & IRD Sync.

## 4. Implementation Plan

### Phase 1: Data Genesis (Backend) [ ]
- [x] Create `scripts/seed_showcase.py`.
- [x] Provision `Tenant: Everest Groceries` and `Tenant: Annapurna Apparel`.
- [x] Seed Items, Suppliers, Warehouses, and Users for both.
- [x] Fabricate 6 months of historical Sales/Purchase data for analytics.

### Phase 2: Persona Portal (Frontend) [ ]
- [x] Create `LandingPage.tsx` with persona-switcher cards.
- [x] Inject demo credentials into `AuthContext` for "One-Click" entry.

### Phase 3: The Manual Walkthrough [ ]
- [x] Create `DEMO_WALKTHROUGH.md` with step-by-step instructions.

### Phase 4: Phoenix Reset Protocol [ ]
- [x] Create `scripts/reset_demo.sh` to purge and re-seed the DB.

## 5. Verification
- [x] All 94 existing tests must pass.
- [x] Manual walkthrough completed without errors.
- [x] Cross-tenant data leak test (Everest cannot see Annapurna).

## Phase: Review Fixes
- [x] Apply review suggestions 95b4d6a

## Phase: Manual Q&A Verification
- [x] Complete manual verification for all changes in question/answer mode
