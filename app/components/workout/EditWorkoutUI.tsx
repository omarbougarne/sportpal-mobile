import React from 'react';
import { 
  View, Text, StyleSheet, TextInput, ScrollView, 
  TouchableOpacity, ActivityIndicator, ImageBackground 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EditWorkoutUIProps } from '@/app/types/workout/EditWorkoutUIProps';

export default function EditWorkoutUI({
  name,
  description,
  duration,
  intensity,
  exercises,
  loading,
  saving,
  error,
  isAuthorized, // New prop to check if user is authorized to edit
  showIntensityDropdown,
  onNameChange,
  onDescriptionChange,
  onDurationChange,
  onIntensityChange,
  onToggleIntensityDropdown,
  onAddExercise,
  onRemoveExercise,
  onExerciseChange,
  onSubmit,
  onCancel,
  onRetry
}: EditWorkoutUIProps) {

  // Render content based on loading, error, and authorization status
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text style={styles.loadingText}>Loading workout...</Text>
        </View>
      );
    }
  
    if (!isAuthorized) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="lock-closed" size={60} color="#ff6b6b" />
          <Text style={styles.errorText}>You don't have permission to edit this workout.</Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={onCancel}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          {onRetry && (
            <TouchableOpacity 
              style={styles.button}
              onPress={onRetry}
            >
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[styles.button, { marginTop: 10, backgroundColor: 'rgba(150, 150, 150, 0.7)' }]}
            onPress={onCancel}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>Edit Workout</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Workout Name*</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={onNameChange}
            placeholder="e.g. Morning Cardio"
            placeholderTextColor="#888"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={onDescriptionChange}
            placeholder="Describe your workout..."
            placeholderTextColor="#888"
            multiline
            numberOfLines={4}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Duration (minutes)*</Text>
          <TextInput
            style={styles.input}
            value={duration}
            onChangeText={onDurationChange}
            keyboardType="numeric"
            placeholder="e.g. 30"
            placeholderTextColor="#888"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Intensity*</Text>
          <TouchableOpacity 
            style={styles.customPickerButton}
            onPress={onToggleIntensityDropdown}
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
                    onIntensityChange(option);
                    onToggleIntensityDropdown();
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
                onChangeText={(text) => onExerciseChange(text, index)}
                placeholder={`Exercise ${index + 1}`}
                placeholderTextColor="#888"
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onRemoveExercise(index)}
                disabled={exercises.length === 1}
              >
                <Ionicons 
                  name="remove-circle" 
                  size={24} 
                  color={exercises.length === 1 ? '#666' : '#ff6b6b'} 
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
            <Text style={styles.submitButtonText}>Update Workout</Text>
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
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
  
  // Typography
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#DDDDDD',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  
  // Form Elements
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#DDDDDD',
  },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'rgba(34, 34, 34, 0.9)',
    color: 'white',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  
  // Custom Dropdown
  customPickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 5,
    padding: 12,
    backgroundColor: 'rgba(34, 34, 34, 0.9)',
  },
  pickerText: {
    fontSize: 16,
    color: 'white',
  },
  dropdownArrow: {
    fontSize: 14,
    color: '#BBBBBB',
  },
  dropdownList: {
    position: 'absolute',
    top: 85,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 5,
    zIndex: 1000,
    elevation: 5,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  selectedDropdownItem: {
    backgroundColor: 'rgba(33, 150, 243, 0.3)',
  },
  optionText: {
    fontSize: 16,
    color: '#DDDDDD',
  },
  selectedOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  
  // Exercise Items
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
  
  // Buttons
  button: {
    backgroundColor: 'rgba(33, 150, 243, 0.9)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.5)',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  submitButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.5)',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
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
    color: '#BBBBBB',
    fontSize: 16,
  },
  spacer: {
    height: 40,
  },
});