import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './apiClient';

export const login = async (loginData: { email: string; password: string }) => {
    try {
        console.log('Sending login request with data:', loginData);
        const response = await apiClient.post('/auth/login', loginData);

        // Log the full response to see its structure
        console.log('Full login response data:', JSON.stringify(response.data));

        // Check various possible token field names
        const access_token = response.data.access_token ||
            response.data.token ||
            response.data.accessToken ||
            (response.data.user && response.data.user.token);

        if (access_token) {
            console.log('Storing token:', access_token);
            await AsyncStorage.setItem('authToken', access_token);
        } else {
            console.error('No token received in response');
            throw new Error('Authentication token not found in response');
        }

        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

export const signup = async (signupData: { name: string; email: string; password: string }) => {
    try {
        console.log('Sending signup request with data:', signupData);
        const response = await apiClient.post('/auth/signup', signupData);

        // Log the full response to debug
        console.log('Full signup response data:', JSON.stringify(response.data));

        // Check various possible token field names
        const access_token = response.data.access_token ||
            response.data.token ||
            response.data.accessToken ||
            (response.data.user && response.data.user.token);

        if (access_token) {
            console.log('Storing token:', access_token);
            await AsyncStorage.setItem('authToken', access_token);
        } else {
            // If no token is found but the request was successful,
            // this might be a two-step auth process where login is required after signup
            console.warn('No token received in signup response. User may need to login separately.');

            // Instead of throwing an error, we'll just return the response
            // and let the calling code decide what to do
            return {
                ...response.data,
                requiresLogin: true,
                message: 'Account created, but login required'
            };
        }

        return response.data;
    } catch (error) {
        console.error('Error signing up:', error);
        throw error;
    }
};

export const logout = async () => {
    try {
        await AsyncStorage.removeItem('authToken');
        return { success: true };
    } catch (error) {
        console.error('Error during logout:', error);
        throw error;
    }
};

export const checkAuthToken = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem('authToken');
    } catch (error) {
        console.error('Error checking auth token:', error);
        return null;
    }
};