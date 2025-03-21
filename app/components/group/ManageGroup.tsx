import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import UpdateGroup from './UpdateGroup';
import ManageMembers from './ManageMembers'; // Import the ManageMembers component

interface ManageGroupProps {
  id: string;
}

export default function ManageGroup({ id }: ManageGroupProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('info');
  
  const handleDeleteGroup = () => {
    Alert.alert(
      'Delete Group',
      'Are you sure you want to delete this group? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Call your delete group API here
              // await deleteGroup(id);
              Alert.alert('Success', 'Group has been deleted');
              router.replace('/(tabs)'); // Navigate back to the main screen
            } catch (error) {
              Alert.alert('Error', 'Failed to delete the group');
              console.error('Error deleting group:', error);
            }
          }
        }
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2196F3" />
        </TouchableOpacity>
        <Text style={styles.title}>Manage Group</Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'info' && styles.activeTabButton]}
          onPress={() => setActiveTab('info')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'info' && styles.activeTabButtonText]}>
            Group Info
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'members' && styles.activeTabButton]}
          onPress={() => setActiveTab('members')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'members' && styles.activeTabButtonText]}>
            Members
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'events' && styles.activeTabButton]}
          onPress={() => setActiveTab('events')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'events' && styles.activeTabButtonText]}>
            Events
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {activeTab === 'info' && (
          <UpdateGroup id={id} />
        )}
        
        {activeTab === 'members' && (
          <View style={styles.tabContent}>
            <ManageMembers groupId={id} />
          </View>
        )}
        
        {activeTab === 'events' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Group Events</Text>
            <Text style={styles.infoText}>
              Create and manage events for your group.
            </Text>
            {/* Events management UI would go here */}
            
            <TouchableOpacity 
              style={styles.createEventButton}
              onPress={() => router.push(`/group/${id}/create-event`)}
            >
              <Ionicons name="add-circle-outline" size={20} color="white" style={styles.buttonIcon} />
              <Text style={styles.createEventText}>Create New Event</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={handleDeleteGroup}
      >
        <Ionicons name="trash-outline" size={20} color="white" style={styles.buttonIcon} />
        <Text style={styles.deleteButtonText}>Delete Group</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
  },
  tabButtonText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabButtonText: {
    color: '#2196F3',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  createEventButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    marginTop: 16,
  },
  createEventText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    margin: 16,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});