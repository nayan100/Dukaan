import POSHUD from './components/pos/POSHUD';

const SAMPLE_ITEMS = [
  { id: '1', name: 'Wai Wai Noodles', price: 20 },
  { id: '2', name: 'Real Juice 1L', price: 250 },
  { id: '3', name: 'Amul Butter 500g', price: 600 },
  { id: '4', name: 'Dairy Milk Silk', price: 180 },
  { id: '5', name: 'Coca Cola 2.25L', price: 270 },
  { id: '6', name: 'Lays Chips', price: 50 },
  { id: '7', name: 'Current Noodles', price: 50 },
  { id: '8', name: 'Aashirvaad Atta 5kg', price: 550 },
  { id: '9', name: 'Fortune Oil 1L', price: 240 },
];

function App() {
  return (
    <div className="App">
      <POSHUD availableItems={SAMPLE_ITEMS} />
    </div>
  );
}

export default App;
