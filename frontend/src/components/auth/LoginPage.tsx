import React, { useState } from 'react';
import { ShieldCheck, User, Lock, Hash, Shield } from 'lucide-react';
import Button from '../ui/Button';

interface LoginPageProps {
  onLogin: (credentials: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [tenantId, setTenantId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Cashier');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login by mapping form data to the User interface
    onLogin({ 
      tenant: tenantId, 
      username, 
      role 
    });
  };

  return (
    <div className="min-h-screen bg-pos-black flex items-center justify-center p-6 selection:bg-pos-primary/30">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-pos-primary/10 rounded-2xl flex items-center justify-center mx-auto border-2 border-pos-primary/30 shadow-2xl shadow-pos-primary/10 mb-6">
            <ShieldCheck size={40} className="text-pos-primary" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-pos-white">Dukaan Sovereign</h1>
          <p className="text-pos-muted font-medium mt-2">Enterprise Scale Intelligence Hub</p>
        </div>

        {/* Card */}
        <div className="bg-pos-surface border border-pos-border p-8 rounded-[2rem] shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pos-primary/5 blur-3xl -mr-16 -mt-16 rounded-full" />
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-pos-muted mb-2">
                        <Hash size={12} /> Tenant ID
                    </label>
                    <input 
                        type="text" 
                        placeholder="e.g. T1"
                        className="w-full bg-pos-black/50 border border-pos-border focus:border-pos-primary rounded-xl p-4 text-sm font-semibold transition-all outline-none text-pos-white"
                        value={tenantId}
                        onChange={(e) => setTenantId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-pos-muted mb-2">
                        <Shield size={12} /> Access Role
                    </label>
                    <select 
                        className="w-full bg-pos-black/50 border border-pos-border focus:border-pos-primary rounded-xl p-4 text-sm font-semibold transition-all outline-none text-pos-white appearance-none"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="Cashier">Cashier</option>
                        <option value="Branch Owner">Branch Owner</option>
                        <option value="Chain Owner">Chain Owner</option>
                        <option value="SaaS Admin">SaaS Admin</option>
                    </select>
                </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-pos-muted mb-2">
                <User size={12} /> Account Username
              </label>
              <input 
                type="text" 
                placeholder="Username"
                className="w-full bg-pos-black/50 border border-pos-border focus:border-pos-primary rounded-xl p-4 text-sm font-semibold transition-all outline-none text-pos-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-pos-muted mb-2">
                <Lock size={12} /> Security Key
              </label>
              <input 
                type="password" 
                placeholder="Password"
                className="w-full bg-pos-black/50 border border-pos-border focus:border-pos-primary rounded-xl p-4 text-sm font-semibold transition-all outline-none text-pos-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              size="xl" 
              className="w-full h-16 uppercase font-black tracking-tight rounded-xl shadow-xl shadow-pos-primary/10 mt-4"
            >
              Login to Sovereign Hub
            </Button>
          </form>
        </div>

        <footer className="mt-10 text-center">
          <p className="text-[10px] text-pos-muted font-black uppercase tracking-[0.4em] opacity-40">
            Encrypted Session // Protocol strictly followed
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;
