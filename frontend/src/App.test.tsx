import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';

// Mocking internal libs
vi.mock('./lib/db', () => ({
  initDB: vi.fn(),
  getUnsyncedInvoices: vi.fn(() => Promise.resolve([])),
  saveInvoiceOffline: vi.fn(),
  markInvoiceSynced: vi.fn(),
}));

vi.mock('./lib/syncWorker', () => ({
  startSyncWorker: vi.fn(),
}));

describe('App', () => {
  it('renders the main AppLayout and defaults to POS', async () => {
    // Mock user login
    sessionStorage.setItem('dukaan_auth', JSON.stringify({ 
        username: 'testuser', 
        role: 'Cashier', 
        tenant: 'T1' 
    }));

    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    
    // Check for AppLayout content (Sidebar)
    expect(screen.getByText(/Dukaan/i)).toBeInTheDocument();
    expect(screen.getByText(/Point of Sale/i)).toBeInTheDocument();
    
    // Check that POSHUD is rendered by default
    expect(screen.getByText(/Wai Wai Noodles/i)).toBeInTheDocument();
  });
});
