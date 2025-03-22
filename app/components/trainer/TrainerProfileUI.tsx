import React from 'react';
import { 
  View, Text, StyleSheet, ScrollView, 
  TouchableOpacity, ActivityIndicator, ImageBackground,
  FlatList, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Trainer } from '@/app/types/trainer';

type TrainerProfileUIProps = {
  trainer: Trainer | null;
  loading: boolean;
  error: string | null;
  isCurrentUserProfile: boolean;
  becomingTrainer?: boolean;
  onBecomeTrainer: () => void;
  onEditProfile: () => void;
  onAddWorkout: () => void;
  onGoBack: () => void;
  onRetry: () => void;
  onViewWorkout: (workoutId: string) => void;
  onViewAllReviews: () => void;
};

export default function TrainerProfileUI({
  trainer,
  loading,
  error,
  isCurrentUserProfile,
  becomingTrainer = false,
  onBecomeTrainer,
  onEditProfile,
  onAddWorkout,
  onGoBack,
  onRetry,
  onViewWorkout,
  onViewAllReviews
}: TrainerProfileUIProps) {
  
  // Render content for non-trainers who want to become trainers
  const renderBecomeTrainerSection = () => {
    return (
      <View style={styles.becomeTrainerContainer}>
        <Ionicons name="fitness" size={60} color="#4a90e2" />
        <Text style={styles.becomeTrainerTitle}>Become a Trainer</Text>
        <Text style={styles.becomeTrainerText}>
          Share your fitness expertise with others by becoming a trainer.
          You'll be able to create workouts, get reviews, and build your client base.
        </Text>
        
        <TouchableOpacity 
          style={styles.becomeTrainerButton}
          onPress={onBecomeTrainer}
          disabled={becomingTrainer}
        >
          {becomingTrainer ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="arrow-forward-circle" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Start Your Trainer Journey</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  // Render content based on loading, error status
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text style={styles.loadingText}>Loading trainer profile...</Text>
        </View>
      );
    }
    
    if (error) {
      // If this is the current user and they're not a trainer yet
      if (isCurrentUserProfile && !trainer) {
        return renderBecomeTrainerSection();
      }

      // Otherwise show the error
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle" size={60} color="#ff6b6b" />
          <Text style={styles.errorText}>Oops!</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!trainer) {
      // For the current user who hasn't set up their trainer profile yet
      if (isCurrentUserProfile) {
        return renderBecomeTrainerSection();
      }
      
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="person-outline" size={60} color="#ff6b6b" />
          <Text style={styles.errorText}>No trainer profile found.</Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={onGoBack}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!trainer && isCurrentUserProfile) {
      return (
        <View style={styles.becomeTrainerContainer}>
          <Ionicons name="fitness" size={60} color="#4a90e2" />
          <Text style={styles.becomeTrainerTitle}>Become a Trainer</Text>
          <Text style={styles.becomeTrainerText}>
            Share your fitness expertise with others by becoming a trainer.
            You'll be able to create workouts, get reviews, and build your client base.
          </Text>
          <TouchableOpacity 
            style={styles.becomeTrainerButton}
            onPress={onBecomeTrainer}
            disabled={becomingTrainer}
          >
            {becomingTrainer ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="arrow-forward-circle" size={20} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Start Your Trainer Journey</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      );
    }

    const userName = typeof trainer.userId === 'object' ? (trainer.userId as any).name : 'Trainer';
    const profileImage = typeof trainer.userId === 'object' ? (trainer.userId as any).profileImageUrl : null;
    
    return (
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>Trainer Profile</Text>
        
        <View style={styles.profileHeader}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Ionicons name="person" size={40} color="#DDDDDD" />
            </View>
          )}
          <View style={styles.profileInfo}>
            <Text style={styles.trainerName}>{userName}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>{trainer.averageRating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>({trainer.reviews.length} reviews)</Text>
            </View>
            <Text style={styles.experience}>{trainer.yearsOfExperience} years experience</Text>
          </View>
        </View>

        {isCurrentUserProfile && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={onEditProfile}
            >
              <Ionicons name="create-outline" size={18} color="white" />
              <Text style={styles.actionButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.addButton]}
              onPress={onAddWorkout}
            >
              <Ionicons name="add-circle-outline" size={18} color="white" />
              <Text style={styles.actionButtonText}>Add Workout</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Bio</Text>
          <View style={styles.bioContainer}>
            <Text style={styles.bioText}>{trainer.bio}</Text>
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Specializations</Text>
          <View style={styles.tagsContainer}>
            {trainer.specializations.map((specialization, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{specialization}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {trainer.certifications && trainer.certifications.length > 0 && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Certifications</Text>
            {trainer.certifications.map((cert, index) => (
              <View key={index} style={styles.certItem}>
                <Text style={styles.certName}>{cert.name}</Text>
                <Text style={styles.certDetails}>
                  {cert.type} • Issued: {new Date(cert.issueDate).toLocaleDateString()}
                </Text>
                {cert.expiryDate && (
                  <Text style={styles.certExpiry}>
                    Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
        
        {trainer.workouts && trainer.workouts.length > 0 && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Workouts</Text>
            <FlatList
              data={trainer.workouts}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.workoutCard}
                  onPress={() => onViewWorkout(item.toString())}
                >
                  <View style={styles.workoutImageContainer}>
                    <Ionicons name="fitness" size={24} color="#fff" />
                  </View>
                  <Text style={styles.workoutName}>{(item as any).name || 'Workout'}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
        
        {trainer.reviews && trainer.reviews.length > 0 && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Reviews</Text>
            {trainer.reviews.slice(0, 3).map((review, index) => (
              <View key={index} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <View style={styles.ratingStars}>
                    {[...Array(5)].map((_, i) => (
                      <Ionicons 
                        key={i} 
                        name="star" 
                        size={14} 
                        color={i < review.rating ? "#FFD700" : "#444"} 
                      />
                    ))}
                  </View>
                  <Text style={styles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                {review.comment && (
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                )}
              </View>
            ))}
            
            {trainer.reviews.length > 3 && onViewAllReviews && (
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={onViewAllReviews}
              >
                <Text style={styles.viewAllText}>View all {trainer.reviews.length} reviews</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        
        <View style={styles.spacer} />
      </ScrollView>
    );
  };

  return (
    <ImageBackground 
      source={{uri:'https://i.pinimg.com/736x/86/da/d0/86dad02018fc7eaeb628c94b5705fef3.jpg'}}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        {renderContent()}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // Background & Container Styles
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  // Typography
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#DDDDDD',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  
  // Profile Header
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#333',
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  trainerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    marginLeft: 4,
    color: 'white',
    fontWeight: 'bold',
  },
  reviewCount: {
    marginLeft: 4,
    color: '#BBBBBB',
  },
  experience: {
    marginTop: 4,
    color: '#DDDDDD',
  },
  
  // Action Buttons
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 5,
    flex: 1,
  },
  editButton: {
    backgroundColor: 'rgba(33, 150, 243, 0.9)',
    marginRight: 8,
  },
  addButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    marginLeft: 8,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  
  // Form Elements
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#DDDDDD',
  },
  bioContainer: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 5,
    padding: 12,
    backgroundColor: 'rgba(34, 34, 34, 0.9)',
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    color: 'white',
  },
  
  // Tags/Specializations
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: 'rgba(33, 150, 243, 0.3)',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.5)',
  },
  tagText: {
    color: 'white',
    fontSize: 14,
  },
  
  // Certifications
  certItem: {
    backgroundColor: 'rgba(34, 34, 34, 0.9)',
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  certName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  certDetails: {
    fontSize: 14,
    color: '#BBBBBB',
    marginBottom: 2,
  },
  certExpiry: {
    fontSize: 14,
    color: '#ff6b6b',
  },
  
  // Workouts
  workoutCard: {
    width: 150,
    backgroundColor: 'rgba(34, 34, 34, 0.9)',
    borderRadius: 8,
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  workoutImageContainer: {
    height: 80,
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutName: {
    padding: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  
  // Reviews
  reviewItem: {
    backgroundColor: 'rgba(34, 34, 34, 0.9)',
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  ratingStars: {
    flexDirection: 'row',
  },
  reviewDate: {
    fontSize: 12,
    color: '#BBBBBB',
  },
  reviewComment: {
    fontSize: 14,
    color: 'white',
  },
  viewAllButton: {
    padding: 12,
    backgroundColor: 'rgba(34, 34, 34, 0.9)',
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  viewAllText: {
    color: '#4a90e2',
    fontWeight: 'bold',
  },
  
  // Buttons
  button: {
    backgroundColor: 'rgba(33, 150, 243, 0.9)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.5)',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  
  // Spacing
  spacer: {
    height: 40,
  },

  // Become Trainer Section
  becomeTrainerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  becomeTrainerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 15,
    marginBottom: 10,
  },
  becomeTrainerText: {
    fontSize: 16,
    color: '#DDDDDD',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  becomeTrainerButton: {
    flexDirection: 'row',
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  retryButton: {
    backgroundColor: 'rgba(33, 150, 243, 0.9)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.5)',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  errorMessage: {
    color: '#ff6b6b',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});