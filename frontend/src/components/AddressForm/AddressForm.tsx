import { useRef, type ChangeEvent } from 'react';
import { useAddressFormContext } from '../../contexts/AddressFormContext';
import { useAddressData } from '../../hooks/useAddressData';
import { AddressDetailsForm } from '../AddressDetailsForm';
import { Select } from '../Select';
import './AddressForm.css';

export function AddressForm() {
  const { country, region, city, setCountry, setRegion, setCity, setIsSubmitted } =
    useAddressFormContext();
  const { countries, regions, cities } = useAddressData(country, region);
  const form = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.current?.checkValidity()) {
      setIsSubmitted(true);
    } else {
      form.current?.reportValidity();
    }
  };

  return (
    <form ref={form} onSubmit={handleSubmit} className="form" noValidate>
      <div>
        <h2 className="form-title">Delivery address</h2>
        <p className="form-description">Use a permanent address where you can receive mail.</p>
      </div>

      <div className="form-grid">
        <Select
          label="Country"
          id="country"
          name="country"
          value={country}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setCountry(e.target.value)}
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
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setRegion(e.target.value)}
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
        onChange={(e: ChangeEvent<HTMLSelectElement>) => setCity(e.target.value)}
        required
        options={cities.map((city) => ({
          value: city.code,
          label: city.name,
        }))}
      />

      <AddressDetailsForm />

      <div className="form-action">
        <button type="submit">Save address</button>
      </div>
    </form>
  );
}
