import { useAddressFormContext } from '../../contexts/AddressFormContext';
import { AddressForm } from '../AddressForm';
import { AddressSummary } from '../AddressSummary';

export function AddressPicker() {
  const { isSubmitted: submittedData } = useAddressFormContext();

  if (submittedData) {
    return (
      <AddressSummary />
    );
  }

  return (
    <AddressForm />
  );
}
