import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, CheckCircle, ShieldCheck } from 'lucide-react';

interface ApprovalHandshakeProps {
  poId: string;
  onApprove: () => void;
  onCancel: () => void;
}

const ApprovalHandshake: React.FC<ApprovalHandshakeProps> = ({ poId, onApprove, onCancel }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const MANAGER_PIN = '1234'; // Simulated manager PIN

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);

      if (newPin.length === 4) {
        validatePin(newPin);
      }
    }
  };

  const validatePin = (enteredPin: string) => {
    if (enteredPin === MANAGER_PIN) {
      setIsSuccess(true);
      setTimeout(() => {
        onApprove();
      }, 1000);
    } else {
      setError(true);
      setTimeout(() => {
        setPin('');
        setError(false);
      }, 1000);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-pos-black/90 backdrop-blur-md p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-pos-surface border border-pos-border rounded-pos p-8 max-w-sm w-full shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-pos-primary/20">
          <motion.div 
            className="h-full bg-pos-primary" 
            initial={{ width: 0 }} 
            animate={{ width: `${(pin.length / 4) * 100}%` }}
          />
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-pos-primary w-6 h-6" />
            <h2 className="text-pos-white text-lg font-bold">Manager Approval Required</h2>
          </div>
          <button onClick={onCancel} className="text-pos-muted hover:text-pos-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center mb-8">
          <p className="text-pos-muted text-sm mb-1 uppercase font-bold tracking-widest">Approving Order</p>
          <p className="text-pos-white text-2xl font-mono font-bold">{poId}</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                pin.length > i 
                  ? 'bg-pos-primary border-pos-primary scale-125 shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
                  : 'border-pos-border'
              } ${error ? 'border-pos-danger bg-pos-danger animate-shake' : ''}`}
            />
          ))}
        </div>

        <AnimatePresence>
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }}
              className="text-pos-danger text-center text-sm font-bold mb-4"
            >
              Invalid Manager PIN
            </motion.p>
          )}
        </AnimatePresence>

        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="flex flex-col items-center justify-center mb-4 text-pos-primary"
          >
            <CheckCircle className="w-12 h-12 mb-2" />
            <p className="font-bold">Access Granted</p>
          </motion.div>
        )}

        {!isSuccess && (
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num.toString())}
                className="w-full aspect-square flex items-center justify-center text-2xl font-bold text-pos-white bg-pos-black border border-pos-border rounded-pos hover:border-pos-primary hover:bg-pos-primary/10 transition-all active:scale-95"
              >
                {num}
              </button>
            ))}
            <div />
            <button
              onClick={() => handleNumberClick('0')}
              className="w-full aspect-square flex items-center justify-center text-2xl font-bold text-pos-white bg-pos-black border border-pos-border rounded-pos hover:border-pos-primary hover:bg-pos-primary/10 transition-all active:scale-95"
            >
              0
            </button>
            <button
              onClick={handleDelete}
              className="w-full aspect-square flex items-center justify-center text-pos-muted bg-pos-black border border-pos-border rounded-pos hover:text-pos-danger hover:border-pos-danger transition-all active:scale-95"
            >
              <X className="w-8 h-8" />
            </button>
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-pos-muted font-bold uppercase tracking-widest">
          <Lock className="w-3 h-3" />
          Sovereign Security Protocol Active
        </div>
      </motion.div>
    </div>
  );
};

export default ApprovalHandshake;
