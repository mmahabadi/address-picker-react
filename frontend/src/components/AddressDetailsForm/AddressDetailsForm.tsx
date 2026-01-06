import type { ChangeEvent } from 'react';
import { Input } from "../Input";
import './AddressDetailsForm.css';

interface AddressDetailsFormProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function AddressDetailsForm({ onChange }: AddressDetailsFormProps) {
  return (
    <div className="details-form">
      <Input
        label="Street"
        id="street"
        name="street"
        type="text"
        placeholder="Street name"
        onChange={onChange}
      />

      <div className="details-grid">
        <div>
          <Input
            label="House No."
            id="houseNumber"
            name="houseNumber"
            type="text"
            onChange={onChange}
          />
        </div>
        <div>
          <Input
            label="Apartment"
            id="apartment"
            name="apartment"
            type="text"
            onChange={onChange}
          />
        </div>
        <div>
          <Input
            label="Postal code"
            id="postalCode"
            name="postalCode"
            type="text"
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}
