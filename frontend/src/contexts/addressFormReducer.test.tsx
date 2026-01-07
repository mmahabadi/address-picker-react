import { describe, expect, it } from 'vitest';
import { addressFormReducer, initialState, type Action, type State } from './addressFormReducer';

describe('addressFormReducer', () => {
  it('should return initial state by default', () => {
    const result = addressFormReducer(initialState, {
      type: 'UNKNOWN' as const,
      payload: false,
    } as unknown as Action);
    expect(result).toEqual(initialState);
  });

  it('should handle SET_COUNTRY action', () => {
    const action = { type: 'SET_COUNTRY' as const, payload: 'NL' };
    const result = addressFormReducer(initialState, action);

    expect(result).toEqual({
      ...initialState,
      country: 'NL',
      region: '',
      city: '',
    });
  });

  it('should reset region and city when country changes', () => {
    const stateWithData: State = {
      ...initialState,
      country: 'NL',
      region: 'NL-NH',
      city: 'Amsterdam',
    };

    const action = { type: 'SET_COUNTRY' as const, payload: 'US' };
    const result = addressFormReducer(stateWithData, action);

    expect(result).toEqual({
      ...stateWithData,
      country: 'US',
      region: '',
      city: '',
    });
  });

  it('should handle SET_REGION action', () => {
    const action = { type: 'SET_REGION' as const, payload: 'NL-NH' };
    const result = addressFormReducer(initialState, action);

    expect(result).toEqual({
      ...initialState,
      region: 'NL-NH',
      city: '',
    });
  });

  it('should reset city when region changes', () => {
    const stateWithData: State = {
      ...initialState,
      country: 'NL',
      region: 'NL-NH',
      city: 'Amsterdam',
    };

    const action = { type: 'SET_REGION' as const, payload: 'NL-NB' };
    const result = addressFormReducer(stateWithData, action);

    expect(result).toEqual({
      ...stateWithData,
      region: 'NL-NB',
      city: '',
    });
  });

  it('should handle SET_CITY action', () => {
    const action = { type: 'SET_CITY' as const, payload: 'Amsterdam' };
    const result = addressFormReducer(initialState, action);

    expect(result).toEqual({
      ...initialState,
      city: 'Amsterdam',
    });
  });
  it('should handle UPDATE_ADDRESS_DETAILS action', () => {
    const action = {
      type: 'UPDATE_ADDRESS_DETAILS' as const,
      payload: { street: 'Test Street' },
    };
    const result = addressFormReducer(initialState, action);

    expect(result).toEqual({
      ...initialState,
      addressDetails: expect.objectContaining({ street: 'Test Street' }),
    });
  });

  it('should handle SET_IS_SUBMITTED action', () => {
    const action = { type: 'SET_IS_SUBMITTED' as const, payload: true };
    const result = addressFormReducer(initialState, action);

    expect(result).toEqual({
      ...initialState,
      isSubmitted: true,
    });
  });
});
