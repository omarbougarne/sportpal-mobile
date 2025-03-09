import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getWorkoutById, deleteWorkout } from '@/app/services/api/workoutApi';
import { Workout } from '@/app/types/workout';

interface WorkoutDetailProps {
  id: string;
}

export default function WorkoutDetail({ id }: WorkoutDetailProps) {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchWorkout();
  }, [id]);

  const fetchWorkout = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWorkoutById(id);
      setWorkout(data);
    } catch (err) {
      console.error('Error fetching workout:', err);
      setError('Failed to load workout details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await deleteWorkout(id);
              Alert.alert(
                'Success', 
                'Workout deleted successfully',
                [{ text: 'OK', onPress: () => router.push('./workout') }]
              );
            } catch (err) {
              console.error('Error deleting workout:', err);
              Alert.alert('Error', 'Failed to delete workout');
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading workout details...</Text>
      </View>
    );
  }

  if (error || !workout) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Workout not found'}</Text>
        <TouchableOpacity style={styles.button} onPress={fetchWorkout}>
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, { marginTop: 10 }]} 
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.workoutName}>{workout.name}</Text>
        <View style={[styles.intensityBadge, 
          { backgroundColor: getIntensityColor(workout.intensity) }]}>
          <Text style={styles.intensityText}>{workout.intensity}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="time-outline" size={20} color="#555" />
        <Text style={styles.infoText}>{workout.duration} minutes</Text>
      </View>

      {workout.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{workout.description}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Exercises</Text>
        {workout.exercises && workout.exercises.length > 0 ? (
          workout.exercises.map((exercise, index) => (
            <View key={index} style={styles.exerciseItem}>
              <Text style={styles.exerciseNumber}>{index + 1}.</Text>
              <Text style={styles.exerciseText}>{exercise}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noExercisesText}>No exercises added</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.editButton]} 
          onPress={() => router.push(`./workout/edit/${id}`)}
        >
          <Ionicons name="create-outline" size={18} color="#fff" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]} 
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={18} color="#fff" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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

const styles = StyleSheet.create({
  container: {
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
  workoutName: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  intensityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  intensityText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#555',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  exerciseItem: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  exerciseNumber: {
    width: 30,
    fontSize: 16,
    fontWeight: 'bold',
  },
  exerciseText: {
    flex: 1,
    fontSize: 16,
  },
  noExercisesText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#999',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
  },
  editButton: {
    backgroundColor: '#2196f3',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
});