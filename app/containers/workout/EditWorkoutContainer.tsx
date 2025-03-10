import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useWorkouts } from '@/app/context/workoutContext';
import { useAuth } from '@/app/hooks/useAuth';
import CreateWorkoutUI from '@/app/components/workout/CreateWorkoutUI';
import { Workout } from '@/app/types/workout/workout';
// Import the shared enums
import { WorkoutType, DifficultyLevel } from '@/app/types/workout/enums/workout-enum';

interface EditWorkoutContainerProps {
  id: string;
}

export default function EditWorkoutContainer({ id }: EditWorkoutContainerProps) {
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [workoutType, setWorkoutType] = useState<WorkoutType>(WorkoutType.CARDIO);
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>(DifficultyLevel.INTERMEDIATE);
  const [duration, setDuration] = useState('');
  const [caloriesBurn, setCaloriesBurn] = useState('');
  const [exercises, setExercises] = useState<string[]>(['']);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showWorkoutTypeDropdown, setShowWorkoutTypeDropdown] = useState(false);
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);
  
  const router = useRouter();
  const { getWorkout, editWorkout, currentWorkout } = useWorkouts();
  const { user } = useAuth();

  // Load workout data on mount
  useEffect(() => {
    loadWorkout();
  }, [id]);
  
  // Populate form when workout data is loaded
  useEffect(() => {
    if (currentWorkout) {
      setTitle(currentWorkout.name || '');
      setDescription(currentWorkout.description || '');
      
      // Handle workout type mapping
      if (currentWorkout.workoutType) {
        try {
          // Try to map the string to enum value 
          setWorkoutType(currentWorkout.workoutType as WorkoutType);
        } catch (e) {
          console.warn("Could not map workout type:", currentWorkout.workoutType);
        }
      }
      
      // Handle difficulty level mapping
      if (currentWorkout.intensity) {
        try {
          // Try to map the string to enum value
          setDifficultyLevel(currentWorkout.intensity as DifficultyLevel);
        } catch (e) {
          console.warn("Could not map intensity:", currentWorkout.intensity);
        }
      }
      
      if (currentWorkout.duration) {
        setDuration(currentWorkout.duration.toString());
      }
      
      // Populate exercises
      if (currentWorkout.exercises && currentWorkout.exercises.length > 0) {
        setExercises(currentWorkout.exercises);
      } else {
        setExercises(['']);
      }
      
      // Handle calories burn
      if (currentWorkout.caloriesBurn) {
        setCaloriesBurn(currentWorkout.caloriesBurn.toString());
      }
    }
  }, [currentWorkout]);

  const loadWorkout = async () => {
    try {
      setLoading(true);
      await getWorkout(id);
    } catch (error: any) {
      console.error('Error loading workout:', error);
      Alert.alert('Error', 'Failed to load workout details');
      router.back();
    } finally {
      setLoading(false);
    }
  };

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
      
      // Ensure user is creator
      if (!user || !currentWorkout || currentWorkout.creator !== user._id) {
        Alert.alert('Permission Denied', 'You can only edit your own workouts');
        return;
      }
      
      const validExercises = exercises.filter(ex => ex.trim() !== '');
      
      // Format data for updating
      const workoutData: Partial<Workout> = {
        name: title.trim(),
        description: description.trim(),
        intensity: difficultyLevel,
        duration: Number(duration),
        exercises: validExercises,
        // Optional: include these if your API supports them
        workoutType: workoutType,
        caloriesBurn: Number(caloriesBurn)
      };
      
      console.log('Updating workout data:', workoutData);
      
      const updatedWorkout = await editWorkout(id, workoutData);
      
      console.log('Workout updated:', updatedWorkout);
      
      Alert.alert(
        'Success',
        'Workout updated successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      console.error('Error updating workout:', error);
      Alert.alert('Error', error.message || 'Failed to update workout');
    } finally {
      setSaving(false);
    }
  };

  // Cancel handler
  const handleCancel = () => {
    router.back();
  };

  // Create wrapper functions for type compatibility
  const handleWorkoutTypeChange = (type: WorkoutType) => {
    setWorkoutType(type);
  };
  
  const handleDifficultyLevelChange = (level: DifficultyLevel) => {
    setDifficultyLevel(level);
  };

  // In your return statement, use the wrapper functions
  return (
    <CreateWorkoutUI
      title={title}
      description={description}
      workoutType={workoutType}
      difficultyLevel={difficultyLevel}
      duration={duration}
      caloriesBurn={caloriesBurn}
      exercises={exercises}
      saving={saving || loading}
      showWorkoutTypeDropdown={showWorkoutTypeDropdown}
      showDifficultyDropdown={showDifficultyDropdown}
      onTitleChange={setTitle}
      onDescriptionChange={setDescription}
      onWorkoutTypeChange={handleWorkoutTypeChange} // Use wrapper 
      onDifficultyLevelChange={handleDifficultyLevelChange} // Use wrapper
      onDurationChange={setDuration}
      onCaloriesBurnChange={setCaloriesBurn}
      onToggleWorkoutTypeDropdown={() => setShowWorkoutTypeDropdown(!showWorkoutTypeDropdown)}
      onToggleDifficultyDropdown={() => setShowDifficultyDropdown(!showDifficultyDropdown)}
      onAddExercise={handleAddExercise}
      onRemoveExercise={handleRemoveExercise}
      onExerciseChange={handleExerciseChange}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEditMode={true} // Add this prop to CreateWorkoutUI if needed
    />
  );
}