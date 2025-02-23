import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from "expo-constants"

const apiClient = axios.create({
    baseURL: Constants.expoConfig?.extra?.apiUrl,
    timeout: 10000,
});


//Inclusion of token in the header
apiClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;