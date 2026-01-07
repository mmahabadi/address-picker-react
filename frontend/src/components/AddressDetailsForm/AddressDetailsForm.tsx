import type { ChangeEvent } from 'react';
import { useAddressFormContext } from '../../contexts';
import type { AddressDetails } from '../../types';
import { Input } from '../Input';
import './AddressDetailsForm.css';

export function AddressDetailsForm() {
  const { addressDetails, setAddressDetails } = useAddressFormContext();

  const handleAddressDetailsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressDetails({
      [name]: value,
    } as Partial<AddressDetails>);
  };

  return (
    <div className="details-form">
      <Input
        label="Street"
        id="street"
        name="street"
        type="text"
        placeholder="Street name"
        required
        onChange={handleAddressDetailsChange}
        value={addressDetails?.street}
      />

      <div className="details-grid">
        <div>
          <Input
            label="House No."
            id="houseNumber"
            name="houseNumber"
            type="text"
            required
            onChange={handleAddressDetailsChange}
            value={addressDetails?.houseNumber}
          />
        </div>
        <div>
          <Input
            label="Apartment"
            id="apartment"
            name="apartment"
            type="text"
            onChange={handleAddressDetailsChange}
            value={addressDetails?.apartment}
          />
        </div>
        <div>
          <Input
            label="Postal code"
            id="postalCode"
            name="postalCode"
            type="text"
            required
            onChange={handleAddressDetailsChange}
            value={addressDetails?.postalCode}
          />
        </div>
      </div>
    </div>
  );
}
