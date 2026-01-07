import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AddressFormProvider, useAddressFormContext } from '../../contexts';
import { useAddressData } from '../../hooks/useAddressData';
import { mockAddressDataValue, mockAddressFormContextValue } from '../../test/mock';
import { AddressSummary } from './AddressSummary';

vi.mock('../../hooks/useAddressData', () => ({
  useAddressData: vi.fn(),
}));

vi.mock('../../contexts/AddressFormContextProvider', async () => {
  const actual = await vi.importActual('../../contexts/AddressFormContextProvider');
  return {
    ...actual,
    useAddressFormContext: vi.fn(),
  };
});

describe('AddressSummary', () => {
  const mockSetIsSubmitted = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAddressFormContext).mockReturnValue({
      ...mockAddressFormContextValue,
      setIsSubmitted: mockSetIsSubmitted,
    });
    vi.mocked(useAddressData).mockReturnValue(mockAddressDataValue);
  });

  it('should render correctly', () => {
    render(<AddressSummary />, { wrapper: AddressFormProvider });

    expect(screen.getByText('Delivery Address')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit address/i })).toBeInTheDocument();
    expect(screen.getByText('Country')).toBeInTheDocument();
    expect(screen.getByText('Region / Province')).toBeInTheDocument();
    expect(screen.getByText('City')).toBeInTheDocument();
    expect(screen.getByText('Street')).toBeInTheDocument();
    expect(screen.getByText('House Number')).toBeInTheDocument();
    expect(screen.getByText('Apartment')).toBeInTheDocument();
    expect(screen.getByText('Postal Code')).toBeInTheDocument();
  });

  it('should render address details correctly', () => {
    vi.mocked(useAddressFormContext).mockReturnValue({
      ...mockAddressFormContextValue,
      addressDetails: {
        street: 'Test Street',
        houseNumber: '123',
        apartment: '13',
        postalCode: '114AA',
      },
    });
    render(<AddressSummary />, { wrapper: AddressFormProvider });

    expect(screen.getByText('Test Street')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('13')).toBeInTheDocument();
    expect(screen.getByText('114AA')).toBeInTheDocument();
  });

  it('should call setIsSubmitted when edit button is clicked', async () => {
    render(<AddressSummary />, { wrapper: AddressFormProvider });

    const editButton = screen.getByRole('button', { name: /edit address/i });
    await userEvent.click(editButton);

    expect(mockSetIsSubmitted).toHaveBeenCalled();
    expect(mockSetIsSubmitted).toHaveBeenCalledWith(false);
  });
});
