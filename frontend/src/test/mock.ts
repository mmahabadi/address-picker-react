import { vi } from 'vitest';
import { initialState } from '../contexts/addressFormReducer';
import type { AddressFormContext } from '../contexts';
import type { AddressDataValues } from '../types';

export const mockAddressFormContextValue: AddressFormContext = {
  ...initialState,
  setCountry: vi.fn(),
  setRegion: vi.fn(),
  setCity: vi.fn(),
  setIsSubmitted: vi.fn(),
  setAddressDetails: vi.fn(),
};

export const mockAddressDataValue: AddressDataValues = {
  countries: [
    {
      code: 'NL',
      name: 'Netherlands',
    },
  ],
  regions: [
    {
      code: 'NL-NH',
      name: 'North Holland',
      countryCode: 'NL',
    },
  ],
  cities: [
    {
      code: 'NL-AMS',
      name: 'Amsterdam',
      regionCode: 'NL-NH',
    },
  ],
  loading: {
    countries: false,
    regions: false,
    cities: false,
  },
  error: {
    countries: undefined,
    regions: undefined,
    cities: undefined,
  },
};
