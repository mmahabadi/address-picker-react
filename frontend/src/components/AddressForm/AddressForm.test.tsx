import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AddressFormProvider, useAddressFormContext } from '../../contexts';
import { useAddressData } from '../../hooks/useAddressData';
import { AddressForm } from './AddressForm';
import { mockAddressDataValue, mockAddressFormContextValue } from '../../test/mock';

// Mock the hooks
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

describe('AddressForm', () => {
  const mockSetIsSubmitted = vi.fn();
  const mockReportValidity = vi.fn();
  const mockCheckValidity = vi.fn().mockReturnValue(false);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAddressFormContext).mockReturnValue({
      ...mockAddressFormContextValue,
      setIsSubmitted: mockSetIsSubmitted,
    });
    vi.mocked(useAddressData).mockReturnValue(mockAddressDataValue);
  });

  it('should render correctly', () => {
    render(<AddressForm />, { wrapper: AddressFormProvider });

    expect(screen.getByText('Delivery address')).toBeInTheDocument();
    expect(
      screen.getByText('Use a permanent address where you can receive mail.')
    ).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /country/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /region.*province/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /city/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /street/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /house no/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /apartment/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /postal code/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save address/i })).toBeInTheDocument();
  });

  it('should not submit form when invalid', async () => {
    const { container } = render(<AddressForm />, { wrapper: AddressFormProvider });
    const form = container.querySelector('form') as HTMLFormElement;
    vi.spyOn(form, 'checkValidity').mockImplementation(mockCheckValidity);
    vi.spyOn(form, 'reportValidity').mockImplementation(mockReportValidity);

    const submitButton = screen.getByRole('button', { name: /save address/i });
    await userEvent.click(submitButton);

    expect(form).toBeTruthy();
    expect(mockCheckValidity).toHaveBeenCalled();
    expect(mockReportValidity).toHaveBeenCalled();
    expect(mockSetIsSubmitted).not.toHaveBeenCalled();
  });

  it('should submit form when valid', async () => {
    const { container } = render(<AddressForm />, { wrapper: AddressFormProvider });
    vi.mocked(mockCheckValidity).mockReturnValue(true);
    const form = container.querySelector('form') as HTMLFormElement;
    vi.spyOn(form, 'checkValidity').mockImplementation(mockCheckValidity);
    vi.spyOn(form, 'reportValidity').mockImplementation(mockReportValidity);

    const submitButton = screen.getByRole('button', { name: /save address/i });
    await userEvent.click(submitButton);

    expect(form).toBeTruthy();
    expect(mockCheckValidity).toHaveBeenCalled();
    expect(mockReportValidity).not.toHaveBeenCalled();
    expect(mockSetIsSubmitted).toHaveBeenCalled();
  });
});
