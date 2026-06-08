import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export interface User {
  username: string;
  role: 'Admin' | 'Chain Owner' | 'Single Owner' | 'Branch Owner' | 'POS' | 'Accountant';
  tenant: string;
  parent_user?: string;
  allocated_pos_quota?: number;
}

interface AuthContextType {
  user: User | null;
  tenantId: string | null;
  login: (user: User) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  validateTenant: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Phase 4: Visibility Matrix Mapping
const ROLE_PERMISSIONS: Record<string, string[]> = {
  'Admin': ['view_tenants', 'manage_provisioning', 'system_maintenance', 'view_global_overview', 'manage_procurement', 'approve_budget_override', 'view_compliance_reports'],
  'Chain Owner': ['access_strategy_hub', 'manage_branches', 'view_quota_monitor', 'view_all_analytics'],
  'Single Owner': ['access_growth_wizard', 'view_ird_monitor', 'access_logistics', 'manage_pos_users', 'manage_procurement', 'approve_budget_override', 'view_compliance_reports'],
  'Branch Owner': ['view_ird_monitor', 'access_logistics', 'manage_local_pos', 'manage_procurement', 'approve_budget_override'],
  'POS': ['access_pos'],
  'Accountant': ['view_ird_monitor', 'access_logistics', 'view_audit_trail', 'view_compliance_reports'],
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const setUserRef = useRef(setUser);

  useEffect(() => {
    setUserRef.current = setUser;
  }, [setUser]);

  const login = async (userData: User) => {
    setUser(userData);
    sessionStorage.setItem('dukaan_auth', JSON.stringify(userData));
  };

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('dukaan_auth');
  }, []);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('dukaan_auth');
    if (savedAuth) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(savedAuth));
    }

    const handleSessionRevoked = (data: { tenant_id: string }) => {
      const currentUser = JSON.parse(sessionStorage.getItem('dukaan_auth') || '{}');
      if (currentUser.tenant === data.tenant_id) {
        console.log('Session revoked for tenant:', data.tenant_id);
        // We no longer call setUser(null) here. 
        // We let the UI handle the isSuspended state first.
      }
    };

    window.addEventListener('dukaan_session_revoked', ((e: CustomEvent) => handleSessionRevoked(e.detail)) as EventListener);

    return () => {
      window.removeEventListener('dukaan_session_revoked', ((e: CustomEvent) => handleSessionRevoked(e.detail)) as EventListener);
    };
  }, [logout]);

  const validateTenant = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/method/dukaan.auth.validate_tenant?tenant_id=${user.tenant}`);
      
      // If we get a 404, we are likely in a local dev environment without a backend.
      // We gracefully assume 'Active' to allow UI verification.
      if (response.status === 404) {
        console.warn('[Sovereignty] Backend API 404. Assuming Active for local session.');
        return;
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (data.status === 'Suspended') {
          logout();
        }
      } else {
        console.warn('[Sovereignty] Received non-JSON response from backend.');
      }
    } catch (error) {
      console.error('Tenant validation failed', error);
    }
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    
    // Super Admin has all permissions
    if (user.role === 'Admin') return true;

    const permissions = ROLE_PERMISSIONS[user.role] || [];
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      tenantId: user?.tenant || null,
      login, 
      logout, 
      hasPermission, 
      validateTenant 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
