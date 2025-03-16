import React from 'react';
import { View, FlatList, ActivityIndicator, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Trainer } from '@/app/types/trainer';
import TrainerCardUI from './TrainerCardUI';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface TrainersListUIProps {
  trainers: Trainer[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onViewProfile: (trainerId: string) => void;
  onHireTrainer: (trainerId: string) => void;
  onRetry: () => void;
}

export default function TrainersListUI({
  trainers,
  loading,
  error,
  searchQuery,
  onSearchChange,
  onViewProfile,
  onHireTrainer,
  onRetry
}: TrainersListUIProps) {
  
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.loadingText}>Loading trainers...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Ensure trainers is an array
  const safeTrainers = Array.isArray(trainers) ? trainers : [];

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search trainers..."
        value={searchQuery}
        onChangeText={onSearchChange}
        clearButtonMode="while-editing"
      />
      
      {safeTrainers.length > 0 ? (
        <FlatList
  data={safeTrainers}
  keyExtractor={(item) => item._id || Math.random().toString()}
  renderItem={({ item }) => (
    <TrainerCardUI
      trainer={item}
      onViewProfile={() => onViewProfile(item._id!)}
      onHire={() => onHireTrainer(item._id!)}  // Make sure this line exists
    />
  )}
  contentContainerStyle={styles.listContent}
/>
      ) : (
        <View style={styles.centerContainer}>
          <Ionicons name="fitness-outline" size={60} color="#ccc" />
          <Text style={styles.noResultsText}>
            {searchQuery ? "No trainers match your search" : "No trainers available"}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  searchInput: {
    height: 46,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  noResultsText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});