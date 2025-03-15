import React, { useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/app/context/AuthContext';
import { getTrainerById, getTrainerByUserId, becomeTrainer, getMyTrainerProfile } from '@/app/services/api/trainerApi';
import TrainerProfileUI from '@/app/components/trainer/TrainerProfileUI';
import { Trainer } from '@/app/types/trainer';

type TrainerProfileContainerProps = {
  trainerId?: string;
};

export default function TrainerProfileContainer({ trainerId }: TrainerProfileContainerProps) {
  const router = useRouter();
  const { user, refreshUserData } = useContext(AuthContext);
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false);
  const [becomingTrainer, setBecomingTrainer] = useState(false);

  useEffect(() => {
    loadTrainerProfile();
  }, [trainerId, user]);

  const loadTrainerProfile = async () => {
    if (!user) {
      setError('You must be logged in to view trainer profiles');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      let trainerData = null;
      
      if (trainerId) {
        // If we're viewing a specific trainer by ID
        trainerData = await getTrainerById(trainerId);
        
        // Check if this is the current user's profile
        const trainerUserId = typeof trainerData.userId === 'object' 
          ? trainerData.userId._id 
          : trainerData.userId;
          
        setIsCurrentUserProfile(user && user._id === trainerUserId);
      } else {
        // If we're viewing the current user's profile (or checking if they have one)
        try {
          // Try to get profile for current user
          trainerData = await getMyTrainerProfile();
          setIsCurrentUserProfile(true);
        } catch (err: any) {
          // If there's any error other than 404, show it
          if (err.response && err.response.status !== 404) {
            setError(err.message || 'Error loading trainer profile');
          }
          // For 404 (no profile), we'll show the "become a trainer" UI
          setIsCurrentUserProfile(true);
          setTrainer(null);
          setLoading(false);
          return;
        }
      }
      
      setTrainer(trainerData);
    } catch (err: any) {
      console.error('Failed to load trainer profile:', err);
      setError(err.message || 'Failed to load trainer profile');
    } finally {
      setLoading(false);
    }
  };

  const handleBecomeTrainer = async () => {
    if (!user || !user._id) {
      Alert.alert('Error', 'You must be logged in to become a trainer');
      return;
    }

    try {
      setBecomingTrainer(true);
      
      // Create minimal trainer data - note that the backend already gets userId from JWT
      const trainerData = {
        bio: '',
        yearsOfExperience: 0,
        specializations: [],
        hourlyRate: 0
      };
      
      // Call the API to become a trainer
      await becomeTrainer(user._id, trainerData);
      
      // Refresh user data to get updated role
      if (refreshUserData) {
        await refreshUserData();
      }
      
      // Redirect to edit trainer page to complete profile
      router.push('/trainer/new');
      
    } catch (err: any) {
      console.error('Failed to become trainer:', err);
      Alert.alert('Error', err.message || 'Failed to become a trainer');
    } finally {
      setBecomingTrainer(false);
    }
  };

  const handleEditProfile = () => {
    if (trainer && trainer._id) {
      router.push(`/trainer/${trainer._id}`);
    } else {
      router.push('/trainer/new');
    }
  };

  const handleAddWorkout = () => {
    router.push('/workout/new');
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleViewWorkout = (workoutId: string) => {
    router.push(`/workout/${workoutId}`);
  };

  const handleViewAllReviews = () => {
    if (trainer && trainer._id) {
      router.push(`/trainer/${trainer._id}/reviews`);
    }
  };

  return (
    <TrainerProfileUI
      trainer={trainer}
      loading={loading}
      error={error}
      isCurrentUserProfile={isCurrentUserProfile}
      becomingTrainer={becomingTrainer}
      onBecomeTrainer={handleBecomeTrainer}
      onEditProfile={handleEditProfile}
      onAddWorkout={handleAddWorkout}
      onGoBack={handleGoBack}
      onRetry={loadTrainerProfile}
      onViewWorkout={handleViewWorkout}
      onViewAllReviews={handleViewAllReviews}
    />
  );
}