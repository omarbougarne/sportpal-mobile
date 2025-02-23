import apiClient from './apiClient';
import { SignUpData, LoginData } from '@/app/types/auth';

export const signUp = async (userData: SignUpData) => {
    try {
        const response = await apiClient.post('/auth/signup', userData);
        return response.data;
    } catch (error) {
        console.error('Error signing up:', error);
        throw error;
    }
};

export const login = async (userData: LoginData) => {
    try {
        const response = await apiClient.post('/auth/login', userData);
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};