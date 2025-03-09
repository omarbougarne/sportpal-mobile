import React from 'react';
import { 
  View, Text, StyleSheet, ScrollView, 
  TouchableOpacity, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Workout } from '@/app/types/workout';

interface WorkoutDetailUIProps {
  workout: Workout | null;
  loading: boolean;
  error: string | null;
  isCreator: boolean;
  onEditPress: () => void;
  onDeletePress: () => void;
  onBackPress: () => void;
  onRetry: () => void;
}

export default function WorkoutDetailUI({
  workout,
  loading,
  error,
  isCreator,
  onEditPress,
  onDeletePress,
  onBackPress,
  onRetry
}: WorkoutDetailUIProps) {

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading workout details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={onRetry}>
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onBackPress}>
          <Text style={styles.secondaryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!workout) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Workout not found</Text>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onBackPress}>
          <Text style={styles.secondaryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{workout.name}</Text>
          <View style={[styles.badge, { backgroundColor: getIntensityColor(workout.intensity) }]}>
            <Text style={styles.badgeText}>{workout.intensity || 'No intensity'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {workout.description || 'No description provided'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={20} color="#555" />
            <Text style={styles.detailText}>
              {workout.duration ? `${workout.duration} minutes` : 'Duration not specified'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          {workout.exercises && workout.exercises.length > 0 ? (
            workout.exercises.map((exercise, index) => (
              <View key={index} style={styles.exerciseItem}>
                <Ionicons name="fitness-outline" size={20} color="#555" />
                <Text style={styles.exerciseText}>{exercise}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noContent}>No exercises added</Text>
          )}
        </View>

        <View style={styles.metadataSection}>
          <Text style={styles.metadataText}>
            Created: {new Date(workout.createdAt).toLocaleDateString()}
          </Text>
          <Text style={styles.metadataText}>
            Last updated: {new Date(workout.updatedAt).toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>

      {isCreator && (
        <View style={styles.actionBar}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]} 
            onPress={onEditPress}
          >
            <Ionicons name="create-outline" size={22} color="white" />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]} 
            onPress={onDeletePress}
          >
            <Ionicons name="trash-outline" size={22} color="white" />
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const getIntensityColor = (intensity?: string) => {
  switch (intensity?.toLowerCase()) {
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
  scrollContainer: {
    flex: 1,
    padding: 16,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    color: '#333',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 10,
  },
  badgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#555',
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  exerciseText: {
    fontSize: 16,
    color: '#444',
    marginLeft: 10,
  },
  noContent: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
  },
  metadataSection: {
    marginTop: 8,
    marginBottom: 80, // Add space for the action bar
  },
  metadataText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  actionBar: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  editButton: {
    backgroundColor: '#2196f3',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  button: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#555',
    fontSize: 16,
    fontWeight: 'bold',
  },
});