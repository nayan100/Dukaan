import React, { useState } from 'react';
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
    <div className="fixed inset-0 bg-pos-black bg-opacity-90 flex items-center justify-center p-4 z-50">
      <div className="bg-pos-surface border-4 border-pos-primary w-full max-w-2xl p-8 rounded-lg shadow-2xl">
        <div className="flex justify-between items-center mb-8 border-b-4 border-pos-primary pb-4">
          <h2 className="text-pos-2xl font-bold uppercase tracking-widest">Payment</h2>
          <Button variant="danger" size="md" onClick={onClose}>Cancel</Button>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-pos-xl font-bold mb-2">Cash Amount</label>
              <input 
                type="number" 
                placeholder="Cash Amount"
                className="w-full bg-pos-black border-2 border-pos-primary p-4 text-pos-xl font-bold text-pos-primary focus:outline-none"
                value={cashAmount || ''}
                onChange={(e) => setCashAmount(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-pos-xl font-bold mb-2">Digital (QR/Fonepay)</label>
              <input 
                type="number" 
                placeholder="Digital Amount"
                className="w-full bg-pos-black border-2 border-pos-primary p-4 text-pos-xl font-bold text-pos-primary focus:outline-none"
                value={digitalAmount || ''}
                onChange={(e) => setDigitalAmount(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="bg-pos-black border-2 border-pos-primary p-6 flex flex-col justify-center items-center rounded">
            <div className="text-sm opacity-60 uppercase mb-2">Order Total</div>
            <div className="text-pos-2xl font-bold mb-6">NPR {total}</div>
            
            <div className="text-sm opacity-60 uppercase mb-2">Balance Due</div>
            <div className={`text-pos-2xl font-bold ${balance > 0 ? 'text-pos-danger' : 'text-pos-primary'}`}>
              NPR {Math.max(0, balance)}
            </div>

            {balance < 0 && (
              <div className="mt-4 text-center">
                <div className="text-sm opacity-60 uppercase mb-2 text-pos-secondary">Change Due</div>
                <div className="text-pos-xl font-bold text-pos-secondary">NPR {Math.abs(balance)}</div>
              </div>
            )}
          </div>
        </div>

        {digitalAmount > 0 && (
          <div className="mb-8 p-4 border-2 border-pos-secondary bg-pos-black flex items-center gap-4 rounded">
            <div className="w-20 h-20 bg-pos-white flex items-center justify-center font-bold text-pos-black text-xs text-center p-2">
              QR CODE PLACEHOLDER
            </div>
            <div className="flex-1">
              <div className="font-bold text-pos-secondary uppercase">Waiting for Fonepay confirmation...</div>
              <div className="text-xs opacity-80">The system will auto-verify once payment is received.</div>
            </div>
          </div>
        )}

        <Button 
          variant="primary" 
          size="xl" 
          className="w-full h-24 text-pos-2xl uppercase tracking-tighter"
          onClick={handleComplete}
        >
          Complete Sale
        </Button>
      </div>
    </div>
  );
};

export default PaymentModal;
