import { render, screen, fireEvent } from '@testing-library/react';
import AdminDashboard from '../components/admin/AdminDashboard';
import React from 'react';

describe('AdminDashboard', () => {
  it('renders the admin dashboard shell', () => {
    render(<AdminDashboard />);
    expect(screen.getByText(/SaaS Admin/i)).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('switches to tenants tab when clicked', () => {
    render(<AdminDashboard />);
    const tenantsBtn = screen.getByText('Tenants');
    fireEvent.click(tenantsBtn);
    expect(screen.getByText(/Tenant Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Metro Retail/i)).toBeInTheDocument();
  });

  it('can toggle tenant status in detail view', () => {
    render(<AdminDashboard />);
    fireEvent.click(screen.getByText('Tenants'));
    
    // Select Metro Retail
    fireEvent.click(screen.getByText('Metro Retail'));
    
    // Check if details are shown
    expect(screen.getByText(/Tenant Details/i)).toBeInTheDocument();
    expect(screen.getByText(/metro.dukaan.io/i)).toBeInTheDocument();
    
    // Suspend
    const suspendBtn = screen.getByText('Suspend Tenant');
    fireEvent.click(suspendBtn);
    
    // Should now show Activate Tenant
    expect(screen.getByText('Activate Tenant')).toBeInTheDocument();
  });
});
