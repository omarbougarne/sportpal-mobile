import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/app/context/AuthContext';
import { getTrainerByUserId } from '@/app/services/api/trainerApi';

export const useIsTrainer = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [isTrainer, setIsTrainer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTrainerRole = async () => {
      if (isAuthenticated && user) {
        try {
          const trainer = await getTrainerByUserId(user._id);
          setIsTrainer(!!trainer);
        } catch (error) {
          console.error('Error checking trainer role:', error);
          setIsTrainer(false);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkTrainerRole();
  }, [isAuthenticated, user]);

  return { isTrainer, loading };
};