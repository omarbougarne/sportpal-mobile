import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { createGroup } from '@/app/services/api/groupApi';
import { useAuth } from '@/app/hooks/useAuth';
import CreateGroupUI from '../../components/group/CreateGroupUI';

export interface LocationType {
  name: string;
  coordinates: number[];
  city: string;
  country: string;
  display_name: string;
}

export default function CreateGroupContainer() {
  // Form state
  console.log('Auth state:', user ? 'Logged in as ' + user.email : 'Not logged in');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sport, setSport] = useState('');
  const [activity, setActivity] = useState('');
  
  // Location state variables
  const [cityName, setCityName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [country, setCountry] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationFound, setLocationFound] = useState(false);
  const [groupLocation, setGroupLocation] = useState<LocationType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { user } = useAuth();
  const router = useRouter();
  
  // Search locations directly
  const searchLocations = async (query: string) => {
    if (!query || query.length < 2) return;
    
    setIsSearching(true);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      
      const data = await response.json();
      if (Array.isArray(data)) {
        setSearchResults(data.slice(0, 5)); // Limit to 5 results
      }
    } catch (error) {
      console.error('Error searching locations:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Handle location selection
  const handleSelectLocation = (item: any) => {
    if (!item) return;
    
    try {
      const location = {
        name: item.display_name?.split(',')[0] || 'Unknown',
        coordinates: [
          parseFloat(item.lon || '0'), 
          parseFloat(item.lat || '0')
        ],
        city: item.address?.city || item.address?.town || item.display_name?.split(',')[0] || 'Unknown',
        country: item.address?.country || '',
        display_name: item.display_name || 'Unknown location'
      };
      
      setGroupLocation(location);
      setCityName(location.city);
      setLocationName(location.name);
      setCountry(location.country || '');
      setLocationFound(true);
      setSearchResults([]); // Clear results
      setSearchQuery(location.city); // Update search box
    } catch (error) {
      console.error('Error selecting location:', error);
    }
  };
  
  // Handle using current location
  const handleUseCurrentLocation = async () => {
    try {
      // Request permission first
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to use this feature');
        return;
      }
      
      setIsLocating(true);
      
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
    } finally {
      setIsLocating(false);
    }
  };
  
  // Reset location
  const handleResetLocation = () => {
    setLocationFound(false);
    setGroupLocation(null);
    setCityName('');
    setLocationName('');
    setCountry('');
    setSearchQuery('');
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
    
    if (!locationFound || !groupLocation) {
      Alert.alert('Error', 'Please select a location for your group');
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
  
  // Format location display text safely
  const getLocationDisplayText = () => {
    if (!groupLocation) return '';
    
    let parts = [];
    if (typeof groupLocation.name === 'string') parts.push(groupLocation.name);
    if (typeof groupLocation.city === 'string' && groupLocation.city !== groupLocation.name) {
      parts.push(groupLocation.city);
    }
    if (typeof groupLocation.country === 'string') parts.push(groupLocation.country);
    
    return parts.join(', ') || 'Unknown location';
  };
  
  return (
    <CreateGroupUI
      // Form state
      name={name}
      description={description}
      sport={sport}
      activity={activity}
      setName={setName}
      setDescription={setDescription}
      setSport={setSport}
      setActivity={setActivity}
      
      // Location state
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      searchLocations={searchLocations}
      searchResults={searchResults}
      isSearching={isSearching}
      locationFound={locationFound}
      isLocating={isLocating}
      
      // Handlers
      handleSelectLocation={handleSelectLocation}
      handleUseCurrentLocation={handleUseCurrentLocation}
      handleResetLocation={handleResetLocation}
      handleCreateGroup={handleCreateGroup}
      
      // Display text
      getLocationDisplayText={getLocationDisplayText}
    />
  );
}