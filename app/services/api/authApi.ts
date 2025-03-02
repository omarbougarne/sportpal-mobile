import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './apiClient';

export const login = async (loginData: { email: string; password: string }) => {
    try {
        console.log('Sending login request with data:', loginData);
        const response = await apiClient.post('/auth/login', loginData);
        console.log('Received login response:', response.data.access_token);

        const access_token = response.data.access_token;

        if (access_token) {
            console.log('Storing token:', access_token);
            await AsyncStorage.setItem('authToken', access_token);
        } else {
            console.error('No token received');
            throw new Error('No token received');
        }

        console.log(response.data);
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
        console.log('Received signup response:', response.data.access_token);

        const access_token = response.data.access_token;

        if (access_token) {
            console.log('Storing token:', access_token);
            await AsyncStorage.setItem('authToken', access_token);
        } else {
            console.error('No token received');
            throw new Error('No token received');
        }

        return response.data;
    } catch (error) {
        console.error('Error signing up:', error);
        throw error;
    }
};