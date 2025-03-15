import React, { useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/app/context/AuthContext';
import { becomeTrainer, getTrainerById, updateTrainer } from '@/app/services/api/trainerApi';
import EditTrainerUI from '@/app/components/trainer/EditTrainerUI';
import { SpecializationType, CertificationType, Certification } from '@/app/types/trainer';

interface TrainerEditContainerProps {
  id: string;
  isNew?: boolean;
}

export default function EditTrainerContainer({ id, isNew = false }: TrainerEditContainerProps) {
  const router = useRouter();
  const { user, refreshUserData } = useContext(AuthContext);
  
  // State declarations
  const [bio, setBio] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [selectedSpecializations, setSelectedSpecializations] = useState<SpecializationType[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  
  const [showSpecializationsDropdown, setShowSpecializationsDropdown] = useState(false);
  const [showCertificationTypeDropdown, setShowCertificationTypeDropdown] = useState(false);
  const [selectedCertType, setSelectedCertType] = useState<CertificationType>(CertificationType.Personal);
  const [currentCertName, setCurrentCertName] = useState('');
  const [currentCertIssueDate, setCurrentCertIssueDate] = useState<Date>(new Date());
  const [currentCertExpiryDate, setCurrentCertExpiryDate] = useState<Date | undefined>(undefined);
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useEffect(() => {
    if (isNew) {
      // For new trainers, just set authorized to true and don't load any data
      setIsAuthorized(true);
    } else {
      // For existing trainers, load their data
      loadTrainerData();
    }
  }, [id, isNew, user]);
  
  const loadTrainerData = async () => {
    if (!id) {
      setError('Invalid trainer ID');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const trainerData = await getTrainerById(id);
      
      // Check if the current user is authorized to edit
      if (user && trainerData.userId) {
        const trainerId = typeof trainerData.userId === 'object' 
          ? trainerData.userId._id 
          : trainerData.userId;
        setIsAuthorized(user._id === trainerId);
      } else {
        setIsAuthorized(false);
      }
      
      // Set form fields
      setBio(trainerData.bio || '');
      setYearsOfExperience(trainerData.yearsOfExperience?.toString() || '');
      setHourlyRate(trainerData.hourlyRate?.toString() || '');
      setSelectedSpecializations(trainerData.specializations || []);
      setCertifications(trainerData.certifications || []);
      
    } catch (err: any) {
      console.error('Error loading trainer data:', err);
      setError(err.message || 'Failed to load trainer data');
    } finally {
      setLoading(false);
    }
  };
  
  const validateForm = () => {
    if (!bio.trim()) {
      setError('Please provide a bio.');
      return false;
    }
    
    if (!yearsOfExperience || isNaN(parseInt(yearsOfExperience)) || parseInt(yearsOfExperience) < 0) {
      setError('Please provide a valid number for years of experience.');
      return false;
    }
    
    if (selectedSpecializations.length === 0) {
      setError('Please select at least one specialization.');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async () => {
    try {
      setError(null);
      
      if (!validateForm()) return;
      if (!user || !user._id) {
        setError('User information is missing. Please log in again.');
        return;
      }
      
      setSaving(true);
      
      const trainerData = {
        bio,
        yearsOfExperience: parseInt(yearsOfExperience),
        specializations: selectedSpecializations,
        certifications: certifications.length > 0 ? certifications : undefined
      };
      
      if (hourlyRate) {
        trainerData.hourlyRate = parseInt(hourlyRate);
      }
      
      if (isNew) {
        // For new trainers, call the becomeTrainer endpoint
        await becomeTrainer(user._id, trainerData);
        
        // Refresh user data to get updated role
        if (refreshUserData) {
          await refreshUserData();
        }
      } else {
        // For existing trainers, update their profile
        await updateTrainer(id, trainerData);
      }
      
      // Success - navigate back to profile
      router.replace('/(tabs)/trainer');
      Alert.alert(
        'Success', 
        isNew ? 'Congratulations! You are now a trainer!' : 'Your trainer profile has been updated!'
      );
    } catch (err: any) {
      console.error('Error updating trainer profile:', err);
      setError(err.message || 'Failed to update trainer profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  function handleToggleSpecialization(specialization: SpecializationType): void {
    setSelectedSpecializations(prev => {
      if (prev.includes(specialization)) {
        return prev.filter(spec => spec !== specialization);
      } else {
        return [...prev, specialization];
      }
    });
  }

  function handleCertTypeSelect(type: CertificationType): void {
    setSelectedCertType(type);
    setShowCertificationTypeDropdown(false);
  }

  function handleAddCertification(): void {
    if (!currentCertName.trim()) {
      setError('Please enter a certification name');
      return;
    }
    
    const newCert: Certification = {
      name: currentCertName,
      type: selectedCertType,
      issueDate: currentCertIssueDate,
      expiryDate: currentCertExpiryDate
    };
    
    setCertifications(prev => [...prev, newCert]);
    
    // Reset form
    setCurrentCertName('');
    setCurrentCertIssueDate(new Date());
    setCurrentCertExpiryDate(undefined);
  }

  function handleRemoveCertification(index: number): void {
    setCertifications(prev => prev.filter((_, i) => i !== index));
  }

  function handleToggleSpecializationsDropdown(): void {
    setShowSpecializationsDropdown(prev => !prev);
  }

  function handleToggleCertificationTypeDropdown(): void {
    setShowCertificationTypeDropdown(prev => !prev);
  }

  return (
    <EditTrainerUI
      bio={bio}
      yearsOfExperience={yearsOfExperience}
      hourlyRate={hourlyRate}
      selectedSpecializations={selectedSpecializations}
      certifications={certifications}
      showSpecializationsDropdown={showSpecializationsDropdown}
      showCertificationTypeDropdown={showCertificationTypeDropdown}
      selectedCertType={selectedCertType}
      currentCertName={currentCertName}
      currentCertIssueDate={currentCertIssueDate}
      currentCertExpiryDate={currentCertExpiryDate}
      loading={loading}
      saving={saving}
      error={error}
      isAuthorized={isAuthorized}
      onBioChange={setBio}
      onYearsOfExperienceChange={setYearsOfExperience}
      onHourlyRateChange={setHourlyRate}
      onToggleSpecialization={handleToggleSpecialization}
      onToggleSpecializationsDropdown={handleToggleSpecializationsDropdown}
      onToggleCertificationTypeDropdown={handleToggleCertificationTypeDropdown}
      onCertTypeSelect={handleCertTypeSelect}
      onCertNameChange={setCurrentCertName}
      onCertIssueDateChange={setCurrentCertIssueDate}
      onCertExpiryDateChange={setCurrentCertExpiryDate}
      onAddCertification={handleAddCertification}
      onRemoveCertification={handleRemoveCertification}
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
      onRetry={isNew ? () => setError(null) : loadTrainerData}
    />
  );
}