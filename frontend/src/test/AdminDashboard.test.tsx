import { render, screen } from '@testing-library/react';
import AdminDashboard from '../components/admin/AdminDashboard';
import React from 'react';

describe('AdminDashboard', () => {
  it('renders the admin dashboard shell', () => {
    render(<AdminDashboard />);
    expect(screen.getByText(/SaaS Admin Control Center/i)).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
