import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getCoordinatesFromAddress } from '@/app/services/api/geocodingApi';
import * as Location from 'expo-location';
import { createGroup } from '@/app/services/api/groupApi';
import { useAuth } from '@/app/hooks/useAuth';
import CitySearchInput from '../CitySearchInput';

export default function CreateGroup() {
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sport, setSport] = useState('');
  const [activity, setActivity] = useState('');
  
  // Location state variables
  const [cityName, setCityName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationFound, setLocationFound] = useState(false);
  const [groupLocation, setGroupLocation] = useState(null);
  
  const { user } = useAuth();
  const router = useRouter();
  
  // Location handler function
  const handleAddLocation = async () => {
    if (!cityName) {
      Alert.alert('Error', 'Please enter a city name');
      return;
    }
    
    setIsLocating(true);
    
    try {
      // Use the city name plus any additional address info
      const searchQuery = address ? `${address}, ${cityName}, ${country}` : `${cityName}, ${country}`;
      
      const locationData = await getCoordinatesFromAddress(searchQuery);
      
      if (locationData) {
        // Create a location object to save to your database
        const newLocation = {
          name: locationName || cityName,
          coordinates: locationData.coordinates, // [longitude, latitude]
          address: address || '',
          city: cityName,
          country: country || '',
          display_name: locationData.display_name
        };
        
        setGroupLocation(newLocation);
        setLocationFound(true);
        Alert.alert('Success', 'Location found and ready to use!');
      } else {
        Alert.alert('Error', 'Could not find coordinates for this location');
      }
    } catch (error) {
      console.error('Error locating address:', error);
      Alert.alert('Error', 'Failed to locate the address');
    } finally {
      setIsLocating(false);
    }
  };
  
  // Group creation handler
  const handleCreateGroup = async () => {
    if (!name || !sport) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    if (!user) {
      Alert.alert('Error', 'You must be logged in to create a group');
      return;
    }
    
    try {
      // Create the new group with location data
      const newGroup = {
        name,
        description,
        sport,
        activity,
        location: groupLocation // Include the location object
      };
      
      const createdGroup = await createGroup(newGroup);
      
      Alert.alert('Success', 'Group created successfully!');
      router.push(`/group/${createdGroup._id}`);
    } catch (error) {
      console.error('Error creating group:', error);
      
      // Better error handling
      if (error.response && error.response.status === 401) {
        Alert.alert('Authentication Error', 'Please log in again to create a group');
      } else if (error.response && error.response.status === 409) {
        Alert.alert('Error', 'A group with this name already exists');
      } else {
        Alert.alert('Error', 'Failed to create group. Please try again.');
      }
    }
  };
  
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
            <CitySearchInput 
              onLocationSelected={(location) => {
                setGroupLocation(location);
                setCityName(location.city);
                setLocationName(location.name);
                setCountry(location.country || '');
                setLocationFound(true);
              }}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.useCurrentLocationButton}
            onPress={async () => {
              try {
                // Request permission first
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                  Alert.alert('Permission denied', 'Location permission is required to use this feature');
                  return;
                }
                
                // Get current position
                const position = await Location.getCurrentPositionAsync({});
                
                // Get address from coordinates
                const addresses = await Location.reverseGeocodeAsync({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude
                });
                
                if (addresses && addresses[0]) {
                  const address = addresses[0];
                  
                  // Create location object
                  const currentLocation = {
                    name: address.city || 'Current location',
                    coordinates: [position.coords.longitude, position.coords.latitude],
                    city: address.city || '',
                    country: address.country || '',
                    display_name: `${address.city || ''}, ${address.country || ''}`
                  };
                  
                  setGroupLocation(currentLocation);
                  setCityName(currentLocation.city);
                  setLocationName(currentLocation.name);
                  setCountry(currentLocation.country);
                  setLocationFound(true);
                }
              } catch (error) {
                console.error('Error getting location:', error);
                Alert.alert('Error', 'Could not get your current location');
              }
            }}
          >
            <Ionicons name="location" size={20} color="white" style={{marginRight: 8}} />
            <Text style={{color: 'white'}}>Use My Current Location</Text>
          </TouchableOpacity>
          
          {locationFound && (
            <View style={styles.locationFoundContainer}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.locationFoundText}>
                  Location: {groupLocation?.name || cityName}
                  {groupLocation?.city ? `, ${groupLocation.city}` : ''}
                  {groupLocation?.country ? `, ${groupLocation.country}` : ''}
                </Text>
              </View>
              
              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => {
                  setLocationFound(false);
                  setGroupLocation(null);
                  setCityName('');
                  setLocationName('');
                  setCountry('');
                }}
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

// Keep your existing styles

const styles = StyleSheet.create({
  // Your existing styles
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
  },
  // Update your styles
section: {
  marginVertical: 16,
  padding: 16,
  backgroundColor: 'rgba(30, 30, 30, 0.8)', // Dark background
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#333',
},
sectionTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 16,
  color: 'white', // White text
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
locationFoundContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 16,
  backgroundColor: 'rgba(20, 60, 20, 0.7)', // Dark green
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