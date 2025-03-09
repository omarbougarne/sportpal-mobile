import React from 'react';
import { 
  View, Text, StyleSheet, TextInput, ScrollView, 
  TouchableOpacity, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// These should match your backend enums
enum WorkoutType {
  CARDIO = 'CARDIO',
  STRENGTH = 'STRENGTH',
  FLEXIBILITY = 'FLEXIBILITY',
  HIIT = 'HIIT',
  CROSSFIT = 'CROSSFIT',
  YOGA = 'YOGA'
}

enum DifficultyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

interface CreateWorkoutUIProps {
  title: string;
  description: string;
  workoutType: WorkoutType;
  difficultyLevel: DifficultyLevel;
  duration: string;
  caloriesBurn: string;
  exercises: string[];
  saving: boolean;
  showWorkoutTypeDropdown: boolean;
  showDifficultyDropdown: boolean;
  onTitleChange: (text: string) => void;
  onDescriptionChange: (text: string) => void;
  onWorkoutTypeChange: (type: WorkoutType) => void;
  onDifficultyLevelChange: (level: DifficultyLevel) => void;
  onDurationChange: (text: string) => void;
  onCaloriesBurnChange: (text: string) => void;
  onToggleWorkoutTypeDropdown: () => void;
  onToggleDifficultyDropdown: () => void;
  onAddExercise: () => void;
  onRemoveExercise: (index: number) => void;
  onExerciseChange: (text: string, index: number) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function CreateWorkoutUI({
  title,
  description,
  workoutType,
  difficultyLevel,
  duration,
  caloriesBurn,
  exercises,
  saving,
  showWorkoutTypeDropdown,
  showDifficultyDropdown,
  onTitleChange,
  onDescriptionChange,
  onWorkoutTypeChange,
  onDifficultyLevelChange,
  onDurationChange,
  onCaloriesBurnChange,
  onToggleWorkoutTypeDropdown,
  onToggleDifficultyDropdown,
  onAddExercise,
  onRemoveExercise,
  onExerciseChange,
  onSubmit,
  onCancel
}: CreateWorkoutUIProps) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create New Workout</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Workout Title*</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={onTitleChange}
          placeholder="e.g. Morning Cardio"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={onDescriptionChange}
          placeholder="Describe your workout..."
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Workout Type*</Text>
        <TouchableOpacity 
          style={styles.customPickerButton}
          onPress={onToggleWorkoutTypeDropdown}
        >
          <Text style={styles.pickerText}>
            {workoutType.charAt(0) + workoutType.slice(1).toLowerCase().replace('_', ' ')}
          </Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>
        
        {showWorkoutTypeDropdown && (
          <View style={styles.dropdownList}>
            {Object.values(WorkoutType).map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.dropdownItem,
                  workoutType === type && styles.selectedDropdownItem
                ]}
                onPress={() => {
                  onWorkoutTypeChange(type);
                  onToggleWorkoutTypeDropdown();
                }}
              >
                <Text style={workoutType === type ? styles.selectedOptionText : styles.optionText}>
                  {type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Difficulty Level*</Text>
        <TouchableOpacity 
          style={styles.customPickerButton}
          onPress={onToggleDifficultyDropdown}
        >
          <Text style={styles.pickerText}>
            {difficultyLevel.charAt(0) + difficultyLevel.slice(1).toLowerCase()}
          </Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>
        
        {showDifficultyDropdown && (
          <View style={styles.dropdownList}>
            {Object.values(DifficultyLevel).map(level => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.dropdownItem,
                  difficultyLevel === level && styles.selectedDropdownItem
                ]}
                onPress={() => {
                  onDifficultyLevelChange(level);
                  onToggleDifficultyDropdown();
                }}
              >
                <Text style={difficultyLevel === level ? styles.selectedOptionText : styles.optionText}>
                  {level.charAt(0) + level.slice(1).toLowerCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Duration (minutes)*</Text>
        <TextInput
          style={styles.input}
          value={duration}
          onChangeText={onDurationChange}
          keyboardType="numeric"
          placeholder="e.g. 30"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Calories Burn*</Text>
        <TextInput
          style={styles.input}
          value={caloriesBurn}
          onChangeText={onCaloriesBurnChange}
          keyboardType="numeric"
          placeholder="e.g. 300"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Exercises*</Text>
        {exercises.map((exercise, index) => (
          <View key={index} style={styles.exerciseRow}>
            <TextInput
              style={[styles.input, styles.exerciseInput]}
              value={exercise}
              onChangeText={(text) => onExerciseChange(text, index)}
              placeholder={`Exercise ${index + 1}`}
            />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => onRemoveExercise(index)}
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
        <TouchableOpacity style={styles.addButton} onPress={onAddExercise}>
          <Ionicons name="add-circle" size={24} color="#4caf50" />
          <Text style={styles.addButtonText}>Add Exercise</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={[styles.submitButton, saving && styles.disabledButton]}
        onPress={onSubmit}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Create Workout</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={onCancel}
        disabled={saving}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
      
      <View style={styles.spacer} />
    </ScrollView>
  );
}

// Styles remain the same as before
const styles = StyleSheet.create({
  // All your existing styles...
  container: {
    flex: 1,
    padding: 16,
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
    top: 85,
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
});