import { useState, type ChangeEvent } from 'react';
import type { AddressDetails } from '../types';

export function useFormState() {
    const [country, setCountry] = useState('');
    const [region, setRegion] = useState('');
    const [city, setCity] = useState('');
    const [addressDetails, setAddressDetails] = useState<AddressDetails>({
        street: '',
        houseNumber: '',
        apartment: '',
        postalCode: '',
    });

    const handleCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setCountry(e.target.value);
        setRegion('');
        setCity('');
    };

    const handleRegionChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setRegion(e.target.value);
        setCity('');
    };

    const handleCityChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setCity(e.target.value);
    };

    const handleAddressDetailsChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddressDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return {
        country,
        region,
        city,
        addressDetails,
        handleCountryChange,
        handleRegionChange,
        handleCityChange,
        handleAddressDetailsChange,
    };
}
