import { useAddressFormContext } from '../../contexts/AddressFormContext';
import { useAddressData } from '../../hooks/useAddressData';
import './AddressSummary.css';

export function AddressSummary() {
  const { country, region, city, addressDetails, setIsSubmitted } = useAddressFormContext();
  const { countries, regions, cities } = useAddressData(country, region);

  const countryName = countries.find((c) => c.code === country)?.name || country;
  const regionName = regions.find((r) => r.code === region)?.name || region;
  const cityName = cities.find((c) => c.code === city)?.name || city;

  const handleEdit = () => {
    setIsSubmitted(false);
  };

  return (
    <div className="summary-container">
      <h2 className="summary-title">Delivery Address</h2>

      <div className="summary-section">
        <dl className="summary-list">
          <div className="summary-item">
            <dt>Country</dt>
            <dd>{countryName}</dd>
          </div>
          <div className="summary-item">
            <dt>Region / Province</dt>
            <dd>{regionName}</dd>
          </div>
          <div className="summary-item">
            <dt>City</dt>
            <dd>{cityName}</dd>
          </div>
        </dl>
      </div>

      <div className="summary-section">
        <dl className="summary-list">
          <div className="summary-item">
            <dt>Street</dt>
            <dd>{addressDetails.street}</dd>
          </div>
          <div className="summary-item">
            <dt>House Number</dt>
            <dd>{addressDetails.houseNumber}</dd>
          </div>
          <div className="summary-item">
            <dt>Apartment</dt>
            <dd>{addressDetails.apartment || '-'}</dd>
          </div>
          <div className="summary-item">
            <dt>Postal Code</dt>
            <dd>{addressDetails.postalCode}</dd>
          </div>
        </dl>
      </div>

      <button className="edit-button" onClick={handleEdit}>
        Edit Address
      </button>
    </div>
  );
}
