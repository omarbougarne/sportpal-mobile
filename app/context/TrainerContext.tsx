import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getTrainerByUserId, createTrainer, updateTrainer, deleteTrainer, addReview, addWorkout } from '@/app/services/api/trainerApi';
import { Trainer } from '@/app/types/trainer';

interface TrainerContextType {
  trainer: Trainer | null;
  loading: boolean;
  error: string | null;
  createTrainer: (createTrainerDto: any) => Promise<void>;
  updateTrainer: (id: string, updateTrainerDto: any) => Promise<void>;
  deleteTrainer: (id: string) => Promise<void>;
  addReview: (id: string, reviewDto: any) => Promise<void>;
  addWorkout: (id: string, workoutId: string) => Promise<void>;
}

interface TrainerProviderProps {
  children: ReactNode;
}

const defaultContext: TrainerContextType = {
  trainer: null,
  loading: false,
  error: null,
  createTrainer: async () => {},
  updateTrainer: async () => {},
  deleteTrainer: async () => {},
  addReview: async () => {},
  addWorkout: async () => {},
};

export const TrainerContext = createContext<TrainerContextType>(defaultContext);

export const TrainerProvider: React.FC<TrainerProviderProps> = ({ children }) => {
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrainer = async (userId: string) => {
    try {
      setLoading(true);
      const trainerData = await getTrainerByUserId(userId);
      setTrainer(trainerData);
    } catch (err) {
      console.error('Error fetching trainer:', err);
      setError('Failed to fetch trainer');
    } finally {
      setLoading(false);
    }
  };

  const createTrainerHandler = async (createTrainerDto: any) => {
    try {
      setLoading(true);
      const newTrainer = await createTrainer(createTrainerDto);
      setTrainer(newTrainer);
    } catch (err) {
      console.error('Error creating trainer:', err);
      setError('Failed to create trainer');
    } finally {
      setLoading(false);
    }
  };

  const updateTrainerHandler = async (id: string, updateTrainerDto: any) => {
    try {
      setLoading(true);
      const updatedTrainer = await updateTrainer(id, updateTrainerDto);
      setTrainer(updatedTrainer);
    } catch (err) {
      console.error('Error updating trainer:', err);
      setError('Failed to update trainer');
    } finally {
      setLoading(false);
    }
  };

  const deleteTrainerHandler = async (id: string) => {
    try {
      setLoading(true);
      await deleteTrainer(id);
      setTrainer(null);
    } catch (err) {
      console.error('Error deleting trainer:', err);
      setError('Failed to delete trainer');
    } finally {
      setLoading(false);
    }
  };

  const addReviewHandler = async (id: string, reviewDto: any) => {
    try {
      setLoading(true);
      const updatedTrainer = await addReview(id, reviewDto);
      setTrainer(updatedTrainer);
    } catch (err) {
      console.error('Error adding review:', err);
      setError('Failed to add review');
    } finally {
      setLoading(false);
    }
  };

  const addWorkoutHandler = async (id: string, workoutId: string) => {
    try {
      setLoading(true);
      const updatedTrainer = await addWorkout(id, workoutId);
      setTrainer(updatedTrainer);
    } catch (err) {
      console.error('Error adding workout:', err);
      setError('Failed to add workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TrainerContext.Provider
      value={{
        trainer,
        loading,
        error,
        createTrainer: createTrainerHandler,
        updateTrainer: updateTrainerHandler,
        deleteTrainer: deleteTrainerHandler,
        addReview: addReviewHandler,
        addWorkout: addWorkoutHandler,
      }}
    >
      {children}
    </TrainerContext.Provider>
  );
};