import React, { useState } from 'react';

interface OnboardingWizardProps {
  onComplete: (tenant: any) => void;
  onCancel: () => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    company_name: '',
    plan_tier: 'Basic'
  });
  const [isProvisioning, setIsProvisioning] = useState(false);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleStartProvisioning = async () => {
    setIsProvisioning(true);
    // Simulate API call to backend
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newTenant = {
      name: `T-${Math.floor(Math.random() * 1000)}`,
      company_name: formData.company_name,
      plan_tier: formData.plan_tier,
      status: 'Active',
      site_url: `${formData.company_name.toLowerCase().replace(/\s+/g, '-')}.dukaan.io`,
      db_name: `tenant_${formData.company_name.toLowerCase().replace(/\s+/g, '_')}`,
      default_warehouse: `${formData.company_name} - Local`
    };
    
    setIsProvisioning(false);
    onComplete(newTenant);
  };

  return (
    <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
      {/* Wizard Header */}
      <div className="bg-slate-950 p-6 border-b border-slate-800">
        <h3 className="text-xl font-bold text-white">Provision New Tenant</h3>
        <p className="text-sm text-slate-500 mt-1">Step {step} of 2: {step === 1 ? 'Configure Environment' : 'Confirm & Launch'}</p>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1 mt-4 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full transition-all duration-500" 
            style={{ width: `${(step / 2) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-8">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Company Name</label>
              <input 
                type="text"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                placeholder="e.g. Global Logistics Ltd"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Subscription Plan</label>
              <div className="grid grid-cols-3 gap-4">
                {['Basic', 'Professional', 'Enterprise'].map((plan) => (
                  <button
                    key={plan}
                    onClick={() => setFormData({ ...formData, plan_tier: plan })}
                    className={`p-4 rounded-xl border transition-all ${formData.plan_tier === plan ? 'bg-blue-600/10 border-blue-500 text-blue-500' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                  >
                    <div className="text-sm font-bold">{plan}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Company</span>
                <span className="text-slate-200 font-medium">{formData.company_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Plan</span>
                <span className="text-slate-200 font-medium">{formData.plan_tier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Region</span>
                <span className="text-slate-200 font-medium">South Asia (Nepal)</span>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
              <span className="text-amber-500 mt-0.5 text-lg">⚠</span>
              <p className="text-xs text-amber-200/70 leading-relaxed">
                Starting provisioning will create a new isolated database schema and default warehouse. This process is irreversible once started.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Wizard Footer */}
      <div className="bg-slate-950/50 p-6 border-t border-slate-800 flex justify-between">
        <button 
          onClick={step === 1 ? onCancel : handleBack}
          className="px-6 py-2 text-slate-400 hover:text-white transition-colors"
        >
          {step === 1 ? 'Cancel' : 'Back'}
        </button>
        
        {step === 1 ? (
          <button 
            onClick={handleNext}
            disabled={!formData.company_name}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-2 rounded-lg font-medium transition-colors"
          >
            Review Setup
          </button>
        ) : (
          <button 
            onClick={() => onComplete(formData)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
          >
            Submit for Provisioning
          </button>
        )}
      </div>
    </div>
  );
};

export default OnboardingWizard;
