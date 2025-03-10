import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useWorkouts } from '@/app/context/workoutContext';
import { useAuth } from '@/app/hooks/useAuth';
import WorkoutDetailUI from '@/app/components/workout/WorkoutDetailUI';

interface WorkoutDetailContainerProps {
  id: string;
}

export default function WorkoutDetailContainer({ id }: WorkoutDetailContainerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreator, setIsCreator] = useState(false);
  
  const router = useRouter();
  const { getWorkout, deleteWorkout, currentWorkout } = useWorkouts();
  const { user } = useAuth();

  useEffect(() => {
    // This helps load the workout when component mounts
    if (id) {
      console.log("Fetching workout with ID:", id);
      fetchWorkout();
    }
  }, [id]);

  useEffect(() => {
    // TEMPORARY DEVELOPMENT MODE: Force buttons to appear
    // Remove this line before production deployment
    setIsCreator(true);
    
    if (currentWorkout && user) {
      // Normal logic - will run once auth is fixed
      const isUserCreator = String(currentWorkout.creator) === String(user._id);
      setIsCreator(isUserCreator);
    } else {
      console.log('Missing data for creator check:', { 
        hasUser: !!user, 
        hasWorkout: !!currentWorkout 
      });
      // For development, we're using the setIsCreator(true) above
    }
  }, [currentWorkout, user]);

  const fetchWorkout = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Calling getWorkout API with ID:", id);
      await getWorkout(id);
      console.log("Workout fetched:", currentWorkout);
    } catch (err: any) {
      console.error('Error fetching workout:', err);
      setError(err.message || 'Failed to load workout');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPress = () => {
    // Navigate to the edit page with this workout's id
    router.push(`/workout/edit/${id}`);
  };
  
  const handleDeletePress = () => {
    // Show confirmation dialog
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
      
      // Show success message and navigate back
      Alert.alert(
        'Success',
        'Workout deleted successfully',
        [{ text: 'OK', onPress: () => router.back() }]
      );
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
      onRetry={fetchWorkout}
    />
  );
}