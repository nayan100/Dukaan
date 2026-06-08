import { create } from 'zustand';

export interface InventoryItem {
  id: string;
  name: string;
  code: string;
  stock: number;
  min_stock: number;
  price: number;
}

interface SoldItem {
  id: string;
  quantity: number;
}

interface InventoryState {
  inventory: InventoryItem[];
  handleSaleComplete: (soldItems: SoldItem[]) => void;
}

const defaultInventory: InventoryItem[] = [
  { id: '1', name: 'Wai Wai Noodles', code: 'W-01', stock: 150, min_stock: 50, price: 20 },
  { id: '2', name: 'Real Juice 1L', code: 'J-02', stock: 20, min_stock: 30, price: 250 },
  { id: '3', name: 'Amul Butter 500g', code: 'B-03', stock: 5, min_stock: 15, price: 600 },
  { id: '4', name: 'Dairy Milk Silk', code: 'C-04', stock: 45, min_stock: 20, price: 180 },
  { id: '5', name: 'Coca Cola 2.25L', code: 'D-05', stock: 100, min_stock: 40, price: 270 },
  { id: '6', name: 'Lays Chips', code: 'S-06', stock: 12, min_stock: 25, price: 50 },
  { id: '7', name: 'Current Noodles', code: 'C-07', stock: 80, min_stock: 30, price: 50 },
  { id: '8', name: 'Aashirvaad Atta 5kg', code: 'A-08', stock: 25, min_stock: 10, price: 550 },
  { id: '9', name: 'Fortune Oil 1L', code: 'F-09', stock: 40, min_stock: 15, price: 240 },
];

export const useInventoryStore = create<InventoryState>((set) => ({
  inventory: defaultInventory,
  handleSaleComplete: (soldItems: SoldItem[]) =>
    set((state) => ({
      inventory: state.inventory.map((invItem) => {
        const sold = soldItems.find((s) => s.id === invItem.id);
        if (sold) {
          return { ...invItem, stock: Math.max(0, invItem.stock - sold.quantity) };
        }
        return invItem;
      }),
    })),
}));
