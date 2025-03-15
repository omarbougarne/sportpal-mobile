import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
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
      
      const trainersData = await getTrainers({});
      setTrainers(trainersData);
    } catch (err: any) {
      console.error('Failed to load trainers:', err);
      setError(err.message || 'Failed to load trainers');
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewTrainerProfile = (trainerId: string) => {
    router.push(`./trainer/${trainerId}`);
  };
  
  const handleHireTrainer = (trainerId: string) => {
    router.push({
      pathname: '/booking/new',
      params: { trainerId }
    });
  };
  
  const filteredTrainers = searchQuery
    ? trainers.filter(trainer => {
        const query = searchQuery.toLowerCase();
        // Filter by name if userId is an object with name property
        const name = typeof trainer.userId === 'object' && trainer.userId?.name 
          ? trainer.userId.name.toLowerCase() 
          : '';
        // Filter by bio or specializations
        return (
          name.includes(query) ||
          trainer.bio.toLowerCase().includes(query) ||
          trainer.specializations.some(spec => spec.toLowerCase().includes(query))
        );
      })
    : trainers;
  
  return (
    <TrainersListUI
      trainers={filteredTrainers}
      loading={loading}
      error={error}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onViewProfile={handleViewTrainerProfile}
      onHireTrainer={handleHireTrainer}
      onRetry={loadTrainers}
    />
  );
}