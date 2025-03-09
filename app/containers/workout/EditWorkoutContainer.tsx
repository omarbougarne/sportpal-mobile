import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Workout } from '@/app/types/workout';
import { useWorkouts } from '@/app/context/workoutContext';
import EditWorkoutUI from '@/app/components/workout/EditWorkoutUI';

interface EditWorkoutContainerProps {
  id: string;
  onSuccess?: (workout: Workout) => void;
}

export default function EditWorkoutContainer({ id, onSuccess }: EditWorkoutContainerProps) {
  // State for form data
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('Medium');
  const [exercises, setExercises] = useState<string[]>(['']);

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showIntensityDropdown, setShowIntensityDropdown] = useState(false);

  // Hooks
  const router = useRouter();
  const { getWorkout, editWorkout } = useWorkouts();

  // Fetch workout data
  useEffect(() => {
    fetchWorkout();
  }, [id]);

  const fetchWorkout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const workout = await getWorkout(id);
      if (!workout) {
        throw new Error('Workout not found');
      }
      
      // Populate form with workout data
      setName(workout.name || '');
      setDescription(workout.description || '');
      setDuration(workout.duration ? workout.duration.toString() : '');
      setIntensity(workout.intensity || 'Medium');
      setExercises(workout.exercises?.length ? [...workout.exercises] : ['']);
      
    } catch (err: any) {
      console.error('Error fetching workout:', err);
      setError(err.message || 'Failed to load workout details');
    } finally {
      setLoading(false);
    }
  };

  // Form event handlers
  const handleAddExercise = () => {
    setExercises([...exercises, '']);
  };

  const handleExerciseChange = (text: string, index: number) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = text;
    setExercises(updatedExercises);
  };

  const handleRemoveExercise = (index: number) => {
    if (exercises.length > 1) {
      const updatedExercises = [...exercises];
      updatedExercises.splice(index, 1);
      setExercises(updatedExercises);
    }
  };

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Workout name is required');
      return false;
    }
    
    if (duration && (isNaN(Number(duration)) || Number(duration) <= 0)) {
      Alert.alert('Error', 'Please enter a valid duration in minutes');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setSaving(true);
      
      const workoutData: Partial<Workout> = {
        name: name.trim(),
      };
      
      // Only include fields with values
      if (description.trim()) {
        workoutData.description = description.trim();
      }
      
      if (duration) {
        workoutData.duration = Number(duration);
      }
      
      if (intensity) {
        workoutData.intensity = intensity;
      }
      
      // Filter out empty exercises
      const validExercises = exercises.filter(ex => ex.trim() !== '');
      if (validExercises.length > 0) {
        workoutData.exercises = validExercises;
      }
      
      const updatedWorkout = await editWorkout(id, workoutData);
      
      Alert.alert(
        'Success',
        'Workout updated successfully!',
        [
          { 
            text: 'OK', 
            onPress: () => {
              if (onSuccess) {
                onSuccess(updatedWorkout);
              } else {
                router.back();
              }
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('Error updating workout:', error);
      Alert.alert('Error', error.message || 'Failed to update workout. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Connect UI with container logic
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
      onRetry={fetchWorkout}
    />
  );
}