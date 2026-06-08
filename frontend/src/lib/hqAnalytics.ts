export type BranchData = {
  id: string;
  name: string;
  revenue: number;
  transactions: number;
  inventory: Array<{
    item: string;
    stock: number;
    sales: number;
  }>;
};

export const aggregateGlobalKPIs = (branches: BranchData[]) => {
  return branches.reduce((acc, branch) => ({
    totalRevenue: acc.totalRevenue + branch.revenue,
    totalTransactions: acc.totalTransactions + branch.transactions
  }), { totalRevenue: 0, totalTransactions: 0 });
};

export const getInventoryPerformance = (branches: BranchData[]) => {
  const itemMap: Record<string, number> = {};

  branches.forEach(branch => {
    branch.inventory.forEach(inv => {
      itemMap[inv.item] = (itemMap[inv.item] || 0) + inv.sales;
    });
  });

  const performance = Object.entries(itemMap).map(([item, sales]) => ({ item, sales }));
  
  performance.sort((a, b) => b.sales - a.sales);

  return {
    best: performance.slice(0, 5),
    worst: performance.slice().reverse().slice(0, 5)
  };
};
