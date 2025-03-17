import apiClient from './apiClient';

export async function getLocationById(locationId: string) {
    try {
        const response = await apiClient.get(`/locations/${locationId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching location details:', error);
        return null;
    }
}



