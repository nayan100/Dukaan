import React, { useState } from 'react';
import Button from '../ui/Button';
import PaymentModal from './PaymentModal';

interface Item {
  id: string;
  name: string;
  price: number;
}

interface CartItem extends Item {
  quantity: number;
  addedAt: number; // timestamp
}

interface POSHUDProps {
  availableItems: Item[];
}

const POSHUD: React.FC<POSHUDProps> = ({ availableItems }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

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
      
      alert('Void window expired. Manager approval required.');
      return prevCart;
    });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePaymentComplete = (details: any) => {
    alert(`Sale Completed! Total: NPR ${details.total}`);
    setCart([]);
    setIsPaymentModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-pos-black text-pos-white overflow-hidden">
      {/* Items Grid (70% width) */}
      <div className="w-0.7 flex-1 p-4 grid grid-cols-3 gap-4 overflow-y-auto">
        {availableItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="xl"
            onClick={() => addToCart(item)}
            className="h-40 text-pos-2xl border-pos-primary hover:bg-pos-primary"
          >
            <div className="flex flex-col items-center">
              <span>{item.name}</span>
              <span className="text-sm opacity-80">NPR {item.price}</span>
            </div>
          </Button>
        ))}
      </div>

      {/* Cart/Billing Strip (30% width) */}
      <div className="w-80 border-l-4 border-pos-primary flex flex-col p-4 bg-pos-surface">
        <h2 className="text-pos-xl font-bold mb-4 border-b-2 border-pos-primary pb-2">Cart</h2>
        
        <div className="flex-1 overflow-y-auto space-y-4">
          {cart.map((item) => (
            <div 
              key={item.id} 
              data-testid={`cart-item-${item.id}`}
              className="flex justify-between items-center p-2 border border-pos-primary rounded bg-pos-black"
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
                >
                  Void
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t-4 border-pos-primary pt-4">
          <div className="text-pos-2xl font-bold flex justify-between">
            <span>Total:</span>
            <span data-testid="cart-total">NPR {total}</span>
          </div>
          <Button 
            variant="primary" 
            size="xl" 
            className="w-full mt-4 h-20 text-pos-xl uppercase tracking-widest"
            onClick={() => cart.length > 0 && setIsPaymentModalOpen(true)}
          >
            Finish Sale
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
