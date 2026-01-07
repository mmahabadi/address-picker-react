import { createContext, useContext, useReducer } from 'react';
import type { Address, AddressDetails } from '../types';

export interface AddressFormContext extends Address {
  isSubmitted: boolean;
  setIsSubmitted: (isSubmitted: boolean) => void;
  setCountry: (country: string) => void;
  setRegion: (region: string) => void;
  setCity: (city: string) => void;
  setAddressDetails: (addressDetails: Partial<AddressDetails>) => void;
}

const AddressFormContext = createContext<AddressFormContext | null>(null);

interface State extends Address {
  isSubmitted: boolean;
}

type Action =
  | { type: 'SET_COUNTRY'; payload: string }
  | { type: 'SET_REGION'; payload: string }
  | { type: 'SET_CITY'; payload: string }
  | { type: 'UPDATE_ADDRESS_DETAILS'; payload: Partial<AddressDetails> }
  | { type: 'SET_IS_SUBMITTED'; payload: boolean };

const initialState: State = {
  country: '',
  region: '',
  city: '',
  addressDetails: {
    street: '',
    houseNumber: '',
    apartment: '',
    postalCode: '',
  },
  isSubmitted: false,
};

function addressFormReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_COUNTRY':
      return {
        ...state,
        country: action.payload,
        region: '', // Reset dependent fields
        city: '',
      };
    case 'SET_REGION':
      return {
        ...state,
        region: action.payload,
        city: '', // Reset dependent field
      };
    case 'SET_CITY':
      return {
        ...state,
        city: action.payload,
      };
    case 'UPDATE_ADDRESS_DETAILS':
      return {
        ...state,
        addressDetails: {
          ...state.addressDetails,
          ...action.payload,
        },
      };
    case 'SET_IS_SUBMITTED':
      return {
        ...state,
        isSubmitted: action.payload,
      };
    default:
      return state;
  }
}

export function AddressFormProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(addressFormReducer, initialState);

  const setCountry = (country: string) => dispatch({ type: 'SET_COUNTRY', payload: country });
  const setRegion = (region: string) => dispatch({ type: 'SET_REGION', payload: region });
  const setCity = (city: string) => dispatch({ type: 'SET_CITY', payload: city });
  const setAddressDetails = (details: Partial<AddressDetails>) =>
    dispatch({ type: 'UPDATE_ADDRESS_DETAILS', payload: details });
  const setIsSubmitted = (isSubmitted: boolean) =>
    dispatch({ type: 'SET_IS_SUBMITTED', payload: isSubmitted });

  return (
    <AddressFormContext.Provider
      value={{
        ...state,
        setCountry,
        setRegion,
        setCity,
        setAddressDetails,
        setIsSubmitted,
      }}
    >
      {children}
    </AddressFormContext.Provider>
  );
}

export function useAddressFormContext() {
  const context = useContext(AddressFormContext);
  if (!context) {
    throw new Error('useAddressForm must be used within a FormProvider');
  }
  return context;
}
