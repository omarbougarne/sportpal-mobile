import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, ScrollView, 
  TouchableOpacity, Alert, ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getWorkoutById, updateWorkout } from '@/app/services/api/workoutApi';
import { Workout } from '@/app/types/workout';

interface EditWorkoutProps {
  id: string;
  onSuccess?: (workout: Workout) => void;
}

export default function EditWorkout({ id, onSuccess }: EditWorkoutProps) {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('Medium');
  const [exercises, setExercises] = useState<string[]>(['']);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showIntensityDropdown, setShowIntensityDropdown] = useState(false);
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
      
      // Populate form fields
      setName(data.name || '');
      setDescription(data.description || '');
      setDuration(data.duration?.toString() || '');
      setIntensity(data.intensity || 'Medium');
      setExercises(data.exercises?.length ? [...data.exercises] : ['']);
    } catch (err) {
      console.error('Error fetching workout:', err);
      setError('Failed to load workout details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExercise = () => {
    setExercises([...exercises, '']);
  };

  const handleExerciseChange = (text: string, index: number) => {
    const newExercises = [...exercises];
    newExercises[index] = text;
    setExercises(newExercises);
  };

  const handleRemoveExercise = (index: number) => {
    if (exercises.length > 1) {
      const newExercises = [...exercises];
      newExercises.splice(index, 1);
      setExercises(newExercises);
    }
  };

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Workout name is required');
      return false;
    }
    
    if (isNaN(Number(duration)) || Number(duration) <= 0) {
      Alert.alert('Error', 'Please enter a valid duration in minutes');
      return false;
    }
    
    // Filter out empty exercise inputs
    const validExercises = exercises.filter(ex => ex.trim() !== '');
    if (validExercises.length === 0) {
      Alert.alert('Error', 'Please add at least one exercise');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setSaving(true);
      
      const validExercises = exercises.filter(ex => ex.trim() !== '');
      
      const workoutData = {
        name: name.trim(),
        description: description.trim(),
        duration: Number(duration),
        intensity,
        exercises: validExercises,
      };
      
      const updatedWorkout = await updateWorkout(id, workoutData);
      
      Alert.alert(
        'Success',
        'Workout updated successfully!',
        [
          { 
            text: 'OK', 
            onPress: () => {
              if (onSuccess) {
                onSuccess(updatedWorkout);
              } else {
                router.back();
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error updating workout:', error);
      Alert.alert('Error', 'Failed to update workout. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading workout...</Text>
      </View>
    );
  }

  if (error || !workout) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error || 'Workout not found'}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchWorkout}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.retryButton, { marginTop: 10 }]}
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Workout</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Workout Name*</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Morning Cardio"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your workout..."
          multiline
          numberOfLines={4}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Duration (minutes)*</Text>
        <TextInput
          style={styles.input}
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
          placeholder="e.g. 30"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Intensity*</Text>
        <TouchableOpacity 
          style={styles.customPickerButton}
          onPress={() => setShowIntensityDropdown(!showIntensityDropdown)}
        >
          <Text style={styles.pickerText}>{intensity}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>
        
        {showIntensityDropdown && (
          <View style={styles.dropdownList}>
            {['Easy', 'Medium', 'Hard'].map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.dropdownItem,
                  intensity === option && styles.selectedDropdownItem
                ]}
                onPress={() => {
                  setIntensity(option);
                  setShowIntensityDropdown(false);
                }}
              >
                <Text style={intensity === option ? styles.selectedOptionText : styles.optionText}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Exercises*</Text>
        {exercises.map((exercise, index) => (
          <View key={index} style={styles.exerciseRow}>
            <TextInput
              style={[styles.input, styles.exerciseInput]}
              value={exercise}
              onChangeText={(text) => handleExerciseChange(text, index)}
              placeholder={`Exercise ${index + 1}`}
            />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveExercise(index)}
              disabled={exercises.length === 1}
            >
              <Ionicons 
                name="remove-circle" 
                size={24} 
                color={exercises.length === 1 ? '#ccc' : '#ff6b6b'} 
              />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={handleAddExercise}>
          <Ionicons name="add-circle" size={24} color="#4caf50" />
          <Text style={styles.addButtonText}>Add Exercise</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={[styles.submitButton, saving && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Update Workout</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}
        disabled={saving}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
      
      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
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
  retryButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  exerciseInput: {
    flex: 1,
  },
  removeButton: {
    marginLeft: 10,
    padding: 5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  addButtonText: {
    color: '#4caf50',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  submitButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.7,
  },
  cancelButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  spacer: {
    height: 40,
  },
  // Add to your StyleSheet
customPickerButton: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 8,
  padding: 12,
  backgroundColor: '#fff',
},
pickerText: {
  fontSize: 16,
},
dropdownArrow: {
  fontSize: 14,
},
dropdownList: {
  position: 'absolute',
  top: 85, // Adjust based on your layout
  left: 0,
  right: 0,
  backgroundColor: '#fff',
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 8,
  zIndex: 1000,
  elevation: 5,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
},
dropdownItem: {
  padding: 12,
  borderBottomWidth: 1,
  borderBottomColor: '#f0f0f0',
},
selectedDropdownItem: {
  backgroundColor: '#e8f4f8',
},
optionText: {
  fontSize: 16,
},
selectedOptionText: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#2196F3',
},
});