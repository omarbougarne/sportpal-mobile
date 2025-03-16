import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Trainer } from '@/app/types/trainer';
import { Contract, ContractStatus } from '@/app/types/contract';
import { getTrainerByUserId } from '@/app/services/api/trainerApi';
import { getTrainerContracts, updateContractStatus } from '@/app/services/api/contractApi';
import { AuthContext } from './AuthContext';

interface TrainerContextType {
  trainerProfile: Trainer | null;
  contracts: Contract[];
  loading: boolean;
  error: string | null;
  loadTrainerProfile: () => Promise<void>;
  loadTrainerContracts: () => Promise<void>;
  updateContract: (contractId: string, status: ContractStatus) => Promise<void>;
  hasActiveContracts: boolean;
  pendingContractsCount: number;
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
  pendingContractsCount: 0
};

export const TrainerContext = createContext<TrainerContextType>(defaultContext);

export const TrainerProvider: React.FC<TrainerProviderProps> = ({ children }) => {
  const { user, isAuthenticated, isTrainer } = useContext(AuthContext);
  const [trainerProfile, setTrainerProfile] = useState<Trainer | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && isTrainer) {
      loadTrainerProfile();
      loadTrainerContracts();
    }
  }, [isAuthenticated, isTrainer]);

  const loadTrainerProfile = async () => {
    if (!user?._id) return;
    
    try {
      setLoading(true);
      setError(null);
      const trainer = await getTrainerByUserId(user._id);
      setTrainerProfile(trainer);
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

  // Derived properties
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
        pendingContractsCount
      }}
    >
      {children}
    </TrainerContext.Provider>
  );
};

// Custom hook
export const useTrainer = () => useContext(TrainerContext);