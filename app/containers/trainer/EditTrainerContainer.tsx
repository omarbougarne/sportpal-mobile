import React, { useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { UserContext } from '@/app/context/UserContext'; 
import { becomeTrainer, getTrainerById, updateTrainer, getTrainerByUserId } from '@/app/services/api/trainerApi';
import EditTrainerUI from '@/app/components/trainer/EditTrainerUI';
import { SpecializationType, CertificationType, Certification } from '@/app/types/trainer';

interface TrainerEditContainerProps {
  id?: string;
  isNew?: boolean;
  isSelfEdit?: boolean;
}

export default function EditTrainerContainer({ 
  id = '', 
  isNew = false, 
  isSelfEdit = false 
}: TrainerEditContainerProps) {
  const router = useRouter();
  const { user, refreshUserData } = useContext(UserContext);
  
  // State declarations - keep your existing state variables here
  const [name, setName] = useState('');
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
  const [trainerProfileId, setTrainerProfileId] = useState<string | null>(null);
  
  useEffect(() => {
    if (isNew) {
      // For new trainers, just set authorized to true and don't load any data
      setIsAuthorized(true);
    } else if (isSelfEdit) {
      // For self-editing, load the current user's trainer profile
      loadCurrentUserTrainerProfile();
    } else if (id) {
      // For existing trainers being edited by ID
      loadTrainerData();
    }
  }, [id, isNew, isSelfEdit, user]);
  
  // New function to load current user's trainer profile
  const loadCurrentUserTrainerProfile = async () => {
    if (!user || !user._id) {
      setError('You must be logged in to edit your trainer profile');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const trainerData = await getTrainerByUserId(user._id);
      
      if (!trainerData) {
        setError('You do not have a trainer profile yet');
        setIsAuthorized(false);
        return;
      }
      
      // Store the trainer profile ID for updates
      setTrainerProfileId(trainerData._id);
      setIsAuthorized(true);
      
      // Set form fields
      setName(typeof trainerData.userId === 'object' ? trainerData.userId.name || '' : '');
      setBio(trainerData.bio || '');
      setYearsOfExperience(trainerData.yearsOfExperience?.toString() || '');
      setHourlyRate(trainerData.hourlyRate?.toString() || '');
      setSelectedSpecializations(trainerData.specializations || []);
      setCertifications(trainerData.certifications || []);
      
    } catch (err: any) {
      console.error('Error loading trainer data:', err);
      setError(err.message || 'Failed to load your trainer profile');
    } finally {
      setLoading(false);
    }
  };
  
  // Keep your existing loadTrainerData function here
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
  
  // Update your handleSubmit function to handle self-editing
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
        name, // Include name in the data
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
      } else if (isSelfEdit && trainerProfileId) {
        // For self-editing, use the loaded trainer profile ID
        await updateTrainer(trainerProfileId, trainerData);
      } else if (id) {
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

  const handleEditProfile = () => {
    if (isOwnProfile) {
      router.push('/trainer/edit'); 
    } else if (isAdmin && trainer?._id) {
      router.push(`/trainer/${trainer._id}/edit`);
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
      name={name}
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
      onNameChange={setName}
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
      onRetry={isNew ? () => setError(null) : isSelfEdit ? loadCurrentUserTrainerProfile : loadTrainerData}
    />
  );
}