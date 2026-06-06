import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import KPIDashboard from './KPIDashboard';

// Mock ResponsiveContainer as it needs a height/width in JSDOM
vi.mock('recharts', async () => {
  const OriginalModule = await vi.importActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => (
      <div style={{ width: '800px', height: '400px' }}>{children}</div>
    ),
  };
});

describe('KPIDashboard Component', () => {
  it('renders the executive scorecard and branch health', () => {
    render(<KPIDashboard />);
    
    expect(screen.getByText('Chain Strategy Hub')).toBeInTheDocument();
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('NPR 1,25,000')).toBeInTheDocument();
    expect(screen.getByText('KTM Main')).toBeInTheDocument();
  });
});
