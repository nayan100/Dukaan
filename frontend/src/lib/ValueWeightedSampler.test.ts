import { describe, it, expect } from 'vitest';
import { selectItemsForAudit } from './ValueWeightedSampler';

const mockItems = [
  { id: 'low-1', name: 'Low Value 1', price: 100 },
  { id: 'low-2', name: 'Low Value 2', price: 200 },
  { id: 'high-1', name: 'High Value 1', price: 6000 },
  { id: 'high-2', name: 'High Value 2', price: 10000 },
  { id: 'high-3', name: 'High Value 3', price: 15000 },
];

describe('ValueWeightedSampler', () => {
  it('selects requested number of items', () => {
    const selected = selectItemsForAudit(mockItems as any, 2);
    expect(selected).toHaveLength(2);
  });

  it('prioritizes high-value items (>5000) heavily', () => {
    const iterations = 1000;
    let highValueCount = 0;
    
    for (let i = 0; i < iterations; i++) {
      const selected = selectItemsForAudit(mockItems as any, 1);
      if (['high-1', 'high-2', 'high-3'].includes(selected[0].id)) {
        highValueCount++;
      }
    }
    
    // Expectation: > 5000 value items should be selected ~80% of the time
    const percentage = (highValueCount / iterations) * 100;
    // We allow some statistical variance
    expect(percentage).toBeGreaterThan(70);
    expect(percentage).toBeLessThan(90);
  });
});
