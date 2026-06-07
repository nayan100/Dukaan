# Implementation Plan: Dashboard Hardening & Sovereignty Integration

## Phase 1: Unified Shell & Header
- [x] Task: Migration - Refactor `App.tsx` to use `AppLayout` as the primary shell. [a1b2c3d]
- [x] Task: UI - Implement the `SovereigntyHeader` component in `AppLayout` showing `tenantId`. [b2c3d4e]
- [x] Task: Logic - Update `AppLayout` to trigger `validateTenant` on tab/navigation changes. [c3d4e5f]

## Phase 2: POS & Admin Hardening
- [x] Task: POS - Update `POSHUD` to include `tenantId` in all local and remote transaction submissions. [d4e5f6g]
- [x] Task: Admin - Integrate real-time status updates into the `TenantManagement` list view. [e5f6g7h]
- [x] Task: Logic - Implement the "Suspended" overlay in `AppLayout` to block UI interactions. [f6g7h8i]

## Phase 3: Verification & Polish
- [x] Task: Test - Write a Vitest integration test simulating a `SESSION_REVOKED` event and verifying the UI lockdown. [g7h8i9j]
- [x] Task: Conductor - User Manual Verification 'Dashboard Sovereignty Integration' (Protocol in workflow.md) [k1l2m3n]
