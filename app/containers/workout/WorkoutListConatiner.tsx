import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useWorkouts } from '@/app/context/workoutContext';
import WorkoutListUI from '@/app/components/workout/WorkoutListUI';
import { Workout } from '@/app/types/workout/workout';

// Define filter interface
interface WorkoutFilters {
  category: string;
  difficulty: string;
  duration: string;
  targetMuscle: string;
}

export default function WorkoutListContainer() {
  const { 
    workouts, 
    loading, 
    error, 
    fetchWorkouts 
  } = useWorkouts();
  const router = useRouter();
  
  // Add search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<WorkoutFilters>({
    category: '',
    difficulty: '',
    duration: '',
    targetMuscle: ''
  });
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  
  useEffect(() => {
    fetchWorkouts();
  }, []);

  // Apply search and filters to workouts
  const filteredWorkouts = workouts.filter(workout => {
    // Search query filtering (check name and description)
    const matchesSearch = 
      searchQuery === '' || 
      workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (workout.description && workout.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Category filter
    const matchesCategory = 
      filters.category === '' || 
      workout.category === filters.category;
    
    // Difficulty filter
    const matchesDifficulty = 
      filters.difficulty === '' || 
      workout.difficulty === filters.difficulty;
    
    // Duration filter
    const matchesDuration = 
      filters.duration === '' || 
      matchDurationFilter(workout.duration, filters.duration);
    
    // Target muscle filter
    const matchesTargetMuscle = 
      filters.targetMuscle === '' || 
      (workout.targetMuscles && workout.targetMuscles.includes(filters.targetMuscle));
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesDuration && matchesTargetMuscle;
  });
  
  // Helper function to match duration ranges
  const matchDurationFilter = (workoutDuration: number, durationFilter: string): boolean => {
    switch(durationFilter) {
      case 'short': return workoutDuration <= 15;
      case 'medium': return workoutDuration > 15 && workoutDuration <= 30;
      case 'long': return workoutDuration > 30;
      default: return true;
    }
  };

  // Get unique filter options from workout data
  const getFilterOptions = () => {
    const categories = [...new Set(workouts.map(w => w.category))];
    const difficulties = [...new Set(workouts.map(w => w.difficulty))];
    const targetMuscles = [...new Set(workouts.flatMap(w => w.targetMuscles || []))];
    
    return {
      categories,
      difficulties,
      targetMuscles,
      durations: ['short', 'medium', 'long']
    };
  };

  const handleWorkoutPress = (workout: Workout) => {
    router.push(`/workout/${workout._id}`);
  };

  const handleCreatePress = () => {
    router.push('/workout/new');
  };
  
  const handleRefresh = () => {
    fetchWorkouts();
  };
  
  // Handler for search input
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  // Handler for filter changes
  const handleFilterChange = (filterName: keyof WorkoutFilters, value: string) => {
    setFilters({
      ...filters,
      [filterName]: value
    });
  };
  
  // Toggle filter for multi-select options
  const toggleFilter = (filterName: keyof WorkoutFilters, value: string) => {
    const currentValue = filters[filterName];
    if (currentValue === value) {
      // If same value, clear the filter
      handleFilterChange(filterName, '');
    } else {
      // Otherwise set to new value
      handleFilterChange(filterName, value);
    }
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      category: '',
      difficulty: '',
      duration: '',
      targetMuscle: ''
    });
  };
  
  // Toggle filter modal visibility
  const toggleFilterModal = () => {
    setFilterModalVisible(!filterModalVisible);
  };

  return (
    <WorkoutListUI
      workouts={filteredWorkouts}
      loading={loading}
      error={error}
      searchQuery={searchQuery}
      filters={filters}
      filterOptions={getFilterOptions()}
      filterModalVisible={filterModalVisible}
      onSearch={handleSearch}
      onFilterChange={handleFilterChange}
      onToggleFilter={toggleFilter}
      onClearFilters={handleClearFilters}
      onToggleFilterModal={toggleFilterModal}
      onWorkoutPress={handleWorkoutPress}
      onCreatePress={handleCreatePress}
      onRefresh={handleRefresh}
      totalCount={workouts.length}
      filteredCount={filteredWorkouts.length}
    />
  );
}