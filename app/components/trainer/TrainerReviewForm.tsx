import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TrainerReviewFormProps {
  onSubmit: (review: { rating: number; comment: string }) => Promise<void>;
  onCancel: () => void;
}

export default function TrainerReviewForm({ onSubmit, onCancel }: TrainerReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating < 1 || rating > 5) {
      Alert.alert('Invalid Rating', 'Please select a rating between 1 and 5 stars');
      return;
    }

    if (comment.trim().length < 10) {
      Alert.alert('Review Too Short', 'Please provide a more detailed comment (at least 10 characters)');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({ rating, comment });
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit your review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Write a Review</Text>
      
      <View style={styles.ratingContainer}>
        <Text style={styles.label}>Rating:</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Ionicons
                name={star <= rating ? "star" : "star-outline"}
                size={32}
                color={star <= rating ? "#FFD700" : "#ccc"}
                style={styles.star}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <Text style={styles.label}>Your Review:</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        placeholder="Share your experience with this trainer..."
        value={comment}
        onChangeText={setComment}
      />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
          disabled={submitting}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.submitButton, submitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  ratingContainer: {
    marginBottom: 15,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  star: {
    marginHorizontal: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#4a90e2',
  },
  cancelButton: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});