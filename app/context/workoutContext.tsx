import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getWorkouts, 
  getMyWorkouts, 
  getWorkoutById, 
  createWorkout, 
  updateWorkout, 
  deleteWorkout 
} from '../services/api/workoutApi';
import { Workout } from '../types/workout';
import { UserContext } from './UserContext';

interface WorkoutContextType {
  workouts: Workout[];
  myWorkouts: Workout[];
  loading: boolean;
  error: string | null;
  fetchWorkouts: (params?: any) => Promise<void>;
  fetchMyWorkouts: () => Promise<void>;
  getWorkout: (id: string) => Promise<Workout | null>;
  addWorkout: (workoutData: Partial<Workout>) => Promise<Workout>;
  editWorkout: (id: string, workoutData: Partial<Workout>) => Promise<Workout>;
  removeWorkout: (id: string) => Promise<void>;
}

const WorkoutContext = createContext<WorkoutContextType | null>(null);

export const WorkoutProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [myWorkouts, setMyWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useContext(UserContext)!; 

  // Fetch all workouts
  const fetchWorkouts = async (params?: any) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWorkouts(params);
      setWorkouts(data);
      console.log(`Fetched ${data.length} workouts`);
    } catch (err) {
      console.error('Error fetching workouts:', err);
      setError('Failed to fetch workouts');
    } finally {
      setLoading(false);
    }
  };

  // Fetch current user's workouts
  const fetchMyWorkouts = async () => {
    try {
      if (!user) {
        console.log('No user logged in, skipping my workouts fetch');
        return;
      }
      
      setLoading(true);
      setError(null);
      const data = await getMyWorkouts();
      setMyWorkouts(data);
      console.log(`Fetched ${data.length} of my workouts`);
    } catch (err) {
      console.error('Error fetching my workouts:', err);
      setError('Failed to fetch your workouts');
    } finally {
      setLoading(false);
    }
  };

  // Get a single workout by ID
  const getWorkout = async (id: string): Promise<Workout | null> => {
    try {
      setLoading(true);
      setError(null);
      return await getWorkoutById(id);
    } catch (err) {
      console.error(`Error fetching workout ${id}:`, err);
      setError('Failed to fetch workout details');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create a new workout
  const addWorkout = async (workoutData: Partial<Workout>): Promise<Workout> => {
    try {
      setLoading(true);
      setError(null);
      const newWorkout = await createWorkout(workoutData);
      
      // Update both workout lists
      setWorkouts(prev => [newWorkout, ...prev]);
      setMyWorkouts(prev => [newWorkout, ...prev]);
      
      return newWorkout;
    } catch (err) {
      console.error('Error creating workout:', err);
      setError('Failed to create workout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing workout
  const editWorkout = async (id: string, workoutData: Partial<Workout>): Promise<Workout> => {
    try {
      setLoading(true);
      setError(null);
      const updatedWorkout = await updateWorkout(id, workoutData);
      
      // Update workout in both lists
      setWorkouts(prev => prev.map(workout => 
        workout._id === id ? updatedWorkout : workout
      ));
      setMyWorkouts(prev => prev.map(workout => 
        workout._id === id ? updatedWorkout : workout
      ));
      
      return updatedWorkout;
    } catch (err) {
      console.error(`Error updating workout ${id}:`, err);
      setError('Failed to update workout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a workout
  const removeWorkout = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await deleteWorkout(id);
      
      // Remove workout from both lists
      setWorkouts(prev => prev.filter(workout => workout._id !== id));
      setMyWorkouts(prev => prev.filter(workout => workout._id !== id));
      
    } catch (err) {
      console.error(`Error deleting workout ${id}:`, err);
      setError('Failed to delete workout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initial load of workouts
  useEffect(() => {
    fetchWorkouts();
  }, []);

  // Load my workouts when user changes
  useEffect(() => {
    if (user && user._id) {
      fetchMyWorkouts();
    } else {
      setMyWorkouts([]);
    }
  }, [user]);

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        myWorkouts,
        loading,
        error,
        fetchWorkouts,
        fetchMyWorkouts,
        getWorkout,
        addWorkout,
        editWorkout,
        removeWorkout,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

// Custom hook to use the WorkoutContext
export const useWorkouts = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkouts must be used within a WorkoutProvider');
  }
  return context;
};