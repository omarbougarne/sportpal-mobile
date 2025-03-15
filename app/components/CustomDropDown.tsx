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
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
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
    top: 50,
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