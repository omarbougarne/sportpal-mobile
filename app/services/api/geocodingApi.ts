import * as Location from 'expo-location';
import { Alert } from 'react-native';

export interface LocationResult {
    coordinates: {
        latitude: number;
        longitude: number;
    };
    locationName?: string;
}

// Function to get current location
export const getCurrentLocation = async (): Promise<LocationResult | null> => {
    try {
        // Request permissions first
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
            return null;
        }

        // Get current position
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        // Create result object
        const result: LocationResult = {
            coordinates: { latitude, longitude }
        };

        // Get readable address
        const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (geocode && geocode.length > 0) {
            const address = geocode[0];

            // Create a clean location name with available data
            let locationParts = [];
            if (address.city) locationParts.push(address.city);
            if (address.region) locationParts.push(address.region);
            if (address.country) locationParts.push(address.country);

            result.locationName = locationParts.join(', ') || 'Unknown location';
        }

        return result;
    } catch (error) {
        console.error("Error getting location:", error);
        Alert.alert("Error", "Could not retrieve your current location");
        return null;
    }
};

// Function to search locations by name
export const searchLocations = async (query: string) => {
    if (!query || query.length < 2) return [];

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
        );

        const data = await response.json();

        if (!Array.isArray(data)) {
            console.error('Invalid response from location search API');
            return [];
        }

        return data.slice(0, 5); // Limit to 5 results
    } catch (error) {
        console.error('Error searching locations:', error);
        return [];
    }
};