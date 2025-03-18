import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CreateGroupUIProps {
  
  name: string;
  description: string;
  sport: string;
  activity: string;
  setName: (name: string) => void;
  setDescription: (desc: string) => void;
  setSport: (sport: string) => void;
  setActivity: (activity: string) => void;
  
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchLocations: (query: string) => void;
  searchResults: any[];
  isSearching: boolean;
  locationFound: boolean;
  isLocating: boolean;
  
  
  handleSelectLocation: (item: any) => void;
  handleUseCurrentLocation: () => void;
  handleResetLocation: () => void;
  handleCreateGroup: () => void;
  
  
  getLocationDisplayText: () => string;
}

export default function CreateGroupUI(props: CreateGroupUIProps) {
  const {
    name, description, sport, activity,
    setName, setDescription, setSport, setActivity,
    searchQuery, setSearchQuery, searchLocations, searchResults,
    isSearching, locationFound, isLocating,
    handleSelectLocation, handleUseCurrentLocation, handleResetLocation, handleCreateGroup,
    getLocationDisplayText
  } = props;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Create New Group</Text>
        
        {/* Group name field */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Group Name*</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter group name"
            placeholderTextColor="#999"
          />
        </View>
        
        {/* Description field */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter group description"
            placeholderTextColor="#999"
            multiline
          />
        </View>
        
        {/* Sport field */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Sport*</Text>
          <TextInput
            style={styles.input}
            value={sport}
            onChangeText={setSport}
            placeholder="Enter sport type"
            placeholderTextColor="#999"
          />
        </View>
        
        {/* Activity field */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Activity</Text>
          <TextInput
            style={styles.input}
            value={activity}
            onChangeText={setActivity}
            placeholder="Enter activity details"
            placeholderTextColor="#999"
          />
        </View>
        
        {/* Location section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Search for a city</Text>
            <TextInput
              style={styles.input}
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                if (text.length > 2) {
                  searchLocations(text);
                }
              }}
              placeholder="Enter city name..."
              placeholderTextColor="#999"
            />
            
            {/* Search results */}
            {isSearching && (
              <ActivityIndicator style={styles.searchingIndicator} color="#FFF" />
            )}
            
            {searchResults.length > 0 && (
              <View style={styles.resultsContainer}>
                {searchResults.map((item, index) => (
                  <TouchableOpacity 
                    key={item.place_id || `result-${index}`}
                    style={styles.resultItem}
                    onPress={() => handleSelectLocation(item)}
                  >
                    <Text style={styles.resultText}>
                      {typeof item.display_name === 'string' ? item.display_name : 'Unknown location'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.useCurrentLocationButton}
            onPress={handleUseCurrentLocation}
            disabled={isLocating}
          >
            {isLocating ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Ionicons name="location" size={20} color="white" style={{marginRight: 8}} />
                <Text style={{color: 'white'}}>Use My Current Location</Text>
              </>
            )}
          </TouchableOpacity>
          
          {locationFound && (
            <View style={styles.locationFoundContainer}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.locationFoundText}>
                  {`Location: ${getLocationDisplayText()}`}
                </Text>
              </View>
              
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleResetLocation}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {/* Create button */}
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreateGroup}
        >
          <Text style={styles.createButtonText}>Create Group</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color:'#fff'
  },
  formGroup: {
    marginBottom: 16,
    position: 'relative',
  },
  section: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: 'white',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
  },
  searchingIndicator: {
    position: 'absolute',
    right: 15,
    top: 45,
  },
  resultsContainer: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(40, 40, 40, 0.95)',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    zIndex: 999,
    maxHeight: 200,
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  resultText: {
    color: 'white',
    fontSize: 14,
  },
  locationFoundContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: 'rgba(20, 60, 20, 0.7)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4C4C4C',
  },
  locationFoundText: {
    marginLeft: 8,
    color: '#4CAF50',
    fontSize: 14,
  },
  useCurrentLocationButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  resetButton: {
    backgroundColor: 'rgba(80, 80, 80, 0.9)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  resetButtonText: {
    color: '#FF8A80',
    fontSize: 14,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});