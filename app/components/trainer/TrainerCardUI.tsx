import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Trainer } from '@/app/types/trainer';

interface TrainerCardUIProps {
  trainer: Trainer;
  onViewProfile: () => void;
  onHire: () => void;
}

export default function TrainerCardUI({ trainer, onViewProfile, onHire }: TrainerCardUIProps) {
  // Extract user info - handle both string and object cases
  const userName = typeof trainer.userId === 'object' 
    ? trainer.userId?.name || 'Unknown' 
    : 'Unknown';
    
  const profileImage = typeof trainer.userId === 'object' && trainer.userId?.profileImageUrl 
    ? trainer.userId.profileImageUrl 
    : null;
    
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={24} color="#999" />
            </View>
          )}
          
          <View style={styles.nameSection}>
            <Text style={styles.name}>{userName}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>
                {trainer.averageRating ? trainer.averageRating.toFixed(1) : 'New'}
              </Text>
              <Text style={styles.reviewCount}>
                ({trainer.reviews?.length || 0})
              </Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.rate}>
          {trainer.hourlyRate ? `$${trainer.hourlyRate}/hr` : 'Contact for rate'}
        </Text>
      </View>
      
      <Text style={styles.bio} numberOfLines={2}>
        {trainer.bio}
      </Text>
      
      <View style={styles.specializationsContainer}>
        {trainer.specializations.slice(0, 3).map((spec, index) => (
          <View key={index} style={styles.specializationTag}>
            <Text style={styles.specializationText}>{spec}</Text>
          </View>
        ))}
        {trainer.specializations.length > 3 && (
          <View style={styles.specializationTag}>
            <Text style={styles.specializationText}>+{trainer.specializations.length - 3}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.viewProfileButton}
          onPress={onViewProfile}
        >
          <Text style={styles.viewProfileText}>View Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.hireButton}
          onPress={onHire}
        >
          <Text style={styles.hireText}>Hire</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameSection: {
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
  },
  reviewCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  rate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  bio: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  specializationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  specializationTag: {
    backgroundColor: '#f0f8ff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    marginRight: 6,
    marginBottom: 6,
  },
  specializationText: {
    fontSize: 12,
    color: '#4a90e2',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewProfileButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  viewProfileText: {
    color: '#555',
  },
  hireButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  hireText: {
    color: 'white',
    fontWeight: 'bold',
  },
});