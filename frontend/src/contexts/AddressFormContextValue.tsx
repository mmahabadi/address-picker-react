import { createContext } from 'react';
import type { Address, AddressDetails } from '../types';

export interface AddressFormContext extends Address {
  isSubmitted: boolean;
  setIsSubmitted: (isSubmitted: boolean) => void;
  setCountry: (country: string) => void;
  setRegion: (region: string) => void;
  setCity: (city: string) => void;
  setAddressDetails: (addressDetails: Partial<AddressDetails>) => void;
}

export const AddressFormContext = createContext<AddressFormContext | null>(null);
