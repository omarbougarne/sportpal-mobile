import apiClient from './apiClient';
import { Workout } from '@/app/types/workout'; // Import from your types folder

/**
 * Create a new workout
 * @param workoutData - The workout data to create
 */
export const createWorkout = async (workoutData: Partial<Workout>): Promise<Workout> => {
    try {
        // Transform the workout data to match your backend DTO structure
        const apiData = {
            title: workoutData.name,  // Convert from name to title for backend
            description: workoutData.description,
            workoutType: workoutData.intensity === 'ADVANCED' ? 'CARDIO' : 'STRENGTH',  // Map as needed
            difficultyLevel: workoutData.intensity,
            duration: workoutData.duration,
            caloriesBurn: 0,  // Default value since it's required by backend
            exercises: workoutData.exercises?.map(ex => ({ name: ex })),  // Transform to objects
            creator: workoutData.creator,
        };

        console.log('API client: sending data to backend:', apiData);

        const response = await apiClient.post('/workouts', apiData);
        return response.data;
    } catch (error: any) {
        console.error('API client error:', error);
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

        // Check if response.data exists and is an array
        if (response.data && Array.isArray(response.data)) {
            console.log(`Fetched ${response.data.length} workouts`);
            return response.data;
        } else if (response.data) {
            // If data exists but isn't an array, check if it has a results property
            // Many APIs return { results: [] } or { workouts: [] }
            const possibleArrayFields = ['results', 'workouts', 'data', 'items'];

            for (const field of possibleArrayFields) {
                if (Array.isArray(response.data[field])) {
                    console.log(`Fetched ${response.data[field].length} workouts from ${field} field`);
                    return response.data[field];
                }
            }

            // If we get here and data exists but not in expected format
            console.warn('API returned data in unexpected format:', response.data);
            return [];
        } else {
            // No data at all
            console.warn('API returned no data');
            return [];
        }
    } catch (error) {
        console.error('Error fetching workouts:', error);
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
        console.log(`Fetched ${response.data.length} of my workouts`);
        return response.data;
    } catch (error) {
        console.error('Error fetching my workouts:', error);
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
        console.log('Workout fetched:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching workout ${id}:`, error);
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
        const response = await apiClient.patch(`/workouts/${id}`, updateData);
        console.log('Workout updated:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error updating workout ${id}:`, error);
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
    } catch (error) {
        console.error(`Error deleting workout ${id}:`, error);
        throw error;
    }
};