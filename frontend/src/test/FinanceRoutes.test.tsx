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
  const OriginalModule = await vi.importActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    AreaChart: ({ children }: any) => <div>{children}</div>,
    BarChart: ({ children }: any) => <div>{children}</div>,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
    Area: () => null,
    Bar: () => null,
  };
});

describe('Finance Routes', () => {
  it('redirects Accountant to /finance and shows Sync Monitor', async () => {
    sessionStorage.setItem('dukaan_auth', JSON.stringify({ 
        username: 'acc1', 
        role: 'Accountant', 
        tenant: 'T1' 
    }));

    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    
    // Should render AppLayout sidebar with main Compliance Hub entry
    expect(screen.getByText(/Compliance Hub/i)).toBeInTheDocument();

    // Should render FinanceLayout with internal tabs
    expect(screen.getAllByText(/Sync Monitor/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Purchase Register/i)).toBeInTheDocument();
    expect(screen.getByText(/Audit Hub/i)).toBeInTheDocument();
  });
});
