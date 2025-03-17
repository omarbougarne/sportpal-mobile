import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './apiClient';
import { User, CreateUserDto, UpdateUserDto } from '@/app/types/user';

export const getUsers = async (): Promise<User[]> => {
    try {
        const response = await apiClient.get('/users');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

// Update your getUserById function to match your actual API structure
export async function getUserById(userId: string) {
    try {
        // You may need to update this endpoint to match your actual API
        // For example, it might be /api/users/ or /users/profile/ instead
        const response = await apiClient.get(`/users/${userId}`);
        return response.data;
    } catch (error) {
        console.warn(`Could not fetch user with ID ${userId}:`, error);
        // Return a minimal user object to prevent UI errors
        return {
            _id: userId,
            name: "Unknown User",
        };
    }
}

export const createUser = async (userData: CreateUserDto): Promise<User> => {
    try {
        const response = await apiClient.post('/users', userData);
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

export const updateUser = async (id: string, userData: UpdateUserDto): Promise<User> => {
    try {
        const response = await apiClient.patch(`/users/${id}`, userData);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

export const deleteUser = async (id: string): Promise<User> => {
    try {
        const response = await apiClient.delete(`/users/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};


export const fetchCurrentUser = async (): Promise<User | null> => {
    try {
        const response = await apiClient.get('/users/me');
        return response.data;
    } catch (error) {
        console.error('Error fetching current user:', error);
        return null; // Return null instead of undefined on error
    }
};