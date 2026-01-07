import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AddressFormProvider, useAddressFormContext } from '../../contexts';
import { AddressForm } from '../AddressForm';
import { AddressSummary } from '../AddressSummary';
import { AddressPicker } from './AddressPicker';
import { mockAddressFormContextValue } from '../../test/mock';

vi.mock('../AddressForm', () => ({
  AddressForm: vi.fn(),
}));
vi.mock('../AddressSummary', () => ({
  AddressSummary: vi.fn(),
}));

vi.mock('../../contexts/AddressFormContextProvider', async () => {
  const actual = await vi.importActual('../../contexts/AddressFormContextProvider');
  return {
    ...actual,
    useAddressFormContext: vi.fn(),
  };
});

describe('AddressPicker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAddressFormContext).mockReturnValue(mockAddressFormContextValue);
    vi.mocked(AddressForm).mockImplementation(() => <div>AddressForm</div>);
    vi.mocked(AddressSummary).mockImplementation(() => <div>AddressSummary</div>);
  });

  it('should render AddressForm when isSubmitted is false', () => {
    render(<AddressPicker />, { wrapper: AddressFormProvider });
    expect(screen.getByText('AddressForm')).toBeInTheDocument();
  });

  it('should render AddressSummary when isSubmitted is true', () => {
    vi.mocked(useAddressFormContext).mockReturnValue({
      ...mockAddressFormContextValue,
      isSubmitted: true,
    });
    render(<AddressPicker />, { wrapper: AddressFormProvider });
    expect(screen.getByText('AddressSummary')).toBeInTheDocument();
  });
});
