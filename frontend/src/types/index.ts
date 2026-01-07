interface Location {
  code: string;
  name: string;
}

export interface Country extends Location { }

export interface Region extends Location {
  countryCode: string;
}

export interface City extends Location {
  regionCode: string;
}

export interface AddressDetails {
  street: string;
  houseNumber: string;
  apartment: string;
  postalCode: string;
}

export interface Address {
  country: string;
  region: string;
  city: string;
  addressDetails: AddressDetails
}