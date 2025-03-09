import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, ScrollView, 
  TouchableOpacity, Alert, ActivityIndicator 
} from 'react-native';

import { useRouter } from 'expo-router';
import { createWorkout } from '@/app/services/api/workoutApi';
import { Workout } from '@/app/types/workout';

interface CreateWorkoutProps {
  onSuccess?: (workout: Workout) => void;
}

export default function CreateWorkout({ onSuccess }: CreateWorkoutProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('Medium');
  const [exercises, setExercises] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // Replace this in your CreateWorkout.tsx file:
// Delete this line: import { Picker } from '@react-native-picker/picker';

// Add state for dropdown visibility
const [showIntensityDropdown, setShowIntensityDropdown] = useState(false);

// Replace the Picker component with this:


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
      setLoading(true);
      
      const validExercises = exercises.filter(ex => ex.trim() !== '');
      
      const workoutData = {
        name: name.trim(),
        description: description.trim(),
        duration: Number(duration),
        intensity,
        exercises: validExercises,
      };
      
      const createdWorkout = await createWorkout(workoutData);
      
      Alert.alert(
        'Success',
        'Workout created successfully!',
        [
          { 
            text: 'OK', 
            onPress: () => {
              if (onSuccess) {
                onSuccess(createdWorkout);
              } else {
                router.push('./workout');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error creating workout:', error);
      Alert.alert('Error', 'Failed to create workout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Creating workout...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create New Workout</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Workout Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter workout name"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your workout"
          multiline
          numberOfLines={4}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Duration (minutes) *</Text>
        <TextInput
          style={styles.input}
          value={duration}
          onChangeText={setDuration}
          placeholder="Enter duration in minutes"
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.formGroup}>
  <Text style={styles.label}>Intensity</Text>
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
        
        <TouchableOpacity 
          style={styles.addExerciseButton}
          onPress={handleAddExercise}
        >
          <Text style={styles.addExerciseButtonText}>+ Add Exercise</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>Create Workout</Text>
      </TouchableOpacity>
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
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  removeButton: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#ff0000',
    fontSize: 16,
  },
  addExerciseButton: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addExerciseButtonText: {
    color: '#444',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#4caf50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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