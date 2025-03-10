import React from 'react';
import { 
  View, Text, StyleSheet, ScrollView, 
  TouchableOpacity, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Workout } from '@/app/types/workout/workout';

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
      </View>
    );
  }

  if (!workout) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Workout not found</Text>
        <TouchableOpacity style={styles.button} onPress={onBackPress}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Workout Details</Text>
        
        {/* Only show edit and delete if user is creator */}
        {isCreator && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.iconButton} onPress={onEditPress}>
              <Ionicons name="create-outline" size={24} color="#007bff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={onDeletePress}>
              <Ionicons name="trash-outline" size={24} color="#dc3545" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {/* Workout details */}
      <ScrollView style={styles.content}>
        <View style={styles.sectionContainer}>
          <Text style={styles.workoutName}>{workout.name}</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={18} color="#666" />
              <Text style={styles.metaText}>{workout.duration} min</Text>
            </View>
            
            <View style={styles.metaItem}>
              <Ionicons name="fitness-outline" size={18} color="#666" />
              <Text style={styles.metaText}>{workout.intensity}</Text>
            </View>
            
            {workout.caloriesBurn && (
              <View style={styles.metaItem}>
                <Ionicons name="flame-outline" size={18} color="#666" />
                <Text style={styles.metaText}>{workout.caloriesBurn} cal</Text>
              </View>
            )}
          </View>
          
          {workout.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{workout.description}</Text>
            </View>
          )}
          
          {workout.exercises && workout.exercises.length > 0 && (
            <View style={styles.exercisesContainer}>
              <Text style={styles.sectionTitle}>Exercises</Text>
              {workout.exercises.map((exercise, index) => (
                <View key={index} style={styles.exerciseItem}>
                  <Text style={styles.exerciseNumber}>{index + 1}</Text>
                  <Text style={styles.exerciseText}>{exercise}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  sectionContainer: {
    padding: 16,
  },
  workoutName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  metaText: {
    marginLeft: 4,
    color: '#666',
    fontSize: 14,
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  exercisesContainer: {
    marginTop: 8,
  },
  exerciseItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  exerciseNumber: {
    fontWeight: 'bold',
    color: '#007bff',
    marginRight: 12,
    fontSize: 16,
  },
  exerciseText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
  },
});