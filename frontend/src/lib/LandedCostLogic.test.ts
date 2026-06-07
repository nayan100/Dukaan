import { describe, it, expect } from 'vitest';
import { distributeLandedCost } from './LandedCostLogic';

const mockItems = [
  { id: '1', name: 'Item A', qty: 10, amount: 1000, weight: 5 }, // 10kg
  { id: '2', name: 'Item B', qty: 5, amount: 2000, weight: 10 },  // 10kg
];

describe('LandedCostLogic', () => {
  it('distributes cost by value correctly', () => {
    const additionalCost = 300;
    const result = distributeLandedCost(mockItems, additionalCost, 'Value');
    
    // Total Value: 1000 + 2000 = 3000
    // Item A Share: (1000/3000) * 300 = 100
    // Item B Share: (2000/3000) * 300 = 200
    
    expect(result.find(i => i.id === '1')?.landed_cost).toBe(100);
    expect(result.find(i => i.id === '2')?.landed_cost).toBe(200);
  });

  it('distributes cost by weight correctly', () => {
    const additionalCost = 400;
    const result = distributeLandedCost(mockItems, additionalCost, 'Weight');
    
    // Total Weight: 5*10 + 10*5 = 50 + 50 = 100kg (Wait, weight in items usually is per unit)
    // Let's assume weight is total weight per line item for simplicity in this logic
    
    // Total Weight: 5 + 10 = 15
    // Item A Share: (5/15) * 400 = 133.33
    // Item B Share: (10/15) * 400 = 266.66
    
    expect(result.find(i => i.id === '1')?.landed_cost).toBeCloseTo(133.33, 1);
    expect(result.find(i => i.id === '2')?.landed_cost).toBeCloseTo(266.67, 1);
  });
});
