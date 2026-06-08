import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GlobalMetricsDashboard from './GlobalMetricsDashboard';
import React from 'react';

// Mock recharts to avoid rendering issues in test environment
vi.mock('recharts', async () => {
  const OriginalModule = await vi.importActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  };
});

describe('GlobalMetricsDashboard', () => {
  it('renders the executive scorecard with metrics', () => {
    render(<GlobalMetricsDashboard />);
    
    expect(screen.getByText('Executive Scorecard')).toBeInTheDocument();
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('Transaction Volume')).toBeInTheDocument();
  });
});
