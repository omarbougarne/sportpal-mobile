import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Trainer, Review } from '@/app/types/trainer';
import { Contract, ContractStatus } from '@/app/types/contract';
import { getTrainerByUserId, getTrainerReviews, addTrainerReview, getTrainerById } from '@/app/services/api/trainerApi';
import { getTrainerContracts, updateContractStatus } from '@/app/services/api/contractApi';
import { AuthContext } from './AuthContext';

interface ReviewFormData {
  rating: number;
  comment: string;
}

interface TrainerContextType {
  trainerProfile: Trainer | null;
  contracts: Contract[];
  loading: boolean;
  error: string | null;
  loadTrainerProfile: (trainerId?: string) => Promise<void>;
  loadTrainerContracts: () => Promise<void>;
  updateContract: (contractId: string, status: ContractStatus) => Promise<void>;
  hasActiveContracts: boolean;
  pendingContractsCount: number;
  submitReview: (trainerId: string, reviewData: ReviewFormData) => Promise<any>;
  fetchTrainerReviews: (trainerId: string) => Promise<Review[]>;
  reviewSubmitting: boolean;
  reviewError: string | null;
  hasUserReviewedTrainer: (trainerId: string) => boolean;
}

interface TrainerProviderProps {
  children: ReactNode;
}

const defaultContext: TrainerContextType = {
  trainerProfile: null,
  contracts: [],
  loading: false,
  error: null,
  loadTrainerProfile: async () => {},
  loadTrainerContracts: async () => {},
  updateContract: async () => {},
  hasActiveContracts: false,
  pendingContractsCount: 0,
  submitReview: async () => {},
  fetchTrainerReviews: async () => [],
  reviewSubmitting: false,
  reviewError: null,
  hasUserReviewedTrainer: () => false
};

export const TrainerContext = createContext<TrainerContextType>(defaultContext);

export const TrainerProvider: React.FC<TrainerProviderProps> = ({ children }) => {
  const { user, isAuthenticated, isTrainer } = useContext(AuthContext);
  const [trainerProfile, setTrainerProfile] = useState<Trainer | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewSubmitting, setReviewSubmitting] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [userReviews, setUserReviews] = useState<{[trainerId: string]: Review}>({});

  useEffect(() => {
    // Only load trainer profile if user is a trainer
    if (isTrainer && user?._id) {
      loadTrainerProfile();
    }
    
    // Only load contracts if authenticated and is trainer
    if (isAuthenticated && isTrainer) {
      loadTrainerContracts();
    }
  }, [isAuthenticated, isTrainer, user?._id]);

  // Enhanced to work with or without authentication
  const loadTrainerProfile = async (trainerId?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // If user is a trainer and no trainerId is provided, load their profile
      if (isTrainer && user?._id && !trainerId) {
        const trainer = await getTrainerByUserId(user._id);
        setTrainerProfile(trainer);
      } 
      // If trainerId is provided, load that trainer regardless of auth
      else if (trainerId) {
        const trainer = await getTrainerById(trainerId);
        setTrainerProfile(trainer);
      }
    } catch (err: any) {
      console.error('Failed to load trainer profile:', err);
      setError(err?.message || 'Failed to load trainer profile');
    } finally {
      setLoading(false);
    }
  };

  const loadTrainerContracts = async () => {
    if (!user?._id || !isTrainer) return;
    
    try {
      setLoading(true);
      setError(null);
      const trainerContracts = await getTrainerContracts();
      setContracts(trainerContracts);
    } catch (err: any) {
      console.error('Failed to load trainer contracts:', err);
      setError(err?.message || 'Failed to load trainer contracts');
    } finally {
      setLoading(false);
    }
  };

  const updateContract = async (contractId: string, status: ContractStatus) => {
    try {
      setLoading(true);
      setError(null);
      
      await updateContractStatus(contractId, { status });
      
      // Refresh contracts after update
      await loadTrainerContracts();
    } catch (err: any) {
      console.error('Failed to update contract status:', err);
      setError(err?.message || 'Failed to update contract status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (trainerId: string, reviewData: ReviewFormData) => {
    // Return a specific object if not authenticated rather than throwing an error
    if (!user?._id) {
      // This allows UI to handle this case better
      return { requiresAuth: true, success: false };
    }
    
    try {
      setReviewSubmitting(true);
      setReviewError(null);
      
      const result = await addTrainerReview(trainerId, reviewData);
      
      // Update user reviews cache
      setUserReviews(prev => {
        if (!user || !user._id) {
          return prev; // Don't update if user doesn't exist
        }
        
        return {
          ...prev,
          [trainerId]: {
            userId: user._id,
            rating: reviewData.rating,
            comment: reviewData.comment,
            createdAt: new Date()
          } as Review // Use type assertion to match Review interface
        };
      });
      
      // If viewing this trainer profile, refresh it
      if (trainerProfile && trainerProfile._id === trainerId) {
        await loadTrainerProfile(trainerId);
      }
      
      return { ...result, success: true };
    } catch (err: any) {
      console.error('Failed to submit review:', err);
      setReviewError(err?.message || 'Failed to submit review');
      
      // If the error is an auth error, return a specific response
      if (err?.response?.status === 401) {
        return { requiresAuth: true, success: false };
      }
      
      return { error: err?.message || 'Failed to submit review', success: false };
    } finally {
      setReviewSubmitting(false);
    }
  };
  
  const fetchTrainerReviews = async (trainerId: string): Promise<Review[]> => {
    try {
      const reviews = await getTrainerReviews(trainerId);
      
      // Cache the user's review if it exists and user is authenticated
      if (user?._id) {
        const userReview: Review | undefined = reviews.find((review: Review) => {
          if (typeof review.userId === 'object' && review.userId !== null) {
            return review.userId._id === user._id;
          }
          return review.userId === user._id;
        });
        
        if (userReview) {
          setUserReviews(prev => ({
            ...prev,
            [trainerId]: userReview
          }));
        }
      }
      
      return reviews;
    } catch (err: any) {
      console.error('Failed to fetch trainer reviews:', err);
      return []; // Return empty array instead of throwing
    }
  };
  
  const hasUserReviewedTrainer = (trainerId: string): boolean => {
    // If not authenticated, user hasn't reviewed
    if (!user?._id) return false;
    
    // Check cached reviews first
    if (userReviews[trainerId]) {
      return true;
    }
    
    // Check trainer profile reviews if available
    if (trainerProfile && trainerProfile._id === trainerId && trainerProfile.reviews) {
      return trainerProfile.reviews.some((review: Review) => {
        if (typeof review.userId === 'object' && review.userId !== null) {
          return review.userId._id === user._id;
        }
        return review.userId === user._id;
      });
    }
    
    return false;
  };

  // Derived values
  const hasActiveContracts = contracts.some(
    contract => contract.status === ContractStatus.ACCEPTED
  );
  
  const pendingContractsCount = contracts.filter(
    contract => contract.status === ContractStatus.PENDING
  ).length;

  return (
    <TrainerContext.Provider
      value={{
        trainerProfile,
        contracts,
        loading,
        error,
        loadTrainerProfile,
        loadTrainerContracts,
        updateContract,
        hasActiveContracts,
        pendingContractsCount,
        submitReview,
        fetchTrainerReviews,
        reviewSubmitting,
        reviewError,
        hasUserReviewedTrainer
      }}
    >
      {children}
    </TrainerContext.Provider>
  );
};

export const useTrainer = () => useContext(TrainerContext);