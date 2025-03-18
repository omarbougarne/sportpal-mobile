import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { getGroupById, updateGroup } from '@/app/services/api/groupApi';
import { Ionicons } from '@expo/vector-icons';

interface UpdateGroupProps {
  id: string;
}

export default function UpdateGroup({ id }: UpdateGroupProps) {
  const [group, setGroup] = useState<any>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sport, setSport] = useState('');
  const [activity, setActivity] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      console.error('No group ID provided');
      return;
    }

    const loadGroup = async () => {
      try {
        setLoading(true);
        const data = await getGroupById(id);
        setGroup(data);
        setName(data.name || '');
        setDescription(data.description || '');
        setSport(data.sport || '');
        setActivity(data.activity || '');
      } catch (error) {
        console.error('Failed to fetch group information:', error);
        setError('Could not load group information');
      } finally {
        setLoading(false);
      }
    };

    loadGroup();
  }, [id]);

  const handleUpdate = async () => {
    if (!id) {
      console.error('No group ID provided');
      return;
    }

    try {
      setUpdating(true);
      const updatedGroup = { 
        name, 
        description,
        sport, 
        activity
        // Don't update location here - it will be handled separately
      };
      
      await updateGroup(id, updatedGroup);
      
      // Update the local state to reflect changes
      setGroup({
        ...group,
        ...updatedGroup
      });
      
      Alert.alert('Success', 'Group information updated successfully');
    } catch (error) {
      console.error('Failed to update group:', error);
      setError('Failed to update group. Please try again.');
      Alert.alert('Error', 'Could not update group information');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading group information...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#FF3B30" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Group Information</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Group Name*</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter group name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter description"
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Sport*</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter sport type"
          placeholderTextColor="#999"
          value={sport}
          onChangeText={setSport}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Activity</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter activity details"
          placeholderTextColor="#999"
          value={activity}
          onChangeText={setActivity}
        />
      </View>
      
      <TouchableOpacity 
        style={styles.updateButton}
        onPress={handleUpdate}
        disabled={updating}
      >
        {updating ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <>
            <Ionicons name="save-outline" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.updateButtonText}>Update Group Info</Text>
          </>
        )}
      </TouchableOpacity>
      
      <View style={styles.locationSection}>
        <Text style={styles.sectionTitle}>Location</Text>
        <Text style={styles.infoText}>
          To update the group location, use the location management tools below.
        </Text>
        
        <TouchableOpacity style={styles.locationButton}>
          <Ionicons name="location-outline" size={20} color="white" style={styles.buttonIcon} />
          <Text style={styles.locationButtonText}>Update Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: {
    height: 100,
  },
  updateButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    marginTop: 16,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  locationSection: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  locationButton: {
    backgroundColor: '#FF9800',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
  },
  locationButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});