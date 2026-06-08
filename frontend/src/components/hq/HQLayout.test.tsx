import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import HQLayout from './HQLayout';
import React from 'react';

// Mock recharts
vi.mock('recharts', async () => {
  const OriginalModule = await vi.importActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  };
});

describe('HQLayout', () => {
  it('renders the executive scorecard on the scorecard route', () => {
    render(
      <MemoryRouter initialEntries={['/hq/scorecard']}>
        <Routes>
          <Route path="/hq/*" element={<HQLayout />} />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByText('Executive Scorecard')).toBeInTheDocument();
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
  });
});
