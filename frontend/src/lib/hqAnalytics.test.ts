import { describe, it, expect } from 'vitest';
import { aggregateGlobalKPIs, getInventoryPerformance } from './hqAnalytics';

describe('hqAnalytics', () => {
  const mockBranches = [
    { 
      id: 'B1', 
      name: 'KTM Main', 
      revenue: 50000, 
      transactions: 120, 
      inventory: [
        { item: 'A', stock: 10, sales: 100 }, 
        { item: 'B', stock: 50, sales: 5 }
      ] 
    },
    { 
      id: 'B2', 
      name: 'Lalitpur', 
      revenue: 30000, 
      transactions: 80, 
      inventory: [
        { item: 'A', stock: 5, sales: 80 }, 
        { item: 'C', stock: 5, sales: 20 }
      ] 
    },
  ];

  it('should aggregate global revenue and volumes', () => {
    const kpis = aggregateGlobalKPIs(mockBranches);
    expect(kpis.totalRevenue).toBe(80000);
    expect(kpis.totalTransactions).toBe(200);
  });

  it('should identify best and worst performing items', () => {
    const performance = getInventoryPerformance(mockBranches);
    expect(performance.best[0].item).toBe('A'); // Total sales 180
    expect(performance.worst[0].item).toBe('B'); // Total sales 5
  });
});
