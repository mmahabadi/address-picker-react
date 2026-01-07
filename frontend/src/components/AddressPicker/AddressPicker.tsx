import { useState } from 'react';
import type { Address } from '../../types';
import { AddressForm } from '../AddressForm';
import { AddressSummary } from '../AddressSummary';

export function AddressPicker() {
  const [submittedData, setSubmittedData] = useState<Address | null>(null);

  const handleSubmit = (data: Address) => {
    setSubmittedData(data);
  };

  const handleEdit = () => {
    setSubmittedData(null);
  };

  if (submittedData) {
    return (
      <AddressSummary
        country={submittedData.country}
        region={submittedData.region}
        city={submittedData.city}
        addressDetails={submittedData.addressDetails}
        onEdit={handleEdit}
      />
    );
  }

  return (
    <AddressForm onSubmit={handleSubmit} />
  );
}
