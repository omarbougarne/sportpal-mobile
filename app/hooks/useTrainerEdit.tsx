import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth'; // Your existing auth hook
import { 
  getTrainerById, 
  getTrainerByUserId, 
  createOrUpdateTrainerProfile, 
  becomeTrainer 
} from '@/app/services/api/trainerApi';
import { SpecializationType, CertificationType, Certification } from '@/app/types/trainer';

export function useTrainerEdit(options: {
  id?: string;
  isNew?: boolean;
  isSelfEdit?: boolean;
}) {
  const { id = '', isNew = false, isSelfEdit = false } = options;
  const { user } = useAuth(); // Your existing auth hook
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    yearsOfExperience: '',
    hourlyRate: '',
    selectedSpecializations: [] as SpecializationType[],
    certifications: [] as Certification[]
  });
  
  // UI state
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (isNew) {
      // For new trainers, we just set default empty values and authorize them
      setFormData({
        name: user?.name || '',
        bio: '',
        yearsOfExperience: '',
        hourlyRate: '',
        selectedSpecializations: [],
        certifications: []
      });
      setIsAuthorized(true);
      setLoading(false);
    } else if (isSelfEdit) {
      loadSelfTrainerProfile();
    } else if (id) {
      loadTrainerProfile();
    }
  }, [id, isNew, isSelfEdit]);
  
  const loadSelfTrainerProfile = async () => {
    if (!user?._id) {
      setError('Authentication required');
      setLoading(false);
      setIsAuthorized(false);
      return;
    }
    
    try {
      setLoading(true);
      const trainerData = await getTrainerByUserId(user._id);
      
      setFormData({
        name: user.name || '',
        bio: trainerData.bio || '',
        yearsOfExperience: trainerData.yearsOfExperience?.toString() || '',
        hourlyRate: trainerData.hourlyRate?.toString() || '',
        selectedSpecializations: trainerData.specializations || [],
        certifications: trainerData.certifications || []
      });
      
      setIsAuthorized(true);
    } catch (err: any) {
      console.error('Failed to load trainer profile:', err);
      
      // Special case: User has trainer role but no profile yet
      if (user?.role === 'Trainer') {
        // Still set authorized to true so they can create their profile
        setIsAuthorized(true);
        
        // Set empty form data for new trainer profile
        setFormData({
          name: user.name || '',
          bio: '',
          yearsOfExperience: '',
          hourlyRate: '',
          selectedSpecializations: [],
          certifications: []
        });
      } else {
        setError(err?.message || 'Failed to load trainer profile');
        setIsAuthorized(false);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const loadTrainerProfile = async () => {
    try {
      setLoading(true);
      const trainerData = await getTrainerById(id);
      
      // Check authorization
      if (user?._id) {
        const userId = typeof trainerData.userId === 'object' 
          ? trainerData.userId._id 
          : trainerData.userId;
        setIsAuthorized(user._id === userId);
      }
      
      setFormData({
        name: typeof trainerData.userId === 'object' ? trainerData.userId.name || '' : '',
        bio: trainerData.bio || '',
        yearsOfExperience: trainerData.yearsOfExperience?.toString() || '',
        hourlyRate: trainerData.hourlyRate?.toString() || '',
        selectedSpecializations: trainerData.specializations || [],
        certifications: trainerData.certifications || []
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to load trainer profile');
    } finally {
      setLoading(false);
    }
  };
  
  const updateFormField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const validateForm = () => {
    if (!formData.bio.trim()) {
      setError('Please provide a bio');
      return false;
    }
    
    if (!formData.yearsOfExperience || isNaN(parseInt(formData.yearsOfExperience))) {
      setError('Please provide valid years of experience');
      return false;
    }
    
    if (formData.selectedSpecializations.length === 0) {
      setError('Please select at least one specialization');
      return false;
    }
    
    return true;
  };
  
  const saveTrainerProfile = async () => {
    if (!validateForm()) return false;
    if (!user?._id) {
      setError('Authentication required');
      return false;
    }
    
    try {
      setSaving(true);
      
      const trainerData = {
        bio: formData.bio,
        yearsOfExperience: parseInt(formData.yearsOfExperience),
        hourlyRate: formData.hourlyRate ? parseInt(formData.hourlyRate) : undefined,
        specializations: formData.selectedSpecializations,
        certifications: formData.certifications
      };
      
      // Replace the conditional logic with the new unified function
      await createOrUpdateTrainerProfile(user._id, trainerData);
      
      return true;
    } catch (err: any) {
      setError(err?.message || 'Failed to save trainer profile');
      return false;
    } finally {
      setSaving(false);
    }
  };
  
  return {
    formData,
    updateFormField,
    loading,
    saving,
    error,
    isAuthorized,
    saveTrainerProfile,
    retryLoading: isNew ? () => {} : isSelfEdit ? loadSelfTrainerProfile : loadTrainerProfile
  };
}