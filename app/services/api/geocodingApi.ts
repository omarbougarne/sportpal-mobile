// geocodingApi.ts
import * as Location from 'expo-location';
import { Alert } from 'react-native';

interface LocationResult {
    coordinates: {
        latitude: number;
        longitude: number;
    };
    locationName?: string;
}

// Modified to return the location info instead of trying to set state
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

        // You could also get a readable address if needed
        const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (geocode && geocode.length > 0) {
            const address = geocode[0];
            result.locationName = `${address.city || ''}, ${address.region || ''}, ${address.country || ''}`;
        }

        return result;

    } catch (error) {
        console.error("Error getting location:", error);
        Alert.alert("Error", "Could not retrieve your current location");
        return null;
    }
}