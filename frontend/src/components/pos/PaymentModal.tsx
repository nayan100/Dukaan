import React, { useState } from 'react';
import { X, Banknote, QrCode } from 'lucide-react';
import Button from '../ui/Button';

interface PaymentModalProps {
  total: number;
  onComplete: (paymentDetails: any) => void;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ total, onComplete, onClose }) => {
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [digitalAmount, setDigitalAmount] = useState<number>(0);

  const totalPaid = cashAmount + digitalAmount;
  const balance = total - totalPaid;

  const handleComplete = () => {
    if (totalPaid < total) {
      alert('Insufficient payment. Please collect full amount.');
      return;
    }
    onComplete({
      cash: cashAmount,
      digital: digitalAmount,
      total: totalPaid,
      change: totalPaid - total
    });
  };

  return (
    <div className="fixed inset-0 bg-pos-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300">
      <div className="bg-pos-surface/90 border border-pos-border w-full max-w-2xl p-10 rounded-2xl shadow-2xl backdrop-saturate-150">
        <div className="flex justify-between items-center mb-10 border-b border-pos-border pb-6">
          <div>
            <h2 className="text-pos-2xl font-extrabold tracking-tight">Complete Payment</h2>
            <p className="text-pos-muted text-sm mt-1">Split payments supported (Cash + Digital)</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-pos-danger/10 hover:text-pos-danger rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-10 mb-10">
          <div className="space-y-8">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-pos-muted mb-3">
                <Banknote size={16} /> Cash Received
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pos-muted font-bold">NPR</span>
                <input 
                  type="number" 
                  placeholder="0.00"
                  className="w-full bg-pos-black/50 border border-pos-border focus:border-pos-primary rounded-xl p-4 pl-14 text-xl font-bold text-pos-primary transition-all outline-none"
                  value={cashAmount || ''}
                  onChange={(e) => setCashAmount(Number(e.target.value))}
                />
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-pos-muted mb-3">
                <QrCode size={16} /> Digital (Fonepay)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pos-muted font-bold">NPR</span>
                <input 
                  type="number" 
                  placeholder="0.00"
                  className="w-full bg-pos-black/50 border border-pos-border focus:border-pos-primary rounded-xl p-4 pl-14 text-xl font-bold text-pos-primary transition-all outline-none"
                  value={digitalAmount || ''}
                  onChange={(e) => setDigitalAmount(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="bg-pos-black/40 border border-pos-border p-8 flex flex-col justify-center rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-pos-primary/5 blur-3xl -mr-16 -mt-16 rounded-full" />
             
            <div className="text-xs opacity-50 uppercase font-black tracking-widest mb-2">Order Summary</div>
            <div className="text-3xl font-black mb-8">NPR {total.toLocaleString()}</div>
            
            <div className="text-xs opacity-50 uppercase font-black tracking-widest mb-2">Balance Due</div>
            <div className={`text-3xl font-black ${balance > 0 ? 'text-pos-danger' : 'text-pos-primary'}`}>
              NPR {Math.max(0, balance).toLocaleString()}
            </div>

            {balance < 0 && (
              <div className="mt-8 pt-6 border-t border-pos-border/50">
                <div className="text-xs text-pos-secondary uppercase font-black tracking-widest mb-1">Change to return</div>
                <div className="text-2xl font-black text-pos-secondary animate-pulse">NPR {Math.abs(balance).toLocaleString()}</div>
              </div>
            )}
          </div>
        </div>

        {digitalAmount > 0 && (
          <div className="mb-10 p-5 border border-pos-secondary/20 bg-pos-secondary/5 flex items-center gap-6 rounded-xl">
            <div className="w-24 h-24 bg-white p-2 rounded-lg shadow-lg">
              <div className="w-full h-full border-2 border-pos-black flex items-center justify-center font-black text-pos-black text-[10px] text-center leading-tight">
                QR<br/>SCAN
              </div>
            </div>
            <div className="flex-1">
              <div className="font-bold text-pos-secondary uppercase tracking-tight text-lg leading-tight">Waiting for Digital verification...</div>
              <p className="text-sm text-pos-muted mt-1 italic">Customer should scan the dynamic QR code above.</p>
            </div>
          </div>
        )}

        <div className="flex gap-4">
            <Button 
            variant="outline" 
            size="xl" 
            className="flex-1 h-20"
            onClick={onClose}
            >
            Cancel
            </Button>
            <Button 
            variant="primary" 
            size="xl" 
            className="flex-[2] h-20 text-xl tracking-tight"
            onClick={handleComplete}
            disabled={totalPaid < total}
            >
            Finalize Transaction
            </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
