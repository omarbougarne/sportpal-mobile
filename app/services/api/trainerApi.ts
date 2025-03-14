import apiClient from './apiClient';

// Add the new becomeTrainer function
export const becomeTrainer = async (userId: string, trainerData: any) => {
    try {
        // Using the endpoint that matches your backend controller
        const response = await apiClient.post('/trainers/become-trainer', {
            ...trainerData
            // The userId will be extracted from JWT token on the backend
        });
        return response.data;
    } catch (error) {
        console.error('Error becoming trainer:', error);
        throw error;
    }
};

export const createTrainer = async (createTrainerDto: any) => {
    try {
        const response = await apiClient.post('/trainers', createTrainerDto);
        return response.data;
    } catch (error) {
        console.error('Error creating trainer:', error);
        throw error;
    }
};

export const getTrainers = async (query: any) => {
    try {
        const response = await apiClient.get('/trainers', { params: query });
        return response.data;
    } catch (error) {
        console.error('Error fetching trainers:', error);
        throw error;
    }
};

export const getTrainerById = async (id: string) => {
    try {
        const response = await apiClient.get(`/trainers/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching trainer:', error);
        throw error;
    }
};

export const getTrainerByUserId = async (userId: string) => {
    try {
        const response = await apiClient.get(`/trainers/user/${userId}`);
        return response.data;
    } catch (error) {
        // Don't treat 404 as an error when checking for trainer profiles
        if ((error as any).response && (error as any).response.status === 404) {
            return null; // User doesn't have a trainer profile yet
        }
        console.error('Error fetching trainer by user ID:', error);
        throw error;
    }
};

// Add this method to get current user's trainer profile using JWT
export const getMyTrainerProfile = async () => {
    try {
        const response = await apiClient.get('/trainers/profile');
        return response.data;
    } catch (error) {
        // Don't treat 404 as an error
        if (error.response && error.response.status === 404) {
            return null;
        }
        console.error('Error fetching my trainer profile:', error);
        throw error;
    }
};

export const updateTrainer = async (id: string, updateTrainerDto: any) => {
    try {
        const response = await apiClient.patch(`/trainers/${id}`, updateTrainerDto);
        return response.data;
    } catch (error) {
        console.error('Error updating trainer:', error);
        throw error;
    }
};

export const deleteTrainer = async (id: string) => {
    try {
        const response = await apiClient.delete(`/trainers/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting trainer:', error);
        throw error;
    }
};

export const addReview = async (id: string, reviewDto: any) => {
    try {
        const response = await apiClient.post(`/trainers/${id}/review`, reviewDto);
        return response.data;
    } catch (error) {
        console.error('Error adding review:', error);
        throw error;
    }
};

export const addWorkout = async (id: string, workoutId: string) => {
    try {
        const response = await apiClient.post(`/trainers/${id}/workouts/${workoutId}`);
        return response.data;
    } catch (error) {
        console.error('Error adding workout:', error);
        throw error;
    }
};