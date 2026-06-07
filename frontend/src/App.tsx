import ProcurementSuite from './components/ProcurementSuite/ProcurementSuite';
import VerifySpotCheckUI from './components/OpeningStockEntry/VerifySpotCheckUI';
import BudgetWarningUI from './components/PurchaseOrder/BudgetWarningUI';

function App() {
  const handleVerifySpotCheck = () => {
    console.log('Verify Spot Check button clicked!');
    // In a real application, this would trigger backend logic.
  };

  return (
    <>
      <ProcurementSuite />
      <VerifySpotCheckUI onVerify={handleVerifySpotCheck} />
      <BudgetWarningUI isBudgetExceeded={true} />
    </>
  );
}

export default App;
