import apiClient from './apiClient';
import { User, CreateUserDto, UpdateUserDto } from '@/app/types/user';

export const getUsers = async (): Promise<User[]> => {
    try {
        const response = await apiClient.get('/users');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const getUserById = async (id: string): Promise<User> => {
    try {
        const response = await apiClient.get(`/users/${id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

export const createUser = async (userData: CreateUserDto): Promise<User> => {
    try {
        const response = await apiClient.post('/users', userData);
        return response.data.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

export const updateUser = async (id: string, userData: UpdateUserDto): Promise<User> => {
    try {
        const response = await apiClient.patch(`/users/${id}`, userData);
        return response.data.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

export const deleteUser = async (id: string): Promise<User> => {
    try {
        const response = await apiClient.delete(`/users/${id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};