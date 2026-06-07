import React, { useEffect, useState } from 'react';
import { ShoppingCart, Trash2, CheckCircle, Search, AlertTriangle, LayoutGrid, ReceiptText } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import PaymentModal from './PaymentModal';
import { saveInvoiceOffline } from '../../lib/db';
import { useAuth } from '../../context/AuthContext';

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
  const { tenantId } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
    toast.success(`+1 ${item.name}`, { 
        style: { background: '#0f172a', color: '#10b981', border: '1px solid #1e293b' }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.id === itemId);
      if (!item) return prevCart;

      const isWithinWindow = Date.now() - item.addedAt < 60000;
      if (isWithinWindow) {
        if (item.quantity > 1) {
          return prevCart.map((i) =>
            i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
          );
        }
        return prevCart.filter((i) => i.id !== itemId);
      }
      toast.error('Void window expired. Manager OTP required.', {
        icon: <AlertTriangle className="text-pos-danger" />,
        style: { background: '#0f172a', color: '#ef4444', border: '1px solid #1e293b' }
      });
      return prevCart;
    });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePaymentComplete = async (details: any) => {
    const invoice = {
      invoice_id: `INV-${Date.now()}`,
      tenant_id: tenantId,
      items: cart,
      total: details.total,
      payment_details: details,
      created_at: Date.now(),
    };

    try {
      await saveInvoiceOffline(invoice);
    } catch (err) {
      console.error('Failed to save offline:', err);
    }

    toast.success('Transaction Finalized!', {
      duration: 3000,
      icon: <CheckCircle className="text-pos-primary" />,
      style: { background: '#0f172a', color: '#10b981', border: '1px solid #10b981' }
    });
    setCart([]);
    setIsPaymentModalOpen(false);
  };

  const filteredItems = availableItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex bg-pos-black text-pos-white overflow-hidden font-sans selection:bg-pos-primary/30">
      <Toaster position="top-center" />
      
      {/* Items Section */}
      <div className="flex-1 flex flex-col min-w-0 bg-pos-black">
        <header className="p-4 bg-pos-surface/50 border-b border-pos-border flex items-center justify-between backdrop-blur-md flex-shrink-0">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pos-primary/20 rounded-xl flex items-center justify-center border border-pos-primary/30 shadow-inner">
                    <LayoutGrid size={22} className="text-pos-primary" />
                </div>
                <div>
                    <h1 className="text-lg font-extrabold tracking-tight">Catalog</h1>
                    <p className="text-[10px] text-pos-muted font-medium">Quick tap to add</p>
                </div>
            </div>
            
            <div className="w-1/2 max-w-md relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pos-muted group-focus-within:text-pos-primary transition-colors" size={18} />
                <input 
                    type="text" 
                    placeholder="Search products... (F1)" 
                    className="w-full bg-pos-black/50 border border-pos-border focus:border-pos-primary rounded-xl py-2 pl-12 pr-4 text-sm font-semibold transition-all outline-none placeholder:text-pos-muted/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                />
            </div>
        </header>
        
        <main className="flex-1 p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto custom-scrollbar content-start">
          {filteredItems.map((item) => (
            <motion.div
                key={item.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
            >
                <Button
                variant="muted"
                size="xl"
                onClick={() => addToCart(item)}
                className="w-full h-32 flex-col gap-2 group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-pos-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-sm font-bold text-pos-white group-hover:text-pos-primary transition-colors text-center px-2 line-clamp-2">{item.name}</span>
                    <div className="bg-pos-black/40 px-3 py-1 rounded-full border border-pos-border group-hover:border-pos-primary/30 transition-colors">
                        <span className="text-xs font-black text-pos-primary">NPR {item.price.toLocaleString()}</span>
                    </div>
                </Button>
            </motion.div>
          ))}
        </main>
      </div>

      {/* Cart Sidebar */}
      <aside className="w-[380px] flex-shrink-0 border-l border-pos-border flex flex-col bg-pos-surface/30 backdrop-blur-xl relative">
        <header className="p-4 border-b border-pos-border flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-pos-secondary/20 rounded-lg flex items-center justify-center border border-pos-secondary/30">
                    <ShoppingCart size={18} className="text-pos-secondary" />
                </div>
                <h2 className="text-sm font-extrabold tracking-tight uppercase italic">Active Order</h2>
            </div>
            <div className="bg-pos-black/50 px-2 py-0.5 rounded-md border border-pos-border text-[10px] font-bold text-pos-muted">
                {cart.length} ITEMS
            </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          <AnimatePresence initial={false}>
            {cart.map((item) => (
                <motion.div 
                    key={item.id} 
                    data-testid={`cart-item-${item.id}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="group bg-pos-black/40 border border-pos-border hover:border-pos-primary/30 p-3 rounded-xl transition-all"
                >
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                            <div className="text-xs font-bold text-pos-white leading-tight line-clamp-2">{item.name}</div>
                            <div className="text-[10px] text-pos-muted font-bold mt-1 uppercase tracking-tighter">
                                NPR {item.price} × <span data-testid={`cart-item-${item.id}-qty`}>{item.quantity}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-black text-pos-primary tracking-tight">
                                NPR {(item.price * item.quantity).toLocaleString()}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button 
                            variant="danger" 
                            size="sm" 
                            onClick={() => removeFromCart(item.id)}
                            data-testid={`void-item-${item.id}`}
                            className="flex-1 gap-2 h-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={12} /> <span className="text-[9px] uppercase font-black">Void Item</span>
                        </Button>
                    </div>
                </motion.div>
            ))}
          </AnimatePresence>

          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-10 py-10 grayscale">
              <ReceiptText size={100} strokeWidth={1} />
              <div className="mt-4 font-black uppercase tracking-[0.2em] text-sm">Order Pending</div>
            </div>
          )}
        </div>

        <footer className="p-6 bg-pos-black/40 border-t border-pos-border backdrop-blur-2xl flex-shrink-0">
          <div className="flex justify-between items-end mb-6">
            <span className="text-[10px] font-black text-pos-muted uppercase tracking-widest">Total Amount</span>
            <span className="text-3xl font-black text-pos-primary tracking-tighter">
                <span className="text-sm mr-1.5 font-bold opacity-50 italic">NPR</span>
                <span data-testid="cart-total">{total.toLocaleString()}</span>
            </span>
          </div>
          
          <Button 
            variant="primary" 
            size="xl" 
            className="w-full h-16 text-lg uppercase font-black tracking-tight rounded-xl relative overflow-hidden shadow-xl shadow-pos-primary/10 group"
            onClick={() => cart.length > 0 && tenantId && setIsPaymentModalOpen(true)}
            disabled={cart.length === 0 || !tenantId}
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative z-10">{tenantId ? 'Checkout' : 'Sovereignty Required'}</span>
            <span className="absolute bottom-2 right-4 text-[8px] opacity-40 font-black tracking-widest">[ENTER]</span>
          </Button>
        </footer>
      </aside>

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
