import { useAddressFormContext } from '../../contexts';
import { AddressForm } from '../AddressForm';
import { AddressSummary } from '../AddressSummary';

export function AddressPicker() {
  const { isSubmitted } = useAddressFormContext();

  if (isSubmitted) {
    return <AddressSummary />;
  }

  return <AddressForm />;
}
