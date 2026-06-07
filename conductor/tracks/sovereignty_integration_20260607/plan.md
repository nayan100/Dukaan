# Implementation Plan: Dashboard Hardening & Sovereignty Integration

## Phase 1: Unified Shell & Header
- [ ] Task: Migration - Refactor `App.tsx` to use `AppLayout` as the primary shell.
- [ ] Task: UI - Implement the `SovereigntyHeader` component in `AppLayout` showing `tenantId`.
- [ ] Task: Logic - Update `AppLayout` to trigger `validateTenant` on tab/navigation changes.

## Phase 2: POS & Admin Hardening
- [ ] Task: POS - Update `POSHUD` to include `tenantId` in all local and remote transaction submissions.
- [ ] Task: Admin - Integrate real-time status updates into the `TenantManagement` list view.
- [ ] Task: Logic - Implement the "Suspended" overlay in `AppLayout` to block UI interactions.

## Phase 3: Verification & Polish
- [ ] Task: Test - Write a Vitest integration test simulating a `SESSION_REVOKED` event and verifying the UI lockdown.
- [ ] Task: Conductor - User Manual Verification 'Dashboard Sovereignty Integration'
