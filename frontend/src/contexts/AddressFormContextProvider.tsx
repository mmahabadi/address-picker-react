import { useContext, useReducer } from 'react';
import type { AddressDetails } from '../types';
import { AddressFormContext } from './AddressFormContextValue';
import { addressFormReducer, initialState } from './addressFormReducer';

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

// eslint-disable-next-line react-refresh/only-export-components
export function useAddressFormContext() {
  const context = useContext(AddressFormContext);
  if (!context) {
    throw new Error('useAddressForm must be used within a FormProvider');
  }
  return context;
}
