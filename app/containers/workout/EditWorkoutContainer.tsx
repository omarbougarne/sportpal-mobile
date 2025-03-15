import React, { useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import EditWorkoutUI from '@/app/components/workout/EditWorkoutUI';
import { getWorkoutById, updateWorkout } from '@/app/services/api/workoutApi';
import { AuthContext } from '@/app/context/AuthContext';

export default function EditWorkoutScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useContext(AuthContext);
  
  // State variables for form, loading, etc.
  const [workout, setWorkout] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('Medium');
  const [exercises, setExercises] = useState(['']);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showIntensityDropdown, setShowIntensityDropdown] = useState(false);

  // Fetch workout and check authorization
  useEffect(() => {
    async function fetchWorkout() {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getWorkoutById(id as string);
        setWorkout(data);
        
        // Set form values
        setName(data.name || '');
        setDescription(data.description || '');
        setDuration(data.duration ? String(data.duration) : '');
        setIntensity(data.intensity || 'Medium');
        setExercises(data.exercises?.length > 0 ? [...data.exercises] : ['']);
        
        // Check if current user is the creator
        console.log('Workout fetched:', data);
        console.log('Auth check:', { 
          hasUser: !!user, 
          hasWorkout: !!data,
          userId: user?._id,
          workoutCreatorId: data.creator.toString()
        });
        
        if (user && data.creator) {
          // Check if the current user ID matches the creator ID
          const isAuthorized = user._id === data.creator.toString();
          setIsAuthorized(isAuthorized);
          console.log(`Authorization result: ${isAuthorized ? 'Authorized' : 'Not authorized'}`);
        } else {
          setIsAuthorized(false);
          console.log('Not authorized: missing user or creator data');
        }

        setError('');
      } catch (err: any) {
        console.error('Failed to load workout:', err);
        setError(err.message || 'Failed to load workout');
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      fetchWorkout();
    } else {
      setIsAuthorized(false);
      setLoading(false);
    }
  }, [id, user, isAuthenticated]);

  const handleSubmit = async () => {
    // Validation
    if (!isAuthorized) {
      setError('You don\'t have permission to edit this workout.');
      return;
    }
    
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a workout name');
      return;
    }
    
    if (!duration.trim() || isNaN(Number(duration)) || Number(duration) <= 0) {
      Alert.alert('Error', 'Please enter a valid duration');
      return;
    }
    
    if (!exercises.every(ex => ex.trim())) {
      Alert.alert('Error', 'Please fill in all exercises or remove empty ones');
      return;
    }

    try {
      setSaving(true);
      
      await updateWorkout(id as string, {
        name,
        description,
        duration: Number(duration),
        intensity,
        exercises: exercises.filter(ex => ex.trim()),
      });
      
      Alert.alert('Success', 'Workout updated successfully!');
      router.back();
    } catch (err: any) {
      console.error('Failed to update workout:', err);
      
      if (err.message.includes('permission')) {
        // Handle permission errors specifically
        setIsAuthorized(false);
        setError('You do not have permission to edit this workout.');
      } else {
        setError(err.message || 'Failed to update workout');
      }
    } finally {
      setSaving(false);
    }
  };

  // Helper functions for UI
  const handleAddExercise = () => {
    setExercises([...exercises, '']);
  };
  
  const handleRemoveExercise = (index: number) => {
    const updated = [...exercises];
    updated.splice(index, 1);
    setExercises(updated.length ? updated : ['']);
  };
  
  const handleExerciseChange = (text: string, index: number) => {
    const updated = [...exercises];
    updated[index] = text;
    setExercises(updated);
  };
  
  const handleRetry = () => {
    // Implement proper retry logic
    setError('');
    setLoading(true);
    fetchWorkout();
  };

  // Function needed by UI
  async function fetchWorkout() {
    if (!id) return;
    
    try {
      const data = await getWorkoutById(id as string);
      setWorkout(data);
      
      // Set form values
      setName(data.name || '');
      setDescription(data.description || '');
      setDuration(data.duration ? String(data.duration) : '');
      setIntensity(data.intensity || 'Medium');
      setExercises(data.exercises?.length > 0 ? [...data.exercises] : ['']);
      
      if (user && data.creator) {
        const isAuthorized = user._id === data.creator.toString();
        setIsAuthorized(isAuthorized);
      } else {
        setIsAuthorized(false);
      }
      
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load workout');
    } finally {
      setLoading(false);
    }
  }

  return (
    <EditWorkoutUI
      name={name}
      description={description}
      duration={duration}
      intensity={intensity}
      exercises={exercises}
      loading={loading}
      saving={saving}
      error={error}
      isAuthorized={isAuthorized}
      showIntensityDropdown={showIntensityDropdown}
      onNameChange={setName}
      onDescriptionChange={setDescription}
      onDurationChange={setDuration}
      onIntensityChange={setIntensity}
      onToggleIntensityDropdown={() => setShowIntensityDropdown(!showIntensityDropdown)}
      onAddExercise={handleAddExercise}
      onRemoveExercise={handleRemoveExercise}
      onExerciseChange={handleExerciseChange}
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
      onRetry={handleRetry}
    />
  );
}