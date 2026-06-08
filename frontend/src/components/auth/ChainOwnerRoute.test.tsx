import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ChainOwnerRoute from './ChainOwnerRoute';
import { useAuth } from '../../context/AuthContext';
import React from 'react';

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('ChainOwnerRoute', () => {
  it('redirects to / when user is not Chain Owner', () => {
    (useAuth as any).mockReturnValue({
      user: { role: 'POS' }
    });

    render(
      <MemoryRouter initialEntries={['/hq']}>
        <Routes>
          <Route path="/hq" element={
            <ChainOwnerRoute>
              <div>HQ Content</div>
            </ChainOwnerRoute>
          } />
          <Route path="/" element={<div>Home/Redirect</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('HQ Content')).not.toBeInTheDocument();
    expect(screen.getByText('Home/Redirect')).toBeInTheDocument();
  });

  it('renders content when user is Chain Owner', () => {
    (useAuth as any).mockReturnValue({
      user: { role: 'Chain Owner' }
    });

    render(
      <MemoryRouter initialEntries={['/hq']}>
        <Routes>
          <Route path="/hq" element={
            <ChainOwnerRoute>
              <div>HQ Content</div>
            </ChainOwnerRoute>
          } />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('HQ Content')).toBeInTheDocument();
  });
});