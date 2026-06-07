export interface LandedCostItem {
  id: string;
  name: string;
  qty: number;
  amount: number;
  weight?: number;
  landed_cost?: number;
}

/**
 * Landed Cost Distribution Logic
 * 
 * Distributes additional procurement costs (shipping, customs, etc.)
 * across line items based on specified criteria.
 */
export const distributeLandedCost = (
  items: LandedCostItem[], 
  totalAdditionalCost: number, 
  method: 'Value' | 'Weight'
): LandedCostItem[] => {
  if (items.length === 0) return [];

  let totalWeight = 0;
  let totalValue = 0;

  items.forEach(item => {
    totalValue += item.amount;
    totalWeight += item.weight || 0;
  });

  return items.map(item => {
    let share = 0;
    if (method === 'Value') {
      share = totalValue > 0 ? (item.amount / totalValue) * totalAdditionalCost : (totalAdditionalCost / items.length);
    } else if (method === 'Weight') {
      share = totalWeight > 0 ? ((item.weight || 0) / totalWeight) * totalAdditionalCost : (totalAdditionalCost / items.length);
    }

    return {
      ...item,
      landed_cost: share
    };
  });
};
