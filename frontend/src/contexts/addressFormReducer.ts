import type { Address, AddressDetails } from '../types';

export interface State extends Address {
  isSubmitted: boolean;
}

export type Action =
  | { type: 'SET_COUNTRY'; payload: string }
  | { type: 'SET_REGION'; payload: string }
  | { type: 'SET_CITY'; payload: string }
  | { type: 'UPDATE_ADDRESS_DETAILS'; payload: Partial<AddressDetails> }
  | { type: 'SET_IS_SUBMITTED'; payload: boolean };

export const initialState: State = {
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

export function addressFormReducer(state: State, action: Action): State {
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
