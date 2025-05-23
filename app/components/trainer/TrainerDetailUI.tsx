import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Trainer } from '@/app/types/trainer';

interface TrainerDetailUIProps {
  trainer: Trainer;
  loading: boolean;
  error: string | null;
  onHire: (trainerId: string) => void;
  onRetry: () => void;
  // New props for review functionality
  showReviewForm?: boolean;
  userHasReviewed?: boolean;
  onAddReview?: () => void;
  onSubmitReview?: (review: { rating: number; comment: string }) => Promise<void>;
  onCancelReview?: () => void;
}

export default function TrainerDetailUI({ 
  trainer, 
  loading, 
  error,
  onHire,
  onRetry,
  showReviewForm = false,
  userHasReviewed = false,
  onAddReview,
  onSubmitReview,
  onCancelReview
}: TrainerDetailUIProps) {
  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  // Function to handle review submission
  const handleSubmitReview = async () => {
    if (!onSubmitReview) return;
    
    try {
      setSubmitting(true);
      await onSubmitReview({ rating, comment });
      // Reset form state
      setRating(5);
      setComment('');
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

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
      
      {/* Reviews Section - Updated with Add Review button */}
      <View style={styles.section}>
        <View style={styles.reviewSectionHeader}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          {onAddReview && !userHasReviewed && !showReviewForm && (
            <TouchableOpacity onPress={onAddReview} style={styles.addReviewButton}>
              <Text style={styles.addReviewText}>Add Review</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Review Form */}
        {showReviewForm && (
          <View style={styles.reviewForm}>
            <Text style={styles.reviewFormTitle}>Write a Review</Text>
            
            <View style={styles.ratingInputContainer}>
              <Text style={styles.inputLabel}>Rating:</Text>
              <View style={styles.starsInput}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity 
                    key={star} 
                    onPress={() => setRating(star)}
                    disabled={submitting}
                  >
                    <Ionicons
                      name={star <= rating ? "star" : "star-outline"}
                      size={30}
                      color={star <= rating ? "#FFD700" : "#ccc"}
                      style={styles.starInput}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <Text style={styles.inputLabel}>Your Review:</Text>
            <TextInput
              style={styles.commentInput}
              multiline
              numberOfLines={4}
              placeholder="Share your experience with this trainer..."
              value={comment}
              onChangeText={setComment}
              editable={!submitting}
            />
            
            <View style={styles.formButtons}>
              <TouchableOpacity 
                style={[styles.formButton, styles.cancelButton]} 
                onPress={onCancelReview}
                disabled={submitting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.formButton, 
                  styles.submitButton,
                  submitting && styles.disabledButton
                ]} 
                onPress={handleSubmitReview}
                disabled={submitting}
              >
                <Text style={styles.submitButtonText}>
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        {/* Existing reviews display */}
        {!showReviewForm && (
          <>
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
          </>
        )}
      </View>
      
      {/* Hire Button */}
      <TouchableOpacity 
        style={styles.hireButton}
        onPress={() => trainer._id && onHire(trainer._id)}
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
  // New styles for review form
  reviewSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addReviewButton: {
    backgroundColor: '#e8f4fd',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4a90e2',
  },
  addReviewText: {
    color: '#4a90e2',
    fontSize: 14,
    fontWeight: '500',
  },
  reviewForm: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  reviewFormTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  ratingInputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  starsInput: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  starInput: {
    margin: 5,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: '#4a90e2',
  },
  cancelButton: {
    backgroundColor: '#f1f1f1',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#666',
  },
  disabledButton: {
    opacity: 0.6,
  },
});