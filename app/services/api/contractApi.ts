import apiClient from './apiClient';
import { AxiosError } from 'axios';
import {
    Contract,
    ContractStatus,
} from '@/app/types/contract';



// Types matching your backend schema


// Request types
export interface HireTrainerRequest {
    trainerId: string;
    startDate: Date | string;
    endDate?: Date | string;
    totalSessions: number;
    notes?: string;
}

export interface UpdateContractStatusRequest {
    status: ContractStatus;
}

// API functions

// Hire a trainer
export const hireTrainer = async (request: HireTrainerRequest): Promise<Contract> => {
    try {
        const response = await apiClient.post('/training-contracts/hire', request);
        return response.data;
    } catch (error) {
        console.error('Error hiring trainer:', error);
        throw error;
    }
};

// Get contracts where current user is the client
export const getClientContracts = async (): Promise<Contract[]> => {
    try {
        const response = await apiClient.get('/training-contracts/client');
        return response.data;
    } catch (error) {
        console.error('Error fetching client contracts:', error);
        throw error;
    }
};

// Get contracts where current user is the trainer
export const getTrainerContracts = async (): Promise<Contract[]> => {
    try {
        const response = await apiClient.get('/training-contracts/trainer');
        return response.data;
    } catch (error) {
        console.error('Error fetching trainer contracts:', error);
        throw error;
    }
};

// Update contract status (for trainers to accept/reject/complete)
export const updateContractStatus = async (
    contractId: string,
    statusRequest: UpdateContractStatusRequest
): Promise<Contract> => {
    try {
        const response = await apiClient.patch(`/training-contracts/${contractId}/status`, statusRequest);
        return response.data;
    } catch (error) {
        console.error('Error updating contract status:', error);
        throw error;
    }
};

// Add a workout to a contract
export const addWorkoutToContract = async (
    contractId: string,
    workoutId: string
): Promise<Contract> => {
    try {
        const response = await apiClient.post(`/training-contracts/${contractId}/workouts/${workoutId}`);
        return response.data;
    } catch (error) {
        console.error('Error adding workout to contract:', error);
        throw error;
    }
};