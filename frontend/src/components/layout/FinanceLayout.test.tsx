import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import FinanceLayout from './FinanceLayout';
import React from 'react';

describe('FinanceLayout', () => {
  it('renders the sidebar navigation items', () => {
    render(
      <MemoryRouter initialEntries={['/finance/sync']}>
        <Routes>
          <Route path="/finance/*" element={<FinanceLayout />} />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByText('Sync Monitor')).toBeInTheDocument();
    expect(screen.getByText('Purchase Register')).toBeInTheDocument();
    expect(screen.getByText('Valuation & Audit')).toBeInTheDocument();
  });
});
