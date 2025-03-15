import axios from 'axios';
import apiClient from './apiClient';
import { Workout } from '@/app/types/workout/workout';

/**
 * Create a new workout
 * @param workoutData - The workout data to create
 */
export const createWorkout = async (workoutData: Partial<Workout>): Promise<Workout> => {
    try {
        // Transform the workout data to match your backend DTO structure
        const apiData = {
            title: workoutData.name,
            description: workoutData.description,
            workoutType: workoutData.intensity === 'Advanced' ? 'Cardio' : 'Strength',
            difficultyLevel: workoutData.intensity,
            duration: workoutData.duration,
            caloriesBurn: workoutData.caloriesBurn || 0,
            exercises: workoutData.exercises?.map(ex =>
                typeof ex === 'string' ? { name: ex } : ex
            ),
            // No need to manually specify creator, it will be set from the JWT token
        };

        console.log('API client: sending data to backend:', apiData);

        const response = await apiClient.post('/workouts', apiData);

        // Transform the response back to match your frontend model
        const transformedResponse = {
            ...response.data,
            name: response.data.title,
            intensity: response.data.difficultyLevel,
            // Add any other transformations needed
        };

        return transformedResponse;
    } catch (error: unknown) {
        console.error('API client error creating workout:', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            throw new Error('Authentication required. Please log in again.');
        }
        throw error;
    }
};

/**
 * Get all workouts with optional filtering
 * @param queryParams - Optional query parameters to filter workouts
 */
export const getWorkouts = async (queryParams?: {
    creator?: string;
    intensity?: string;
    minDuration?: number;
    maxDuration?: number;
    search?: string;
}): Promise<Workout[]> => {
    try {
        console.log('Fetching workouts with params:', queryParams);
        const response = await apiClient.get('/workouts', { params: queryParams });

        // Process and transform the response
        if (response.data && Array.isArray(response.data)) {
            console.log(`Fetched ${response.data.length} workouts`);
            // Transform each workout to match your frontend model
            return response.data.map(workout => ({
                ...workout,
                name: workout.title,
                intensity: workout.difficultyLevel,
                // Add any other transformations needed
            }));
        } else if (response.data) {
            // Handle nested arrays in response
            const possibleArrayFields = ['results', 'workouts', 'data', 'items'];

            for (const field of possibleArrayFields) {
                if (Array.isArray(response.data[field])) {
                    console.log(`Fetched ${response.data[field].length} workouts from ${field} field`);
                    return response.data[field].map(workout => ({
                        ...workout,
                        name: workout.title,
                        intensity: workout.difficultyLevel,
                    }));
                }
            }

            console.warn('API returned data in unexpected format:', response.data);
            return [];
        } else {
            console.warn('API returned no data');
            return [];
        }
    } catch (error: unknown) {
        console.error('Error fetching workouts:', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            throw new Error('Authentication required. Please log in again.');
        }
        throw error;
    }
};

/**
 * Get workouts created by the current logged-in user
 * Requires authentication
 */
export const getMyWorkouts = async (): Promise<Workout[]> => {
    try {
        console.log('Fetching my workouts');
        const response = await apiClient.get('/workouts/my-workouts');

        if (!response.data) {
            return [];
        }

        // Transform the data to match your frontend model
        const transformedData = Array.isArray(response.data) ?
            response.data.map(workout => ({
                ...workout,
                name: workout.title,
                intensity: workout.difficultyLevel,
            })) : [];

        console.log(`Fetched ${transformedData.length} of my workouts`);
        return transformedData;
    } catch (error: unknown) {
        console.error('Error fetching my workouts:', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            throw new Error('Authentication required. Please log in again.');
        }
        throw error;
    }
};

/**
 * Get a specific workout by ID
 * @param id - The ID of the workout to fetch
 */
export const getWorkoutById = async (id: string): Promise<Workout> => {
    try {
        console.log(`Fetching workout with ID: ${id}`);
        const response = await apiClient.get(`/workouts/${id}`);

        // Transform the response to match your frontend model
        const transformedWorkout = {
            ...response.data,
            name: response.data.title,
            intensity: response.data.difficultyLevel,
            // Map exercises if needed
            exercises: response.data.exercises?.map((ex: any) =>
                typeof ex === 'object' && ex.name ? ex.name : ex
            ),
        };

        console.log('Workout fetched:', transformedWorkout);
        return transformedWorkout;
    } catch (error: unknown) {
        console.error(`Error fetching workout ${id}:`, error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            throw new Error('Authentication required. Please log in again.');
        }
        throw error;
    }
};

/**
 * Update a specific workout
 * @param id - The ID of the workout to update
 * @param updateData - The data to update
 */
export const updateWorkout = async (id: string, updateData: Partial<Workout>): Promise<Workout> => {
    try {
        console.log(`Updating workout ${id} with data:`, updateData);

        // Transform the data to match your backend DTO
        const apiData = {
            title: updateData.name,
            description: updateData.description,
            workoutType: updateData.intensity === 'Advanced' ? 'Cardio' : 'Strength',
            difficultyLevel: updateData.intensity,
            duration: updateData.duration,
            caloriesBurn: updateData.caloriesBurn,
            exercises: updateData.exercises?.map(ex =>
                typeof ex === 'string' ? { name: ex } : ex
            ),
        };

        const response = await apiClient.patch(`/workouts/${id}`, apiData);

        // Transform response back to match frontend model
        const transformedResponse = {
            ...response.data,
            name: response.data.title,
            intensity: response.data.difficultyLevel,
        };

        console.log('Workout updated:', transformedResponse);
        return transformedResponse;
    } catch (error: unknown) {
        console.error(`Error updating workout ${id}:`, error);
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                throw new Error('Authentication required. Please log in again.');
            } else if (error.response?.status === 403) {
                throw new Error('You do not have permission to update this workout.');
            }
        }
        throw error;
    }
};

/**
 * Delete a specific workout
 * @param id - The ID of the workout to delete
 */
export const deleteWorkout = async (id: string): Promise<void> => {
    try {
        console.log(`Deleting workout ${id}`);
        await apiClient.delete(`/workouts/${id}`);
        console.log(`Workout ${id} deleted successfully`);
    } catch (error: unknown) {
        console.error(`Error deleting workout ${id}:`, error);
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                throw new Error('Authentication required. Please log in again.');
            } else if (error.response?.status === 403) {
                throw new Error('You do not have permission to delete this workout.');
            }
        }
        throw error;
    }
};