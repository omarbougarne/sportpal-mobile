import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { getTrainerById } from '@/app/services/api/trainerApi';
import { Trainer } from '@/app/types/trainer';
import TrainerDetailUI from '@/app/components/trainer/TrainerDetailUI';

interface TrainerDetailContainerProps {
  id: string;
}

export default function TrainerDetailContainer({ id }: TrainerDetailContainerProps) {
  const router = useRouter();
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <TrainerDetailUI
      trainer={trainer}
      loading={loading}
      error={error}
      onHire={onHireTrainer}
      onRetry={loadTrainerData}
    />
  );
}