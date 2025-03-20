import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Trainer } from '@/app/types/trainer';

interface TrainerDetailUIProps {
  trainer: Trainer;
  loading: boolean;
  error: string | null;
  onHire: (trainerId: string) => void;
  onRetry: () => void;
}

export default function TrainerDetailUI({ 
  trainer, 
  loading, 
  error,
  onHire,
  onRetry
}: TrainerDetailUIProps) {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.loadingText}>Loading trainer profile...</Text>
      </View>
    );
  }

  if (error || !trainer) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={60} color="#ff6b6b" />
        <Text style={styles.errorTitle}>Failed to load trainer</Text>
        <Text style={styles.errorMessage}>{error || 'Trainer not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Extract user info
  const userName = typeof trainer.userId === 'object' 
    ? trainer.userId?.name || 'Unknown' 
    : 'Unknown';
    
  const profileImage = typeof trainer.userId === 'object' && trainer.userId?.profileImageUrl 
    ? trainer.userId.profileImageUrl 
    : null;

  // Format reviews to show only the first few
  const visibleReviews = trainer.reviews?.slice(0, 3) || [];
  const hasMoreReviews = (trainer.reviews?.length || 0) > 3;

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <Ionicons name="person" size={50} color="#999" />
          </View>
        )}
        
        <View style={styles.nameContainer}>
          <Text style={styles.trainerName}>{userName}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={18} color="#FFD700" />
            <Text style={styles.ratingText}>
              {trainer.averageRating ? trainer.averageRating.toFixed(1) : 'New'}
            </Text>
            <Text style={styles.reviewCount}>
              ({trainer.reviews?.length || 0} reviews)
            </Text>
          </View>
          <Text style={styles.rate}>
            {trainer.hourlyRate ? `$${trainer.hourlyRate}/hr` : 'Contact for rate'}
          </Text>
        </View>
      </View>
      
      {/* Experience */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experience</Text>
        <View style={styles.experienceItem}>
          <Ionicons name="time-outline" size={20} color="#4a90e2" />
          <Text style={styles.experienceText}>
            {trainer.yearsOfExperience} {trainer.yearsOfExperience === 1 ? 'year' : 'years'} of experience
          </Text>
        </View>
      </View>
      
      {/* Bio */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.bioText}>{trainer.bio}</Text>
      </View>
      
      {/* Specializations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Specializations</Text>
        <View style={styles.specializationsContainer}>
          {trainer.specializations?.map((specialization, index) => (
            <View key={index} style={styles.specializationTag}>
              <Text style={styles.specializationText}>{specialization}</Text>
            </View>
          ))}
          {(!trainer.specializations || trainer.specializations.length === 0) && (
            <Text style={styles.emptyListText}>No specializations listed</Text>
          )}
        </View>
      </View>
      
      {/* Certifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Certifications</Text>
        {trainer.certifications && trainer.certifications.length > 0 ? (
          trainer.certifications.map((cert, index) => (
            <View key={index} style={styles.certificationItem}>
              <Text style={styles.certificationName}>{cert.name}</Text>
              <Text style={styles.certificationDetail}>
                {cert.type} • Issued: {new Date(cert.issueDate).toLocaleDateString()}
                {cert.expiryDate && ` • Expires: ${new Date(cert.expiryDate).toLocaleDateString()}`}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyListText}>No certifications listed</Text>
        )}
      </View>
      
      {/* Reviews */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reviews</Text>
        {visibleReviews.length > 0 ? (
          <>
            {visibleReviews.map((review, index) => (
              <View key={index} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewerName}>
                    {typeof review.userId === 'object' && review.userId?.name 
                      ? review.userId.name 
                      : 'Anonymous'}
                  </Text>
                  <View style={styles.reviewRating}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons 
                        key={star}
                        name={star <= review.rating ? "star" : "star-outline"} 
                        size={16} 
                        color="#FFD700" 
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewText}>{review.comment}</Text>
                <Text style={styles.reviewDate}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </Text>
              </View>
            ))}
            {hasMoreReviews && (
              <TouchableOpacity style={styles.moreReviewsButton}>
                <Text style={styles.moreReviewsText}>
                  See all {trainer.reviews?.length} reviews
                </Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <Text style={styles.emptyListText}>No reviews yet</Text>
        )}
      </View>
      
      {/* Hire Button */}
      <TouchableOpacity 
        style={styles.hireButton}
        onPress={onHire}
      >
        <Text style={styles.hireButtonText}>Book a Session</Text>
        <Ionicons name="arrow-forward" size={20} color="white" />
      </TouchableOpacity>
      
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginTop: 10,
    marginBottom: 5,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    marginLeft: 20,
    flex: 1,
    justifyContent: 'center',
  },
  trainerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  rate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  experienceItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  experienceText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#444',
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  specializationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specializationTag: {
    backgroundColor: '#e8f4fd',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 4,
  },
  specializationText: {
    color: '#4a90e2',
    fontSize: 14,
  },
  certificationItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  certificationName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  certificationDetail: {
    fontSize: 14,
    color: '#666',
  },
  reviewItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#444',
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  moreReviewsButton: {
    padding: 10,
    alignItems: 'center',
  },
  moreReviewsText: {
    color: '#4a90e2',
    fontSize: 16,
  },
  emptyListText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
  hireButton: {
    backgroundColor: '#4a90e2',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    padding: 16,
    borderRadius: 10,
  },
  hireButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  bottomPadding: {
    height: 30,
  },
});