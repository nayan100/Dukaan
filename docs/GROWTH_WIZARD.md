# Growth Protocol: Single-to-Chain Transition

This manual explains the technical and operational logic behind the Growth Wizard.

## Phase 1: Entity Scan
The system analyzes your current single-store database. It checks for:
- Existing item master integrity.
- Warehouse structures.
- Historical transaction logs.

## Phase 2: Chain Topology
Dukaan establishes the hierarchical mapping:
- **Default Warehouse** -> Migrated to **Branch 1 (Main)**.
- New **Transit Warehouses** created for every node to support the Inter-Branch Protocol.
- Regional **Naming Series** generated (e.g., KTM-2081-, PKR-2081-).

## Phase 3: Regulatory Shield
The wizard automates IRD (Inland Revenue Department) setup:
- Validation of PAN/VAT details.
- Secure provisioning of CBMS API keys.
- Activation of the Annex 13 Real-time Sync bridge.

## Phase 4: Intelligence Activation
The final phase activates the **Strategy Hub** and the **Edge-AI** layer for predictive search and anomaly detection.

---

**CRITICAL:** Once Phase 4 is finalized, the business is locked into the 'Multi-Branch' operational mode. This action is immutable via the UI.
