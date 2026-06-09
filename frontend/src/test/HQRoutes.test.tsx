import { render, screen } from '@testing-library/react';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';

// Mocking internal libs
vi.mock('../lib/db', () => ({
  initDB: vi.fn(),
  getUnsyncedInvoices: vi.fn(() => Promise.resolve([])),
  saveInvoiceOffline: vi.fn(),
  markInvoiceSynced: vi.fn(),
  getAllInvoices: vi.fn(() => Promise.resolve([])),
}));

vi.mock('../lib/syncWorker', () => ({
  startSyncWorker: vi.fn(),
}));

// Mock recharts
vi.mock('recharts', async () => {
  return {
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    AreaChart: ({ children }: any) => <div>{children}</div>,
    BarChart: ({ children }: any) => <div>{children}</div>,
    RadarChart: ({ children }: any) => <div>{children}</div>,
    PolarGrid: () => null,
    PolarAngleAxis: () => null,
    Radar: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
    Area: () => null,
    Bar: () => null,
  };
});

describe('HQ Routes', () => {
  it('renders all HQ sub-routes for Chain Owner', async () => {
    sessionStorage.setItem('dukaan_auth', JSON.stringify({ 
        username: 'owner1', 
        role: 'Chain Owner', 
        tenant: 'T1' 
    }));

    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    
    expect(screen.getByText(/Executive Scorecard/i)).toBeInTheDocument();
  });

  it('renders Branch Management on /hq/branches', async () => {
    sessionStorage.setItem('dukaan_auth', JSON.stringify({ 
        username: 'owner1', 
        role: 'Chain Owner', 
        tenant: 'T1' 
    }));

    window.history.pushState({}, 'Branches', '/hq/branches');

    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    
    expect(screen.getByText(/Branch Architecture/i)).toBeInTheDocument();
  });

  it('renders User Management on /hq/users', async () => {
    sessionStorage.setItem('dukaan_auth', JSON.stringify({ 
        username: 'owner1', 
        role: 'Chain Owner', 
        tenant: 'T1' 
    }));

    window.history.pushState({}, 'Users', '/hq/users');

    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    
    expect(screen.getByText(/Personnel Command/i)).toBeInTheDocument();
  });

  it('renders Comparative Analytics on /hq/analytics', async () => {
    sessionStorage.setItem('dukaan_auth', JSON.stringify({ 
        username: 'owner1', 
        role: 'Chain Owner', 
        tenant: 'T1' 
    }));

    window.history.pushState({}, 'Analytics', '/hq/analytics');

    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    
    expect(screen.getByText(/Branch Performance Matrix/i)).toBeInTheDocument();
  });

  it('renders Pricing Wizard on /hq/pricing', async () => {
    sessionStorage.setItem('dukaan_auth', JSON.stringify({ 
        username: 'owner1', 
        role: 'Chain Owner', 
        tenant: 'T1' 
    }));

    window.history.pushState({}, 'Pricing', '/hq/pricing');

    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    
    expect(screen.getByText(/Global Pricing Wizard/i)).toBeInTheDocument();
  });
});
