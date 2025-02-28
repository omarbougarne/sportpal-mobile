import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

const apiClient = axios.create({
    baseURL: Constants.expoConfig?.extra?.apiUrl,
    timeout: 10000,
});

// Log the baseURL 
// console.log('API Base URL:', Constants.expoConfig?.extra?.apiUrl);

// Inclusion of token in the header
apiClient.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            // console.log(token);

            if (token) {
                // console.log('Adding token to headers:', token);
                config.headers.Authorization = `Bearer ${token}`;
            } else {
                console.log('No token found in AsyncStorage');
            }
        } catch (error) {
            console.error('Error retrieving token from AsyncStorage:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;