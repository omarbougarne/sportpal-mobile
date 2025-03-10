import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  TouchableOpacity, 
  ActivityIndicator, 
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Workout } from '@/app/types/workout/workout';

interface WorkoutListUIProps {
  workouts: Workout[];  // Array of workouts
  loading: boolean;
  error: string | null;
  onWorkoutPress: (workout: Workout) => void;
  onCreatePress: () => void;
  onRefresh: () => void;
}

export default function WorkoutListUI({
  workouts,
  loading,
  error,
  onWorkoutPress,
  onCreatePress,
  onRefresh
}: WorkoutListUIProps) {

  const renderItem = ({ item }: { item: Workout }) => (
    <TouchableOpacity 
      style={styles.workoutItem} 
      onPress={() => onWorkoutPress(item)}
    >
      <View style={styles.workoutContent}>
        <Text style={styles.workoutName}>{item.name}</Text>
        
        {item.description && (
          <Text style={styles.workoutDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        
        <View style={styles.workoutMetadata}>
          {item.duration && (
            <View style={styles.metadataItem}>
              <Ionicons name="time-outline" size={14} color="#666" />
              <Text style={styles.metadataText}>{item.duration} min</Text>
            </View>
          )}
          
          {item.intensity && (
            <View style={[
              styles.intensityBadge, 
              { backgroundColor: getIntensityColor(item.intensity) }
            ]}>
              <Text style={styles.intensityText}>{item.intensity}</Text>
            </View>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  if (loading && workouts.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading workouts...</Text>
      </View>
    );
  }

  if (error && workouts.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={workouts}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="fitness-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No workouts found</Text>
            <Text style={styles.emptySubtext}>
              Create your first workout to get started
            </Text>
          </View>
        }
      />
      
      <TouchableOpacity 
        style={styles.createButton} 
        onPress={onCreatePress}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const getIntensityColor = (intensity: string) => {
  switch (intensity.toLowerCase()) {
    case 'easy': return '#4caf50';
    case 'medium': return '#ff9800';
    case 'hard': return '#f44336';
    default: return '#2196f3';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Space for FAB
  },
  workoutItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  workoutContent: {
    flex: 1,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  workoutDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  workoutMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  metadataText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  intensityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  intensityText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
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
  retryButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
  },
  createButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});