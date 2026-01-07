import { useRef } from 'react';
import { useAddressData } from '../../hooks/useAddressData';
import { useFormState } from '../../hooks/useFormState';
import { AddressDetailsForm } from '../AddressDetailsForm';
import { Select } from '../Select';
import './AddressForm.css';
import type { Address } from '../../types';

interface AddressFormProps {
  onSubmit: (data: Address) => void;
}

export function AddressForm({ onSubmit }: AddressFormProps) {
  const {
    country,
    region,
    city,
    addressDetails,
    handleCountryChange,
    handleRegionChange,
    handleCityChange,
    handleAddressDetailsChange,
  } = useFormState();
  const { countries, regions, cities } = useAddressData(country, region);
  const form = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.current?.checkValidity()) {
      onSubmit({ country, region, city, addressDetails });
    } else {
      form.current?.reportValidity();
    }
  };

  return (
    <form ref={form} onSubmit={handleSubmit} className="form" noValidate>
      <div>
        <h2 className="form-title">Delivery address</h2>
        <p className="form-description">
          Use a permanent address where you can receive mail.
        </p>
      </div>

      <div className="form-grid">
        <Select
          label="Country"
          id="country"
          name="country"
          value={country}
          onChange={handleCountryChange}
          required
          options={countries.map((country) => ({
            value: country.code,
            label: country.name,
          }))}
        />

        <Select
          label="Region / Province"
          id="region"
          name="region"
          value={region}
          onChange={handleRegionChange}
          required
          options={regions.map((region) => ({
            value: region.code,
            label: region.name,
          }))}
        />
      </div>

      <Select
        label="City"
        id="city"
        name="city"
        value={city}
        onChange={handleCityChange}
        required
        options={cities.map((city) => ({
          value: city.code,
          label: city.name,
        }))}
      />

      <AddressDetailsForm onChange={handleAddressDetailsChange} />

      <div className="form-action">
        <button
          type="submit"
        >
          Save address
        </button>
      </div>
    </form>
  );
}
