import React from 'react';
import { 
  View, Text, StyleSheet, ScrollView, 
  TouchableOpacity, ActivityIndicator,
  ImageBackground
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Workout } from '@/app/types/workout/workout';

// Define the exercise object type
interface ExerciseObject {
  name: string;
  description?: string;
  sets?: string | number;
  reps?: string | number;
  restTime?: string | number;
}

// Update the WorkoutDetailUIProps to specify the exercise type
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

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4a90e2" />
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
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Workout Details</Text>
          
          {/* Only show edit and delete if user is creator */}
          {isCreator && (
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.iconButton} onPress={onEditPress}>
                <Ionicons name="create-outline" size={24} color="#4a90e2" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={onDeletePress}>
                <Ionicons name="trash-outline" size={24} color="#ff6b6b" />
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
                <Ionicons name="time-outline" size={18} color="#BBBBBB" />
                <Text style={styles.metaText}>{workout.duration} min</Text>
              </View>
              
              <View style={styles.metaItem}>
                <Ionicons name="fitness-outline" size={18} color="#BBBBBB" />
                <Text style={styles.metaText}>{workout.intensity}</Text>
              </View>
              
              {workout.caloriesBurn && (
                <View style={styles.metaItem}>
                  <Ionicons name="flame-outline" size={18} color="#BBBBBB" />
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
                    
                    {/* Handle both string and object exercises with proper type casting */}
                    {typeof exercise === 'string' ? (
                      <Text style={styles.exerciseText}>{exercise}</Text>
                    ) : (
                      <View style={styles.exerciseDetails}>
                        <Text style={styles.exerciseName}>
                          {(exercise as ExerciseObject).name}
                        </Text>
                        {(exercise as ExerciseObject).description && (
                          <Text style={styles.exerciseDescription}>
                            {(exercise as ExerciseObject).description}
                          </Text>
                        )}
                        <View style={styles.exerciseStats}>
                          {(exercise as ExerciseObject).sets && (
                            <Text style={styles.exerciseStat}>
                              Sets: {(exercise as ExerciseObject).sets}
                            </Text>
                          )}
                          {(exercise as ExerciseObject).reps && (
                            <Text style={styles.exerciseStat}>
                              Reps: {(exercise as ExerciseObject).reps}
                            </Text>
                          )}
                          {(exercise as ExerciseObject).restTime && (
                            <Text style={styles.exerciseStat}>
                              Rest: {(exercise as ExerciseObject).restTime}s
                            </Text>
                          )}
                        </View>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <ImageBackground 
      source={{uri:'https://i.pinimg.com/736x/86/da/d0/86dad02018fc7eaeb628c94b5705fef3.jpg'}} 
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        {renderContent()}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // Background & Container Styles
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  
  // Content Styles
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
    color: '#fff',
    letterSpacing: 0.5,
  },
  
  // Metadata Styles
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  metaText: {
    marginLeft: 4,
    color: '#BBBBBB',
    fontSize: 14,
  },
  
  // Description Styles
  descriptionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#fff',
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#BBBBBB',
  },
  
  // Exercise Styles
  exercisesContainer: {
    marginTop: 8,
  },
  exerciseItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    color: '#4a90e2',
    marginRight: 12,
    fontSize: 16,
  },
  exerciseText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#BBBBBB',
    marginTop: 4,
  },
  exerciseStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  exerciseStat: {
    fontSize: 14,
    color: '#BBBBBB',
    marginRight: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  
  // Button Styles
  button: {
    backgroundColor: '#4a90e2',
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
  
  // Status Text
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#BBBBBB',
  },
  errorText: {
    fontSize: 16,
    color: '#ff6b6b',
    textAlign: 'center',
  },
});