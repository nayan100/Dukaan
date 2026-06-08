import { describe, it, expect, beforeEach } from 'vitest';
import { useHQStore } from './useHQStore';

describe('useHQStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useHQStore.setState({
      approvalQueue: [],
      wizardState: {
        activeWizard: null,
        step: 0,
        data: {}
      },
      analytics: {
        globalRevenue: 0,
        branchPerformance: []
      }
    });
  });

  it('should initialize with default state', () => {
    const state = useHQStore.getState();
    expect(state.approvalQueue).toEqual([]);
    expect(state.wizardState.activeWizard).toBeNull();
    expect(state.analytics.globalRevenue).toBe(0);
  });

  it('should add and remove items from approval queue', () => {
    const task = { id: '1', type: 'Transfer', title: 'Branch A to B', status: 'pending' as const };
    
    useHQStore.getState().addApprovalTask(task);
    expect(useHQStore.getState().approvalQueue).toContainEqual(task);

    useHQStore.getState().removeApprovalTask('1');
    expect(useHQStore.getState().approvalQueue).not.toContainEqual(task);
  });

  it('should manage wizard state', () => {
    useHQStore.getState().setWizardState('Onboarding', 1, { branchName: 'Test' });
    
    const state = useHQStore.getState();
    expect(state.wizardState.activeWizard).toBe('Onboarding');
    expect(state.wizardState.step).toBe(1);
    expect(state.wizardState.data).toEqual({ branchName: 'Test' });

    useHQStore.getState().clearWizardState();
    expect(useHQStore.getState().wizardState.activeWizard).toBeNull();
  });
});
