import ProcurementSuite from './components/ProcurementSuite/ProcurementSuite';
import VerifySpotCheckUI from './components/OpeningStockEntry/VerifySpotCheckUI';
import BudgetWarningUI from './components/PurchaseOrder/BudgetWarningUI';

function App() {
  return (
    <>
      <ProcurementSuite />
      <VerifySpotCheckUI />
      <BudgetWarningUI isBudgetExceeded={true} />
    </>
  );
}

export default App;
