import { useAddressData } from '../../hooks/useAddressData';
import { useFormState } from '../../hooks/useFormState';
import { AddressDetailsForm } from '../AddressDetailsForm';
import { Select } from '../Select';
import './AddressPicker.css';

export function AddressPicker() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle submission
    console.log({ country, region, city, addressDetails });
  };

  return (
    <form onSubmit={handleSubmit} className="form">
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
          disabled={!country}
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
        disabled={!region}
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
