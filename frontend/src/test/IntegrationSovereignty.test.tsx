import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';

// Mock internal libs
vi.mock('../lib/db', () => ({
  initDB: vi.fn(),
  getUnsyncedInvoices: vi.fn(() => Promise.resolve([])),
}));

vi.mock('../lib/syncWorker', () => ({
  startSyncWorker: vi.fn(),
}));

// Mock framer-motion (sometimes layoutId causes issues in jsdom)
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    aside: ({ children, ...props }: any) => <aside {...props}>{children}</aside>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock fetch for validation calls
vi.stubGlobal('fetch', vi.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ status: 'Active' })
  })
));

describe('Sovereignty Integration', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('shows the lockdown overlay when a revocation event is received', async () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    // 1. Perform Login
    fireEvent.change(screen.getByPlaceholderText(/e.g. T1/i), { target: { value: 'T1' } });
    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'cashier_one' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText(/Login to Sovereign Hub/i));

    // 2. Verify we are in the app with Sovereign header
    await waitFor(() => {
      expect(screen.getByText(/Sovereign: T1/i)).toBeInTheDocument();
    });

    // 3. Simulate Administrative Revocation
    await waitFor(() => {
      const event = new CustomEvent('dukaan_session_revoked', { 
        detail: { tenant_id: 'T1' } 
      });
      window.dispatchEvent(event);
    });

    // 4. Verify Lockdown Overlay
    await waitFor(() => {
      expect(screen.getByText(/Sovereignty Revoked/i)).toBeInTheDocument();
      // Use getAllByText since T1 appears in header AND overlay
      expect(screen.getAllByText(/T1/i).length).toBeGreaterThan(0);
    });

    // 5. Verify Logout from Overlay
    fireEvent.click(screen.getByText(/Log Out of Session/i));
    
    await waitFor(() => {
      expect(screen.getByText(/Login to Sovereign Hub/i)).toBeInTheDocument();
    });
  });

  it('triggers validate_tenant when switching tabs', async () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    // Login as Chain Owner to see Strategy Hub
    fireEvent.change(screen.getByPlaceholderText(/e.g. T1/i), { target: { value: 'T1' } });
    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'owner_one' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Chain Owner' } });
    fireEvent.click(screen.getByText(/Login to Sovereign Hub/i));

    await waitFor(() => {
      expect(screen.getByText(/Strategy Hub/i)).toBeInTheDocument();
    });

    // track fetch calls
    const fetchSpy = vi.spyOn(window, 'fetch');

    // Switch Tab to Strategy Hub
    fireEvent.click(screen.getByText(/Strategy Hub/i));

    // Verify validate_tenant was called
    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('validate_tenant?tenant_id=T1'));
    });
  });
});
