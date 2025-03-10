import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useWorkouts } from '@/app/context/workoutContext';
import WorkoutListUI from '@/app/components/workout/WorkoutListUI';
import { Workout } from '@/app/types/workout/workout';

export default function WorkoutListContainer() {
  const { 
    workouts, 
    loading, 
    error, 
    fetchWorkouts 
  } = useWorkouts();
  const router = useRouter();
  
  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleWorkoutPress = (workout: Workout) => {
    router.push(`/workout/${workout._id}`);
  };

  const handleCreatePress = () => {
  router.push('/workout/new');  // Change from '/workout/create' to '/workout/new'
};
  
  const handleRefresh = () => {
    fetchWorkouts();
  };

  return (
    <WorkoutListUI
      workouts={workouts}
      loading={loading}
      error={error}
      onWorkoutPress={handleWorkoutPress}
      onCreatePress={handleCreatePress}
      onRefresh={handleRefresh}
    />
  );
}