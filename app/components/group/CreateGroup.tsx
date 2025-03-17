import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/app/hooks/useAuth';
import { createGroup } from '@/app/services/api/groupApi';
import LocationPicker from '@/app/components/common/LocationPicker';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
}

export default function CreateGroupForm() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sport: '',
    activity: '',
  });
  
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleLocationSelected = (locationData: LocationData) => {
    setLocation(locationData);
  };
  
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate form data
      if (!formData.name || !formData.sport) {
        setError('Group name and sport are required');
        return;
      }
      
      // Create group data with location information
      const groupData = {
        ...formData,
        locationInfo: location ? {
          address: location.address || '',
          city: location.city || '',
          country: location.country || '',
          locationName: `${formData.name} Location`,
          coordinates: [location.longitude, location.latitude]
        } : undefined
      };
      
      // Send API request to create group
      const newGroup = await createGroup(groupData);
      
      // Navigate to the new group page
      router.push(`./groups/${newGroup._id}`);
    } catch (err) {
      console.error('Failed to create group:', err);
      setError('Failed to create group. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create New Group</Text>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Group Name *</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => handleChange('name', text)}
          placeholder="Enter group name"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(text) => handleChange('description', text)}
          placeholder="Describe your group"
          multiline
          numberOfLines={4}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Sport *</Text>
        <TextInput
          style={styles.input}
          value={formData.sport}
          onChangeText={(text) => handleChange('sport', text)}
          placeholder="e.g. Football, Basketball, Running"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Activity</Text>
        <TextInput
          style={styles.input}
          value={formData.activity}
          onChangeText={(text) => handleChange('activity', text)}
          placeholder="e.g. Casual matches, Training"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Location</Text>
        <LocationPicker onLocationSelected={handleLocationSelected} />
        {location && (
          <Text style={styles.locationText}>
            {location.address ? `${location.address}, ` : ''}
            {location.city ? `${location.city}, ` : ''}
            {location.country || ''}
          </Text>
        )}
      </View>
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creating...' : 'Create Group'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
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
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  disabledButton: {
    backgroundColor: '#A5D6A7',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  locationText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  }
});