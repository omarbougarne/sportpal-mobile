import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './apiClient';

export const login = async (loginData: { email: string; password: string }) => {
    try {
        console.log('Sending login request with data:', loginData);
        const response = await apiClient.post('/auth/login', loginData);
        console.log('Received login response:', response.data.data.access_token);

        const access_token = response.data.data.access_token;

        if (access_token) {
            console.log('Storing token:', access_token);
            await AsyncStorage.setItem('authToken', access_token);
        } else {
            console.error('No token received');
            throw new Error('No token received');
        }

        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};