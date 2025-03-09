import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Workout } from '@/app/types/workout';
import { getWorkouts as apiFetchWorkouts, 
         getWorkoutById, 
         createWorkout as apiCreateWorkout,
         updateWorkout as apiUpdateWorkout,
         deleteWorkout as apiDeleteWorkout } from '@/app/services/api/workoutApi';

// Update the interface to include the missing properties
interface WorkoutContextType {
  workouts: Workout[];
  currentWorkout: Workout | null;
  loading: boolean;
  error: string | null;
  fetchWorkouts: () => Promise<void>;
  getWorkout: (id: string) => Promise<Workout | null>;
  createWorkout: (workout: Partial<Workout>) => Promise<Workout>;
  editWorkout: (id: string, workout: Partial<Workout>) => Promise<Workout>;
  deleteWorkout: (id: string) => Promise<boolean>;
  setCurrentWorkout: (workout: Workout | null) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiFetchWorkouts();
      setWorkouts(data);
    } catch (err: any) {
      console.error('Error fetching workouts:', err);
      setError(err.message || 'Failed to fetch workouts');
    } finally {
      setLoading(false);
    }
  };

  const getWorkout = async (id: string): Promise<Workout | null> => {
    try {
      setLoading(true);
      setError(null);
      const workout = await getWorkoutById(id);
      setCurrentWorkout(workout);
      return workout;
    } catch (err: any) {
      console.error(`Error fetching workout ${id}:`, err);
      setError(err.message || 'Failed to fetch workout details');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createWorkout = async (workoutData: any): Promise<Workout> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Creating workout with frontend data:', workoutData);
      
      // Send data as-is to the API - don't try to transform it here
      // Let the API client handle any necessary transformations
      const newWorkout = await apiCreateWorkout(workoutData);
      
      console.log('API response - New workout created:', newWorkout);
      
      // Update state with the new workout
      setWorkouts(prev => [...prev, newWorkout]);
      return newWorkout;
    } catch (err: any) {
      console.error('Error creating workout:', err);
      
      if (err.response) {
        console.error('API error response:', {
          status: err.response.status,
          data: err.response.data
        });
      }
      
      setError(err.message || 'Failed to create workout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editWorkout = async (id: string, workoutData: Partial<Workout>): Promise<Workout> => {
    try {
      setLoading(true);
      setError(null);
      const updatedWorkout = await apiUpdateWorkout(id, workoutData);
      setWorkouts(prev => prev.map(w => w._id === id ? updatedWorkout : w));
      setCurrentWorkout(updatedWorkout);
      return updatedWorkout;
    } catch (err: any) {
      console.error(`Error updating workout ${id}:`, err);
      setError(err.message || 'Failed to update workout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkout = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await apiDeleteWorkout(id);
      setWorkouts(prev => prev.filter(w => w._id !== id));
      if (currentWorkout?._id === id) {
        setCurrentWorkout(null);
      }
      return true;
    } catch (err: any) {
      console.error(`Error deleting workout ${id}:`, err);
      setError(err.message || 'Failed to delete workout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <WorkoutContext.Provider value={{
      workouts,
      currentWorkout,
      loading,
      error,
      fetchWorkouts,
      getWorkout,
      createWorkout,
      editWorkout,
      deleteWorkout,
      setCurrentWorkout,
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkouts = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkouts must be used within a WorkoutProvider');
  }
  return context;
};