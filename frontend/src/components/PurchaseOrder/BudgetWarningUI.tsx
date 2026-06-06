import React from 'react';

interface BudgetWarningUIProps {
  isBudgetExceeded: boolean;
}

const BudgetWarningUI: React.FC<BudgetWarningUIProps> = ({ isBudgetExceeded }) => {
  if (!isBudgetExceeded) {
    return null;
  }

  return (
    <div style={{ color: 'orange', fontWeight: 'bold' }}>
      Warning: Budget exceeded for this Purchase Order.
    </div>
  );
};

export default BudgetWarningUI;
