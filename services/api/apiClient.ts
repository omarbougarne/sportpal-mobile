import axios from 'axios';
import Constants from "expo-constants"

const apiClient = axios.create({
    baseURL: Constants.expoConfig?.extra?.apiUrl,
    timeout: 10000,
})

export default apiClient;