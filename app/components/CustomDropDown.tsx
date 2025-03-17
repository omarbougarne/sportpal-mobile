import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CustomDropdownProps {
  label: string;
  options: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

export default function CustomDropdown({
  label,
  options,
  selectedValue,
  onValueChange
}: CustomDropdownProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.customPickerButton}
        onPress={() => setShowDropdown(!showDropdown)}
      >
        <Text style={styles.pickerText}>{selectedValue}</Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>
      {showDropdown && (
        <View style={styles.dropdownList}>
          {options.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.dropdownItem,
                selectedValue === option && styles.selectedDropdownItem
              ]}
              onPress={() => {
                onValueChange(option);
                setShowDropdown(false);
              }}
            >
              <Text style={selectedValue === option ? styles.selectedOptionText : styles.optionText}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
    zIndex: 100,
    position: 'relative',
  },
  label: {
    fontSize: 16,
    color: '#DDD',
    marginBottom: 8,
  },
  customPickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
  },
  pickerText: {
    fontSize: 16,
    color: 'white',
  },
  dropdownArrow: {
    fontSize: 14,
    color: 'white',
  },
  dropdownList: {
    position: 'absolute',
    top: 76, // Adjusted to account for label height
    left: 0,
    right: 0,
    backgroundColor: 'rgba(40, 40, 40, 0.95)',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    maxHeight: 200, // Prevent it from getting too long
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  selectedDropdownItem: {
    backgroundColor: 'rgba(76, 50, 171, 0.5)',
  },
  optionText: {
    fontSize: 16,
    color: 'white',
  },
  selectedOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#BB86FC', // Material Design purple for dark theme
  },
});