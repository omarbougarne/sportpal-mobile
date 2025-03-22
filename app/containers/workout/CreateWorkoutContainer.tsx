import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useWorkouts } from '@/app/context/workoutContext';
import { useAuth } from '@/app/hooks/useAuth';
import CreateWorkoutUI from '@/app/components/workout/CreateWorkoutUI';
import { WorkoutType, DifficultyLevel } from '@/app/types/workout/enums/workout-enum';
interface CreateWorkoutContainerProps {
  onSuccess?: (workout: any) => void;
}

// These should match your backend enums


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
  const { user } = useAuth();

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
      
      // Simplified auth check
      const userId = user?._id || "temp-user-id";
      
      const validExercises = exercises.filter(ex => ex.trim() !== '');
      
      // Format data to match your Workout interface
      const workoutData = {
        name: title.trim(),
        description: description.trim(),
        intensity: difficultyLevel,
        duration: Number(duration),
        exercises: validExercises,
        creator: userId,
        workoutType: workoutType,
        caloriesBurn: Number(caloriesBurn)
      };
      
      console.log('Submitting workout data:', workoutData);
      
      const newWorkout = await createWorkout(workoutData);
      
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
                router.replace('/workout');
              }
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('Error creating workout:', error);
      Alert.alert('Error', error.message || 'Failed to create workout');
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
      isEditMode={false}
      onCancel={handleCancel}
    />
  );
}