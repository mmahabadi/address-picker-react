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
