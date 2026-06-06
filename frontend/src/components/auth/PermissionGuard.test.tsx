import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PermissionGuard from './PermissionGuard';
import { useAuth } from '../../context/AuthContext';
import React from 'react';

// Mock useAuth
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('PermissionGuard Component', () => {
  it('renders children if user has required permission', () => {
    (useAuth as any).mockReturnValue({
      hasPermission: vi.fn().mockReturnValue(true),
    });

    render(
      <PermissionGuard permission="test_perm">
        <div data-testid="protected-content">Secret Content</div>
      </PermissionGuard>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('renders nothing if user lacks required permission', () => {
    (useAuth as any).mockReturnValue({
      hasPermission: vi.fn().mockReturnValue(false),
    });

    render(
      <PermissionGuard permission="missing_perm">
        <div data-testid="protected-content">Secret Content</div>
      </PermissionGuard>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });
});
