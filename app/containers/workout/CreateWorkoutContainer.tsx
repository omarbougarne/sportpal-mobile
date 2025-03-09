import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useWorkouts } from '@/app/context/workoutContext';
import { useAuth } from '@/app/hooks/useAuth';
import CreateWorkoutUI from '@/app/components/workout/CreateWorkoutUI';

interface CreateWorkoutContainerProps {
  onSuccess?: (workout: any) => void;
}

// These should match your backend enums
enum WorkoutType {
  CARDIO = 'CARDIO',
  STRENGTH = 'STRENGTH',
  FLEXIBILITY = 'FLEXIBILITY',
  HIIT = 'HIIT',
  CROSSFIT = 'CROSSFIT',
  YOGA = 'YOGA'
}

enum DifficultyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export default function CreateWorkoutContainer({ onSuccess }: CreateWorkoutContainerProps) {
  // Form state - matching the backend DTO
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [workoutType, setWorkoutType] = useState<WorkoutType>(WorkoutType.CARDIO);
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>(DifficultyLevel.INTERMEDIATE);
  const [duration, setDuration] = useState('');
  const [caloriesBurn, setCaloriesBurn] = useState('');
  const [exercises, setExercises] = useState<string[]>(['']); // Will convert to ExerciseDto later
  
  // UI state
  const [saving, setSaving] = useState(false);
  const [showWorkoutTypeDropdown, setShowWorkoutTypeDropdown] = useState(false);
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);
  
  const router = useRouter();
  const { createWorkout } = useWorkouts();
  const { user } = useAuth(); // To get the current user ID for creator field

  // Exercise handlers
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

  // Form validation
  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Workout title is required');
      return false;
    }
    
    if (isNaN(Number(duration)) || Number(duration) <= 0) {
      Alert.alert('Error', 'Please enter a valid duration in minutes');
      return false;
    }
    
    if (isNaN(Number(caloriesBurn)) || Number(caloriesBurn) <= 0) {
      Alert.alert('Error', 'Please enter a valid calorie burn amount');
      return false;
    }
    
    const validExercises = exercises.filter(ex => ex.trim() !== '');
    if (validExercises.length === 0) {
      Alert.alert('Error', 'Please add at least one exercise');
      return false;
    }
    
    return true;
  };

  // Form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setSaving(true);
      
      // Check for user authentication
      if (!user || !user._id) {
        Alert.alert('Authentication Error', 'You must be logged in to create a workout');
        setSaving(false);
        return;
      }
      
      const validExercises = exercises.filter(ex => ex.trim() !== '');
      
      // Format data to match your Workout interface (exercise as strings)
      const workoutData = {
        name: title.trim(),  // Use 'name' to match your Workout interface
        description: description.trim(),
        intensity: difficultyLevel,  // Map difficultyLevel to intensity
        duration: Number(duration),
        exercises: validExercises,  // Keep as string[] to match Workout interface
        creator: user._id,
        // Note: workoutType and caloriesBurn are not in your Workout interface
      };
      
      console.log('Submitting workout data:', workoutData);
      
      // Use try-catch to handle any API errors
      const newWorkout = await createWorkout(workoutData);
      
      // Log the response for debugging
      console.log('New workout created:', newWorkout);
      
      Alert.alert(
        'Success',
        'Workout created successfully!',
        [
          { 
            text: 'OK', 
            onPress: () => {
              if (onSuccess) {
                onSuccess(newWorkout);
              } else {
                // Safe navigation - go back to list rather than trying to view the new workout
                router.replace('/workout');
              }
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('Error creating workout:', error);
      console.error('Error details:', error.response?.data);
      
      // More detailed error message
      const errorMsg = error.response?.data?.message || error.message || 'Failed to create workout';
      Alert.alert('Error', errorMsg);
    } finally {
      setSaving(false);
    }
  };

  // Cancel handler
  const handleCancel = () => {
    router.back();
  };

  return (
    <CreateWorkoutUI
      title={title}
      description={description}
      workoutType={workoutType}
      difficultyLevel={difficultyLevel}
      duration={duration}
      caloriesBurn={caloriesBurn}
      exercises={exercises}
      saving={saving}
      showWorkoutTypeDropdown={showWorkoutTypeDropdown}
      showDifficultyDropdown={showDifficultyDropdown}
      onTitleChange={setTitle}
      onDescriptionChange={setDescription}
      onWorkoutTypeChange={setWorkoutType}
      onDifficultyLevelChange={setDifficultyLevel}
      onDurationChange={setDuration}
      onCaloriesBurnChange={setCaloriesBurn}
      onToggleWorkoutTypeDropdown={() => setShowWorkoutTypeDropdown(!showWorkoutTypeDropdown)}
      onToggleDifficultyDropdown={() => setShowDifficultyDropdown(!showDifficultyDropdown)}
      onAddExercise={handleAddExercise}
      onRemoveExercise={handleRemoveExercise}
      onExerciseChange={handleExerciseChange}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}