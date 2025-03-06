import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchGroups, createGroup, updateGroup, deleteGroup, joinGroupByName, getGroupById } from '@/app/services/api/groupApi';
import { Group } from '@/app/types/group';
import { getUserById } from '../services/api/userApi';
import { UserContext } from './UserContext';

interface GroupsContextProps {
  groups: Group[];
  loading: boolean;
  error: string | null;
  fetchAllGroups: () => void;
  addGroup: (groupData: Partial<Group>, userId: string) => Promise<void>;
  editGroup: (groupId: string, groupData: Partial<Group>) => Promise<void>;
  removeGroup: (groupId: string) => Promise<void>;
  joinGroupByNameContext: (groupName: string) => Promise<void>;
  findGroupById: (groupId: string) => Promise<Group | null>;
}



const GroupsContext = createContext<GroupsContextProps | undefined>(undefined);

export const GroupsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useContext(UserContext)!; 

  // Fetch groups initially
  useEffect(() => {
    fetchAllGroups();
  }, []);

  const fetchAllGroups = async () => {
    setLoading(true);
    try {
      const data = await fetchGroups();
      setGroups(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch groups');
    }
    setLoading(false);
  };

  const addGroup = async (groupData: Partial<Group>, userId: string) => {
    try {
        const newGroup = await createGroup(groupData, userId);
        setGroups((prev) => [...prev, newGroup]);
    } catch (err) {
        console.error('Error adding group:', err);
    }
};


  const editGroup = async (groupId: string, groupData: Partial<Group>) => {
    try {
      const updatedGroup = await updateGroup(groupId, groupData);
      setGroups((prev) => prev.map((g) => (g._id === groupId ? updatedGroup : g)));
    } catch (err) {
      console.error('Error updating group:', err);
    }
  };

  const removeGroup = async (groupId: string) => {
    try {
      await deleteGroup(groupId);
      setGroups((prev) => prev.filter((g) => g._id !== groupId));
    } catch (err) {
      console.error('Error deleting group:', err);
    }
  };


  const joinGroupByNameContext = async (groupName: string) => {
    try {
      // Use the actual user from UserContext instead of hardcoded value
      if (!user) {
        throw new Error("User not logged in");
      }

      if (!user._id) {
        throw new Error("User ID not found");
      }

      console.log(`Joining group ${groupName} with user ID ${user._id}`);
      // Use the joinGroupByName API function
      const response = await joinGroupByName(groupName, user._id);
      
      // Refresh the groups list
      await fetchAllGroups();
      
      return response;
    } catch (error) {
      console.error("Error joining group by name in context:", error);
      throw error;
    }
  };





  const findGroupById = async (groupId: string): Promise<Group | null> => {
    try {
      return await getGroupById(groupId);
    } catch (err) {
      console.error('Error fetching group by ID:', err);
      return null;
    }
  };

  return (
    <GroupsContext.Provider value={{ groups, loading, error, fetchAllGroups, addGroup, editGroup, removeGroup, joinGroupByNameContext, findGroupById }}>
      {children}
    </GroupsContext.Provider>
  );
};

// Custom hook to use GroupsContext
export const useGroups = () => {
  const context = useContext(GroupsContext);
  if (!context) {
    throw new Error('useGroups must be used within a GroupsProvider');
  }
  return context;
};
