import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from '../components/admin/AdminDashboard';
import React from 'react';

const renderWithRouter = (initialEntries = ['/admin']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('AdminDashboard', () => {
  it('renders the admin dashboard overview by default', () => {
    renderWithRouter(['/admin']);
    expect(screen.getByText(/Dashboard Overview/i)).toBeInTheDocument();
  });

  it('renders tenants tab when navigating to /admin/tenants', () => {
    renderWithRouter(['/admin/tenants']);
    expect(screen.getByText(/Tenant Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Everest Groceries/i)).toBeInTheDocument();
  });

  it('can toggle tenant status in detail view', () => {
    renderWithRouter(['/admin/tenants']);
    
    // Select Everest Groceries
    fireEvent.click(screen.getByText('Everest Groceries'));
    
    // Check if details are shown
    expect(screen.getByText(/Sovereignty Control/i)).toBeInTheDocument();
    
    // Suspend (Revoke Sovereignty)
    const revokeBtn = screen.getByText('Revoke Sovereignty');
    fireEvent.click(revokeBtn);
    
    // Should now show Restore Sovereignty
    expect(screen.getByText('Restore Sovereignty')).toBeInTheDocument();
  });

  it('renders monitoring tab when navigating to /admin/monitoring', () => {
    renderWithRouter(['/admin/monitoring']);
    expect(screen.getByText(/Monitoring Hub/i)).toBeInTheDocument();
    expect(screen.getByText(/Branch Activity/i)).toBeInTheDocument();
  });

  it('opens onboarding wizard when clicking New Tenant', () => {
    renderWithRouter(['/admin/tenants']);
    fireEvent.click(screen.getByText('+ New Tenant'));
    expect(screen.getByText(/Provision New Tenant/i)).toBeInTheDocument();
  });
});
