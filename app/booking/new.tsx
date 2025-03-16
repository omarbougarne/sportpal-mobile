import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getTrainers, getTrainerById } from '@/app/services/api/trainerApi';
import TrainerCardUI from '@/app/components/trainer/TrainerCardUI';
import TrainersListUI from '@/app/components/trainer/TrainerListUI';
import { Trainer } from '@/app/types/trainer';

export default function BookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialTrainerId = params.trainerId as string;
  
  const [step, setStep] = useState<'select-trainer' | 'select-time' | 'confirm'>(
    initialTrainerId ? 'select-time' : 'select-trainer'
  );
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    if (initialTrainerId) {
      loadSelectedTrainer();
    } else {
      loadTrainers();
    }
  }, [initialTrainerId]);
  
  const loadSelectedTrainer = async () => {
    try {
      setLoading(true);
      const trainer = await getTrainerById(initialTrainerId);
      setSelectedTrainer(trainer);
    } catch (err: any) {
      console.error('Failed to load trainer:', err);
      setError(err.message || 'Failed to load trainer');
      setStep('select-trainer');
      loadTrainers();
    } finally {
      setLoading(false);
    }
  };
  
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
  
  const handleSelectTrainer = (trainerId: string) => {
    const trainer = trainers.find(t => t._id === trainerId);
    if (trainer) {
      setSelectedTrainer(trainer);
      setStep('select-time');
    }
  };
  
  const handleViewProfile = (trainerId: string) => {
    router.push(`/trainer/${trainerId}`);
  };
  
  const renderContent = () => {
    switch (step) {
      case 'select-trainer':
        return (
          <TrainersListUI
            trainers={searchQuery ? filterTrainers() : trainers}
            loading={loading}
            error={error}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onViewProfile={handleViewProfile}
            onHireTrainer={handleSelectTrainer}
            onRetry={loadTrainers}
          />
        );
      
      case 'select-time':
        if (!selectedTrainer) {
          setStep('select-trainer');
          return null;
        }
        
        return (
          <View style={styles.stepContainer}>
            <View style={styles.selectedTrainerCard}>
              <TrainerCardUI
                trainer={selectedTrainer}
                onViewProfile={() => handleViewProfile(selectedTrainer._id!)}
                onHire={() => {}} // Disabled since we're already in the booking flow
              />
            </View>
            
            <Text style={styles.stepTitle}>Choose Date & Time</Text>
            <Text style={styles.comingSoon}>
              The scheduling functionality is coming soon.
            </Text>
            
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={() => setStep('confirm')}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setStep('select-trainer')}
            >
              <Text style={styles.backButtonText}>Back to Trainer Selection</Text>
            </TouchableOpacity>
          </View>
        );
      
      case 'confirm':
        return (
          <View style={styles.stepContainer}>
            <Ionicons name="checkmark-circle" size={80} color="#4CAF50" style={styles.confirmIcon} />
            <Text style={styles.confirmTitle}>Booking Confirmation</Text>
            <Text style={styles.confirmText}>
              This booking feature is under construction.
              {'\n\n'}
              When complete, you'll be able to:
              {'\n'}
              • Select your desired trainer
              {'\n'}
              • Choose available time slots
              {'\n'}
              • Make payments and confirm bookings
            </Text>
            
            <TouchableOpacity 
              style={styles.doneButton}
              onPress={() => router.replace('/(tabs)')}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };
  
  const filterTrainers = () => {
    const query = searchQuery.toLowerCase();
    
    return trainers.filter(trainer => {
      // Get trainer name if userId is an object
      const name = typeof trainer.userId === 'object' && trainer.userId?.name 
        ? trainer.userId.name.toLowerCase() 
        : '';
        
      // Search in bio
      const bio = trainer.bio ? trainer.bio.toLowerCase() : '';
      
      // Search in specializations
      const hasSpecialization = trainer.specializations?.some(
        spec => spec.toLowerCase().includes(query)
      );
      
      return name.includes(query) || bio.includes(query) || hasSpecialization;
    });
  };
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: step === 'select-trainer' 
            ? "Select a Trainer" 
            : step === 'select-time'
              ? "Schedule Session"
              : "Booking Confirmation",
          headerBackTitle: "Cancel"
        }} 
      />
      {renderContent()}
    </>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  selectedTrainerCard: {
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  comingSoon: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  continueButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  continueButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  backButtonText: {
    color: '#555',
    fontSize: 16,
  },
  confirmIcon: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  confirmTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  confirmText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#555',
    marginBottom: 40,
  },
  doneButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});