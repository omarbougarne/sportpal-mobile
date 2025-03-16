import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { getTrainers } from '@/app/services/api/trainerApi';
import TrainersListUI from '@/app/components/trainer/TrainerListUI';
import { Trainer } from '@/app/types/trainer';

export default function TrainersListContainer() {
  const router = useRouter();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    loadTrainers();
  }, []);
  
  const loadTrainers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getTrainers({});
      
      // Ensure we're handling the response correctly
      if (response && Array.isArray(response)) {
        setTrainers(response);
      } else {
        console.error('Invalid trainers data format:', response);
        setTrainers([]);
        setError('Failed to load trainers. Received invalid data format.');
      }
    } catch (err: any) {
      console.error('Failed to load trainers:', err);
      setError(err.message || 'Failed to load trainers');
      setTrainers([]); // Make sure trainers is always an array
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewTrainerProfile = (trainerId: string) => {
  console.log('Attempting to navigate to:', `/trainer/${trainerId}`);
  
  // Try different navigation approaches to see which one works
  try {
    // Approach 1: Standard path
    router.push(`/trainer/${trainerId}`);
    
    // If that doesn't work, try these alternatives:
    // Approach 2: With params object
    // router.push({
    //   pathname: '/trainer/[id]',
    //   params: { id: trainerId }
    // });
    
    // Approach 3: Simplified path
    // router.push('/trainer/' + trainerId);
  } catch (err) {
    console.error('Navigation error:', err);
  }
};
  
 // In TrainersListContainer.tsx
const onHireTrainer = (trainerId: string) => {
  console.log('Navigating to hire trainer with ID:', trainerId);
  router.push({
    pathname: '/booking/new',
    params: { trainerId }
  });
};

  // Safe filtering function - ensure trainers is an array before filtering
  const getFilteredTrainers = () => {
    if (!Array.isArray(trainers)) {
      console.warn('Trainers is not an array:', trainers);
      return [];
    }
    
    if (!searchQuery) {
      return trainers;
    }
    
    const query = searchQuery.toLowerCase();
    return trainers.filter(trainer => {
      if (!trainer) return false;
      
      // Handle name filtering safely
      const name = typeof trainer.userId === 'object' && trainer.userId?.name 
        ? trainer.userId.name.toLowerCase() 
        : '';
      
      // Handle bio filtering safely
      const bio = trainer.bio ? trainer.bio.toLowerCase() : '';
      
      // Handle specializations filtering safely
      const hasMatchingSpecialization = Array.isArray(trainer.specializations) && 
        trainer.specializations.some(spec => 
          spec && spec.toLowerCase().includes(query)
        );
      
      return name.includes(query) || bio.includes(query) || hasMatchingSpecialization;
    });
  };
  
  // Get filtered trainers safely
  const filteredTrainers = getFilteredTrainers();
  
  return (
    <TrainersListUI
      trainers={filteredTrainers}
      loading={loading}
      error={error}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onViewProfile={handleViewTrainerProfile}
      onHireTrainer={onHireTrainer}
      onRetry={loadTrainers}
    />
  );
}