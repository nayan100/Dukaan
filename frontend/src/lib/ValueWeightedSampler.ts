export interface AuditItem {
  id: string;
  name: string;
  price: number;
}

/**
 * Value-Weighted Blind Spot-Check Sampler
 * 
 * Prioritizes items with price > 5000 NPR (80% probability)
 * for randomized audit verification.
 */
export const selectItemsForAudit = (items: AuditItem[], count: number): AuditItem[] => {
  const highValue = items.filter(i => i.price > 5000);
  const lowValue = items.filter(i => i.price <= 5000);
  
  const selected: AuditItem[] = [];
  const remainingHigh = [...highValue];
  const remainingLow = [...lowValue];

  for (let i = 0; i < Math.min(count, items.length); i++) {
    const roll = Math.random() * 100;
    
    // 80% chance to pick from high-value pool if not empty
    if (roll <= 80 && remainingHigh.length > 0) {
      const idx = Math.floor(Math.random() * remainingHigh.length);
      selected.push(remainingHigh.splice(idx, 1)[0]);
    } 
    // Otherwise pick from low-value pool if not empty
    else if (remainingLow.length > 0) {
      const idx = Math.floor(Math.random() * remainingLow.length);
      selected.push(remainingLow.splice(idx, 1)[0]);
    }
    // Fallback to high-value if low-value is empty
    else if (remainingHigh.length > 0) {
      const idx = Math.floor(Math.random() * remainingHigh.length);
      selected.push(remainingHigh.splice(idx, 1)[0]);
    }
  }

  return selected;
};
