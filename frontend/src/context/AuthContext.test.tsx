import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import type { User } from './AuthContext';

// Wrapper for the hook
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext and Permission Shadowing', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('provides null user initially', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user).toBeNull();
  });

  it('stores user in sessionStorage after successful login', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    const mockUser: User = { username: 'cashier1', role: 'POS', tenant: 'T1' };
    
    await act(async () => {
      await result.current.login(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(JSON.parse(sessionStorage.getItem('dukaan_auth') || '{}')).toEqual(mockUser);
  });

  it('correctly reports permissions based on role', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login({ username: 'cashier1', role: 'POS', tenant: 'T1' });
    });

    // Cashier should have POS access but not Strategy Hub
    expect(result.current.hasPermission('access_pos')).toBe(true);
    expect(result.current.hasPermission('access_strategy_hub')).toBe(false);
  });

  it('logs out user if tenant validation fails', async () => {
    // Mock fetch for validation
    const mockFetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 'Suspended' }),
      })
    );
    vi.stubGlobal('fetch', mockFetch);

    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login({ username: 'user1', role: 'POS', tenant: 'T1' });
    });

    expect(result.current.user).not.toBeNull();

    // Trigger validation
    await act(async () => {
      await result.current.validateTenant();
    });

    expect(result.current.user).toBeNull();
    expect(sessionStorage.getItem('dukaan_auth')).toBeNull();
  });

  it('logs out user on SESSION_REVOKED window event', async () => {
    const { result, rerender } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login({ username: 'user1', role: 'POS', tenant: 'T1' });
    });

    expect(result.current.user).not.toBeNull();

    // Trigger simulated socket event
    await act(async () => {
      const event = new CustomEvent('dukaan_session_revoked', { 
        detail: { tenant_id: 'T1' } 
      });
      window.dispatchEvent(event);
    });

    rerender();

    await waitFor(() => {
      expect(result.current.user).toBeNull();
    }, { timeout: 2000 });
    expect(sessionStorage.getItem('dukaan_auth')).toBeNull();
  });
});
