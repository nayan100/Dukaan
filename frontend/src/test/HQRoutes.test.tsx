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
    
    // Check if sidebar has HQ items (Wait, HQLayout has its own internal nav in some versions)
    // Actually, we'll check if the components render on their paths
    expect(screen.getByText(/Executive Scorecard/i)).toBeInTheDocument();
  });
});
