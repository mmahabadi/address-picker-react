import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AddressFormProvider, useAddressFormContext } from './index';

describe('AddressFormContext', () => {
  describe('useAddressFormContext', () => {
    it('should throw error when used outside provider', () => {
      expect(() => {
        renderHook(() => useAddressFormContext());
      }).toThrow('useAddressForm must be used within a FormProvider');
    });

    it('should provide initial state values', () => {
      const { result } = renderHook(() => useAddressFormContext(), {
        wrapper: AddressFormProvider,
      });

      expect(result.current.country).toBe('');
      expect(result.current.region).toBe('');
      expect(result.current.city).toBe('');
      expect(result.current.isSubmitted).toBe(false);
      expect(result.current.addressDetails).toEqual({
        street: '',
        houseNumber: '',
        apartment: '',
        postalCode: '',
      });
    });

    it('should update country and reset dependent fields', () => {
      const { result } = renderHook(() => useAddressFormContext(), {
        wrapper: AddressFormProvider,
      });

      act(() => {
        result.current.setCountry('NL');
        result.current.setRegion('NL-NH');
        result.current.setCity('Amsterdam');
      });

      expect(result.current.country).toBe('NL');
      expect(result.current.region).toBe('NL-NH');
      expect(result.current.city).toBe('Amsterdam');

      act(() => {
        result.current.setCountry('US');
      });

      expect(result.current.country).toBe('US');
      expect(result.current.region).toBe('');
      expect(result.current.city).toBe('');
    });

    it('should update region and reset city', () => {
      const { result } = renderHook(() => useAddressFormContext(), {
        wrapper: AddressFormProvider,
      });

      act(() => {
        result.current.setRegion('NL-NH');
        result.current.setCity('Amsterdam');
      });

      expect(result.current.region).toBe('NL-NH');
      expect(result.current.city).toBe('Amsterdam');

      // Change region should reset city
      act(() => {
        result.current.setRegion('NL-NB');
      });

      expect(result.current.region).toBe('NL-NB');
      expect(result.current.city).toBe('');
    });

    it('should update city', () => {
      const { result } = renderHook(() => useAddressFormContext(), {
        wrapper: AddressFormProvider,
      });

      act(() => {
        result.current.setCity('Amsterdam');
      });

      expect(result.current.city).toBe('Amsterdam');
    });

    it('should update address details', () => {
      const { result } = renderHook(() => useAddressFormContext(), {
        wrapper: AddressFormProvider,
      });

      act(() => {
        result.current.setAddressDetails({ street: 'Test Street' });
      });

      expect(result.current.addressDetails).toEqual(
        expect.objectContaining({ street: 'Test Street' })
      );
    });

    it('should update isSubmitted', () => {
      const { result } = renderHook(() => useAddressFormContext(), {
        wrapper: AddressFormProvider,
      });

      act(() => {
        result.current.setIsSubmitted(true);
      });

      expect(result.current.isSubmitted).toBe(true);
    });
  });
});
