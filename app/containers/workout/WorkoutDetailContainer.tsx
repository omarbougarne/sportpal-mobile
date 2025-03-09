import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useWorkouts } from '@/app/context/workoutContext';
import { useUser } from '@/app/hooks/useUser';
import { useAuth } from '@/app/hooks/useAuth';
import WorkoutDetailUI from '@/app/components/workout/WorkoutDetailUI';

interface WorkoutDetailContainerProps {
  id: string;
}

export default function WorkoutDetailContainer({ id }: WorkoutDetailContainerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreator, setIsCreator] = useState(false);
  
  const { user } = useUser();
  const { isAuthenticated } = useAuth();
  const { 
    getWorkout, 
    deleteWorkout,
    currentWorkout,
    setCurrentWorkout
  } = useWorkouts();
  const router = useRouter();
  
  useEffect(() => {
    fetchWorkoutDetails();
    
    // Clean up when unmounting
    return () => {
      setCurrentWorkout(null);
    };
  }, [id]);
  
  const fetchWorkoutDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const workout = await getWorkout(id);
      
      // Check if the current user is the creator
      if (workout && user && isAuthenticated) {
        setIsCreator(workout.creator === user._id);
      }
      
    } catch (err: any) {
      console.error('Error fetching workout details:', err);
      setError(err.message || 'Failed to load workout details');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPress = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'Please login to edit workouts',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/') }
        ]
      );
      return;
    }
    
    router.push(`/workout/${id}/edit`);
  };
  
  const handleDeletePress = () => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: confirmDelete
        }
      ]
    );
  };
  
  const confirmDelete = async () => {
    try {
      setLoading(true);
      await deleteWorkout(id);
      Alert.alert('Success', 'Workout deleted successfully');
      router.back();
    } catch (err: any) {
      console.error('Error deleting workout:', err);
      Alert.alert('Error', err.message || 'Failed to delete workout');
      setLoading(false);
    }
  };
  
  const handleBackPress = () => {
    router.back();
  };
  
  return (
    <WorkoutDetailUI
      workout={currentWorkout}
      loading={loading}
      error={error}
      isCreator={isCreator}
      onEditPress={handleEditPress}
      onDeletePress={handleDeletePress}
      onBackPress={handleBackPress}
      onRetry={fetchWorkoutDetails}
    />
  );
}