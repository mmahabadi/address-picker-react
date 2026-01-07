import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AddressFormProvider, useAddressFormContext } from '../../contexts';
import { mockAddressFormContextValue } from '../../test/mock';
import { AddressDetailsForm } from './AddressDetailsForm';

vi.mock('../../contexts/AddressFormContextProvider', async () => {
  const actual = await vi.importActual('../../contexts/AddressFormContextProvider');
  return {
    ...actual,
    useAddressFormContext: vi.fn(),
  };
});

describe('AddressDetailsForm', () => {
  const mockSetAddressDetails = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAddressFormContext).mockReturnValue({
      ...mockAddressFormContextValue,
      setAddressDetails: mockSetAddressDetails,
    });
  });

  it('should render correctly', () => {
    render(<AddressDetailsForm />, { wrapper: AddressFormProvider });

    expect(screen.getByRole('textbox', { name: /street/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /house no/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /apartment/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /postal code/i })).toBeInTheDocument();
  });

  it('should call setAddressDetails when input value changes', async () => {
    render(<AddressDetailsForm />, { wrapper: AddressFormProvider });

    const streetInput = screen.getByRole('textbox', { name: /street/i });
    await userEvent.type(streetInput, 'Test Street');

    expect(mockSetAddressDetails).toHaveBeenCalledWith(
      expect.objectContaining({ street: expect.any(String) })
    );
  });
});
