import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  role: string;
  tenant: string;
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

// Persona Matrix Mapping
const ROLE_PERMISSIONS: Record<string, string[]> = {
  'SaaS Admin': ['access_admin_panel', 'manage_tenants', 'view_all_analytics'],
  'Chain Owner': ['access_strategy_hub', 'access_growth_wizard', 'view_branch_analytics', 'trigger_rebalance'],
  'Branch Owner': ['access_branch_dashboard', 'manage_local_inventory', 'approve_maintenance'],
  'Cashier': ['access_pos', 'process_sale', 'autonomous_void_60s'],
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('dukaan_auth');
    if (savedAuth) {
      setUser(JSON.parse(savedAuth));
    }
  }, []);

  const login = async (userData: User) => {
    setUser(userData);
    sessionStorage.setItem('dukaan_auth', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('dukaan_auth');
  };

  const validateTenant = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/method/dukaan.auth.validate_tenant?tenant_id=${user.tenant}`);
      const data = await response.json();
      
      if (data.status === 'Suspended') {
        logout();
      }
    } catch (error) {
      console.error('Tenant validation failed', error);
    }
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    
    // Super Admin has all permissions
    if (user.role === 'SaaS Admin') return true;

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
