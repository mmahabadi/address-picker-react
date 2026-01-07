import { AddressFormProvider } from './contexts/AddressFormContext';
import { AddressPicker } from './components/AddressPicker';

function App() {
  return (
    <AddressFormProvider>
      <AddressPicker />
    </AddressFormProvider>
  );
}

export default App;
