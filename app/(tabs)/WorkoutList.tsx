import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Workout } from '@/app/types/workout';
import { useWorkouts } from '@/app/context/workoutContext';

interface WorkoutListProps {
  showMyWorkoutsOnly?: boolean;
  onWorkoutSelect?: (workout: Workout) => void;
}

export default function WorkoutList({ showMyWorkoutsOnly = false, onWorkoutSelect }: WorkoutListProps) {
  const { 
    workouts, 
    myWorkouts, 
    loading, 
    error, 
    fetchWorkouts, 
    fetchMyWorkouts 
  } = useWorkouts();
  const router = useRouter();
  
  // Choose which workouts to display based on prop
  const displayWorkouts = showMyWorkoutsOnly ? myWorkouts : workouts;

  // Load the appropriate workouts when component mounts or when the filter changes
  useEffect(() => {
    if (showMyWorkoutsOnly) {
      fetchMyWorkouts();
    } else {
      fetchWorkouts();
    }
  }, [showMyWorkoutsOnly]);

  // Handle refresh based on which list we're viewing
  const handleRefresh = () => {
    if (showMyWorkoutsOnly) {
      fetchMyWorkouts();
    } else {
      fetchWorkouts();
    }
  };

  const handleWorkoutPress = (workout: Workout) => {
    if (onWorkoutSelect) {
      onWorkoutSelect(workout);
    } else {
      // Use absolute path for consistent navigation
      router.push(`./workout/${workout._id}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading workouts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (displayWorkouts.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>
          {showMyWorkoutsOnly 
            ? "You haven't created any workouts yet." 
            : "No workouts found."}
        </Text>
        <TouchableOpacity 
          style={styles.createButton} 
          onPress={() => router.push('./workout/create')}
        >
          <Text style={styles.createButtonText}>Create a Workout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={displayWorkouts} 
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.workoutCard}
            onPress={() => handleWorkoutPress(item)}
          >
            <View style={styles.workoutHeader}>
              <Text style={styles.workoutName}>{item.name}</Text>
              <View style={[styles.intensityBadge, 
                { backgroundColor: getIntensityColor(item.intensity) }]}>
                <Text style={styles.intensityText}>{item.intensity}</Text>
              </View>
            </View>
            
            <Text style={styles.workoutDescription} numberOfLines={2}>
              {item.description || 'No description provided'}
            </Text>
            
            <View style={styles.workoutFooter}>
              <View style={styles.footerItem}>
                <Ionicons name="time-outline" size={16} color="#555" />
                <Text style={styles.footerText}>
                  {item.duration} min
                </Text>
              </View>
              
              <View style={styles.footerItem}>
                <Ionicons name="barbell-outline" size={16} color="#555" />
                <Text style={styles.footerText}>
                  {item.exercises?.length || 0} exercises
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        refreshing={loading}
        onRefresh={handleRefresh}
      />
    </View>
  );
}

const getIntensityColor = (intensity?: string) => {
  switch (intensity?.toLowerCase()) {
    case 'easy':
      return '#4caf50';
    case 'medium':
      return '#ff9800';
    case 'hard':
      return '#f44336';
    default:
      return '#2196f3';
  }
};

// Keep your existing styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  workoutCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  intensityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  intensityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  workoutDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  workoutFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  footerText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#555',
  },
});