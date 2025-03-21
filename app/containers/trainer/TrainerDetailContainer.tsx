import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { getTrainerById, addTrainerReview } from '@/app/services/api/trainerApi';
import { Trainer } from '@/app/types/trainer';
import TrainerDetailUI from '@/app/components/trainer/TrainerDetailUI';
import { useAuth } from '@/app/hooks/useAuth';

interface TrainerDetailContainerProps {
  id: string;
}

export default function TrainerDetailContainer({ id }: TrainerDetailContainerProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    loadTrainerData();
  }, [id]);

  const loadTrainerData = async () => {
    if (!id) {
      setError('Invalid trainer ID');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching trainer with ID:', id);
      const data = await getTrainerById(id);
      console.log('Trainer data received:', data);
      setTrainer(data);
    } catch (err: any) {
      console.error('Failed to load trainer details:', err);
      setError(err.message || 'Failed to load trainer details');
    } finally {
      setLoading(false);
    }
  };

  const onHireTrainer = (trainerId: string) => {
    console.log('Navigating to hire trainer with ID:', trainerId);
    router.push({
      pathname: '/booking/new',
      params: { trainerId }
    });
  };
  
  // Review handling functions
  const handleAddReview = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'You need to be logged in to leave a review',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Log In', onPress: () => router.push('/') }
        ]
      );
      return;
    }
    
    setShowReviewForm(true);
  };

  const handleSubmitReview = async (review: { rating: number; comment: string }) => {
    try {
      await addTrainerReview(id, review);
      setShowReviewForm(false);
      Alert.alert('Success', 'Your review has been submitted!');
      
      // Refresh trainer data to show the new review
      await loadTrainerData();
    } catch (err) {
      console.error('Error submitting review:', err);
      Alert.alert('Error', 'Failed to submit your review. Please try again.');
    }
  };

  const handleCancelReview = () => {
    setShowReviewForm(false);
  };

  const hasUserReviewed = () => {
    if (!user || !trainer?.reviews) return false;
    
    return trainer.reviews.some(review => {
      if (typeof review.userId === 'object') {
        return review.userId._id === user._id;
      }
      return review.userId === user._id;
    });
  };

  return (
    <TrainerDetailUI
      trainer={trainer}
      loading={loading}
      error={error}
      onHire={() => trainer && onHireTrainer(trainer._id)}
      onRetry={loadTrainerData}
      onAddReview={handleAddReview}
      onSubmitReview={handleSubmitReview}
      onCancelReview={handleCancelReview}
      showReviewForm={showReviewForm}
      userHasReviewed={hasUserReviewed()}
    />
  );
}