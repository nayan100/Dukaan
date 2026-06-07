import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeOff, AlertCircle, CheckCircle2, FileText, X } from 'lucide-react';

interface AuditItem {
  item_id: string;
  name: string;
  expected_qty: number;
}

interface BlindSpotCheckProps {
  items: AuditItem[];
  onVerified: (result: any) => void;
  onCancel: () => void;
}

const BlindSpotCheck: React.FC<BlindSpotCheckProps> = ({ items, onVerified, onCancel }) => {
  const [counts, setCounts] = useState<Record<string, string>>({});
  const [showLockdown, setShowLockdown] = useState(false);
  const [correctionNote, setCorrectionNote] = useState('');

  const handleCountChange = (id: string, value: string) => {
    setCounts(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const mismatches = items.filter(item => {
      const actual = parseFloat(counts[item.item_id] || '0');
      return actual !== item.expected_qty;
    });

    if (mismatches.length > 0) {
      setShowLockdown(true);
    } else {
      onVerified({ isMatch: true, items: counts });
    }
  };

  const handleLockdownSubmit = () => {
    onVerified({ 
      isMatch: false, 
      items: counts, 
      correctionNote,
      mismatched_ids: items.filter(i => parseFloat(counts[i.item_id] || '0') !== i.expected_qty).map(i => i.item_id)
    });
  };

  return (
    <div className="bg-pos-surface border border-pos-border rounded-pos p-8 max-w-2xl w-full shadow-2xl relative">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <EyeOff className="text-pos-secondary w-8 h-8" />
          <h2 className="text-pos-white text-2xl font-black uppercase tracking-tighter italic">Blind Spot-Check</h2>
        </div>
        <button onClick={onCancel} className="text-pos-muted hover:text-pos-white transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-pos-secondary/10 border border-pos-secondary/20 p-4 rounded-xl mb-8 flex gap-4 items-start">
        <AlertCircle className="text-pos-secondary w-5 h-5 flex-shrink-0 mt-0.5" />
        <p className="text-pos-white text-sm">
          <strong>Mandatory Verification:</strong> Please physically count the following items. Do not refer to the digital system during this process.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4">
          {items.map((item) => (
            <div key={item.item_id} className="bg-pos-black border border-pos-border p-4 rounded-xl flex items-center justify-between group hover:border-pos-secondary/50 transition-all">
              <div>
                <p className="text-pos-white font-bold">{item.name}</p>
                <p className="text-pos-muted text-xs uppercase tracking-widest font-black">Verify Quantity</p>
              </div>
              <input
                type="number"
                required
                placeholder="0"
                value={counts[item.item_id] || ''}
                onChange={(e) => handleCountChange(item.item_id, e.target.value)}
                className="w-32 bg-pos-surface border border-pos-border rounded-lg px-4 py-3 text-pos-white font-mono text-center text-xl focus:border-pos-secondary focus:ring-1 focus:ring-pos-secondary outline-none transition-all"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-pos-secondary text-pos-black font-black py-4 rounded-xl hover:bg-pos-secondary/90 transition-all uppercase tracking-widest flex items-center justify-center gap-3 mt-8 shadow-lg shadow-pos-secondary/20"
        >
          <CheckCircle2 className="w-6 h-6" />
          Complete Verification
        </button>
      </form>

      {/* Lockdown UI */}
      <AnimatePresence>
        {showLockdown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-pos-black/95 backdrop-blur-xl p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-pos-surface border border-pos-danger rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(239,68,68,0.3)]"
            >
              <div className="flex items-center gap-4 mb-6 text-pos-danger">
                <AlertCircle className="w-12 h-12" />
                <h3 className="text-2xl font-black uppercase tracking-tighter">Mismatched Quantity Detected</h3>
              </div>
              
              <p className="text-pos-white text-sm mb-6 font-medium leading-relaxed">
                The count you entered does not match the system's opening stock records. This has triggered an automatic audit lockdown. 
                <br /><br />
                <strong>Correction Note Required:</strong> Explain the discrepancy below for management review.
              </p>

              <div className="relative mb-8">
                <FileText className="absolute top-4 left-4 text-pos-muted w-5 h-5" />
                <textarea
                  autoFocus
                  required
                  placeholder="Correction Note"
                  value={correctionNote}
                  onChange={(e) => setCorrectionNote(e.target.value)}
                  className="w-full bg-pos-black border border-pos-border rounded-2xl px-12 py-4 text-pos-white text-sm h-40 focus:border-pos-danger focus:ring-1 focus:ring-pos-danger outline-none transition-all placeholder:text-pos-muted"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowLockdown(false)}
                  className="flex-1 px-6 py-4 border border-pos-border text-pos-white rounded-xl hover:bg-pos-border transition-colors font-bold"
                >
                  Go Back
                </button>
                <button
                  type="button"
                  disabled={!correctionNote.trim()}
                  onClick={handleLockdownSubmit}
                  className="flex-1 px-6 py-4 bg-pos-danger text-white rounded-xl hover:bg-pos-danger/90 transition-colors disabled:opacity-50 font-black uppercase tracking-widest shadow-lg shadow-pos-danger/20"
                >
                  Submit Audit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlindSpotCheck;
