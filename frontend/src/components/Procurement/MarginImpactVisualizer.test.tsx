import { render, screen } from '@testing-library/react';
import MarginImpactVisualizer from './MarginImpactVisualizer';
import { describe, it, expect } from 'vitest';
import React from 'react';

const mockData = [
  { name: 'Item A', before_margin: 20, after_margin: 15 },
  { name: 'Item B', before_margin: 30, after_margin: 25 },
];

describe('MarginImpactVisualizer', () => {
  it('renders correctly', () => {
    render(<MarginImpactVisualizer data={mockData} />);
    expect(screen.getByText(/Retroactive Margin Impact/i)).toBeInTheDocument();
  });

  it('shows margin drop details', () => {
    render(<MarginImpactVisualizer data={mockData} />);
    expect(screen.getAllByText(/5.0%/).length).toBeGreaterThan(0);
  });
});
