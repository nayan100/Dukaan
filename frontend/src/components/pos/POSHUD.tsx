import React, { useEffect, useState } from 'react';
import { ShoppingCart, Trash2, CheckCircle, Search, AlertTriangle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Button from '../ui/Button';
import PaymentModal from './PaymentModal';
import { saveInvoiceOffline } from '../../lib/db';

interface Item {
  id: string;
  name: string;
  price: number;
}

interface CartItem extends Item {
  quantity: number;
  addedAt: number;
}

interface POSHUDProps {
  availableItems: Item[];
}

const POSHUD: React.FC<POSHUDProps> = ({ availableItems }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && cart.length > 0 && !isPaymentModalOpen) {
        setIsPaymentModalOpen(true);
      }
      if (e.key === 'Escape' && isPaymentModalOpen) {
        setIsPaymentModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, isPaymentModalOpen]);

  const addToCart = (item: Item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === item.id);
      if (existing) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1, addedAt: Date.now() } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1, addedAt: Date.now() }];
    });
    toast.success(`Added ${item.name}`, { position: 'bottom-left' });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.id === itemId);
      if (!item) return prevCart;

      const isWithinWindow = Date.now() - item.addedAt < 60000;
      if (isWithinWindow) {
        toast.error(`Voided ${item.name}`, { position: 'bottom-left' });
        if (item.quantity > 1) {
          return prevCart.map((i) =>
            i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
          );
        }
        return prevCart.filter((i) => i.id !== itemId);
      }
      
      toast.error('Void window expired. Manager approval required.', {
        icon: <AlertTriangle className="text-pos-danger" />,
      });
      return prevCart;
    });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePaymentComplete = async (details: any) => {
    const invoice = {
      invoice_id: `INV-${Date.now()}`,
      items: cart,
      total: details.total,
      payment_details: details,
      created_at: Date.now(),
    };

    try {
      await saveInvoiceOffline(invoice);
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        const reg = await navigator.serviceWorker.ready;
        await (reg as any).sync.register('sync-invoices');
      }
    } catch (err) {
      console.error('Failed to save offline:', err);
    }

    toast.success('Sale Completed Successfully!', {
      duration: 4000,
      icon: <CheckCircle className="text-pos-primary" />,
    });
    setCart([]);
    setIsPaymentModalOpen(false);
  };

  const filteredItems = availableItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-pos-black text-pos-white overflow-hidden">
      <Toaster />
      
      {/* Items Grid */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 bg-pos-surface border-b-4 border-pos-primary flex items-center gap-4">
          <Search className="text-pos-primary" />
          <input 
            type="text" 
            placeholder="Search Items (F1)..." 
            className="flex-1 bg-pos-black border-2 border-pos-primary p-2 text-pos-xl font-bold text-pos-primary focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>
        
        <div className="flex-1 p-4 grid grid-cols-3 gap-4 overflow-y-auto">
          {filteredItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="xl"
              onClick={() => addToCart(item)}
              className="h-40 text-pos-2xl border-pos-primary hover:bg-pos-primary"
            >
              <div className="flex flex-col items-center">
                <span className="text-center">{item.name}</span>
                <span className="text-sm opacity-80 mt-2">NPR {item.price}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Cart Strip */}
      <div className="w-96 border-l-4 border-pos-primary flex flex-col p-4 bg-pos-surface">
        <div className="flex items-center gap-2 mb-4 border-b-2 border-pos-primary pb-2">
          <ShoppingCart className="text-pos-primary" />
          <h2 className="text-pos-xl font-bold uppercase">Cart</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-4">
          {cart.map((item) => (
            <div 
              key={item.id} 
              data-testid={`cart-item-${item.id}`}
              className="flex justify-between items-center p-3 border border-pos-primary rounded bg-pos-black"
            >
              <div className="flex-1">
                <div className="font-bold">{item.name}</div>
                <div className="text-sm">NPR {item.price} x <span data-testid={`cart-item-${item.id}-qty`}>{item.quantity}</span></div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="font-bold">NPR {item.price * item.quantity}</div>
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => removeFromCart(item.id)}
                  data-testid={`void-item-${item.id}`}
                  className="flex items-center gap-1"
                >
                  <Trash2 size={14} /> Void
                </Button>
              </div>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-20 mt-20">
              <ShoppingCart size={80} />
              <div className="mt-4 font-bold uppercase">Cart is Empty</div>
            </div>
          )}
        </div>

        <div className="mt-4 border-t-4 border-pos-primary pt-4">
          <div className="text-pos-2xl font-bold flex justify-between">
            <span>Total:</span>
            <span data-testid="cart-total">NPR {total}</span>
          </div>
          <Button 
            variant="primary" 
            size="xl" 
            className="w-full mt-4 h-24 text-pos-xl uppercase tracking-widest flex flex-col"
            onClick={() => cart.length > 0 && setIsPaymentModalOpen(true)}
            disabled={cart.length === 0}
          >
            <span>Finish Sale</span>
            <span className="text-xs opacity-60 mt-1">[Enter]</span>
          </Button>
        </div>
      </div>

      {isPaymentModalOpen && (
        <PaymentModal 
          total={total} 
          onComplete={handlePaymentComplete} 
          onClose={() => setIsPaymentModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default POSHUD;
