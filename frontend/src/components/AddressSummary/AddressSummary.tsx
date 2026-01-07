import type { Address } from '../../types';
import './AddressSummary.css';

interface AddressSummaryProps extends Address {
  onEdit: () => void;
}

export function AddressSummary({ country, region, city, addressDetails, onEdit }: AddressSummaryProps) {
  return (
    <div className="summary-container">
      <h2 className="summary-title">Delivery Address</h2>

      <div className="summary-section">
        <dl className="summary-list">
          <div className="summary-item">
            <dt>Country</dt>
            <dd>{country}</dd>
          </div>
          <div className="summary-item">
            <dt>Region / Province</dt>
            <dd>{region}</dd>
          </div>
          <div className="summary-item">
            <dt>City</dt>
            <dd>{city}</dd>
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

      <button className="edit-button" onClick={onEdit}>
        Edit Address
      </button>
    </div>
  );
}
