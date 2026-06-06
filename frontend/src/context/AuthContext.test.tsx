import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import React from 'react';

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
    
    const mockUser = { username: 'cashier1', role: 'Cashier', tenant: 'T1' };
    
    await act(async () => {
      await result.current.login(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(JSON.parse(sessionStorage.getItem('dukaan_auth') || '{}')).toEqual(mockUser);
  });

  it('correctly reports permissions based on role', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login({ username: 'cashier1', role: 'Cashier', tenant: 'T1' });
    });

    // Cashier should have POS access but not Strategy Hub
    expect(result.current.hasPermission('access_pos')).toBe(true);
    expect(result.current.hasPermission('access_strategy_hub')).toBe(false);
  });
});
