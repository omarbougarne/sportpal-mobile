import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  fetchGroups, 
  createGroup, 
  updateGroup, 
  deleteGroup, 
  joinGroupByName, 
  getGroupById, 
  fetchUserGroups,
  listGroupMembers, 
  removeMultipleMembers, 
  removeMemberFromGroup,
  inviteUserToGroup,
  makeGroupAdmin,
  removeGroupAdmin
} from '@/app/services/api/groupApi';
import { Group } from '@/app/types/group';
import { getUserById } from '../services/api/userApi';
import { UserContext } from './UserContext';
import { AuthContext } from './AuthContext';

interface Member {
  _id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  isAdmin?: boolean;
}

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
  getUserGroups: () => Promise<Group[]>;
}

interface GroupContextType {
  currentGroup: Group | null;
  members: Member[];
  loading: boolean;
  error: string | null;
  membersLoading: boolean;
  membersError: string | null;
  selectedMemberIds: string[];
  // Group actions
  loadGroup: (groupId: string) => Promise<void>;
  updateGroupDetails: (data: Partial<Group>) => Promise<void>;
  // Member management
  loadMembers: (groupId: string) => Promise<void>;
  toggleMemberSelection: (memberId: string) => void;
  clearMemberSelection: () => void;
  selectAllMembers: () => void;
  removeMember: (memberId: string) => Promise<boolean>;
  removeSelectedMembers: () => Promise<boolean>;
  inviteMember: (email: string) => Promise<boolean>;
  toggleAdmin: (userId: string, makeAdmin: boolean) => Promise<boolean>;
  // Status
  isUserGroupAdmin: (userId?: string) => boolean;
  isUserGroupOrganizer: (userId?: string) => boolean;
}

interface GroupProviderProps {
  children: ReactNode;
}

const defaultContext: GroupContextType = {
  currentGroup: null,
  members: [],
  loading: false,
  error: null,
  membersLoading: false,
  membersError: null,
  selectedMemberIds: [],
  loadGroup: async () => {},
  updateGroupDetails: async () => {},
  loadMembers: async () => {},
  toggleMemberSelection: () => {},
  clearMemberSelection: () => {},
  selectAllMembers: () => {},
  removeMember: async () => false,
  removeSelectedMembers: async () => false,
  inviteMember: async () => false,
  toggleAdmin: async () => false,
  isUserGroupAdmin: () => false,
  isUserGroupOrganizer: () => false
};

const GroupsContext = createContext<GroupsContextProps | undefined>(undefined);
export const GroupContext = createContext<GroupContextType>(defaultContext);

export const GroupsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useContext(UserContext)!;
  const [joinedGroups, setJoinedGroups] = useState<Group[]>([]);

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

const fetchJoinedGroups = async () => {
  try {
    setLoading(true);
    const userGroups = await getUserGroups();
    setJoinedGroups(userGroups);
    setError(null);
  } catch (err) {
    console.error('Error loading joined groups:', err);
    setError('Failed to load your groups');
  } finally {
    setLoading(false);
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
const getUserGroups = async (): Promise<Group[]> => {
  try {
    if (!user || !user._id) {
      throw new Error("User not logged in or user ID not found");
    }

    const userGroups = await fetchUserGroups(user._id);
    return userGroups;
  } catch (error) {
    console.error("Error fetching user groups:", error);
    return [];
  }
};
  return (
    <GroupsContext.Provider value={{ groups, loading, error, fetchAllGroups, addGroup, editGroup, removeGroup, joinGroupByNameContext, findGroupById, getUserGroups }}>
      {children}
    </GroupsContext.Provider>
  );
};

export const GroupProvider: React.FC<GroupProviderProps> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [membersLoading, setMembersLoading] = useState<boolean>(false);
  const [membersError, setMembersError] = useState<string | null>(null);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  const loadGroup = async (groupId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const groupData = await getGroupById(groupId);
      setCurrentGroup(groupData);
      
      // Also load members data
      await loadMembers(groupId);
    } catch (err: any) {
      console.error('Failed to load group:', err);
      setError(err?.message || 'Failed to load group');
    } finally {
      setLoading(false);
    }
  };

  const updateGroupDetails = async (data: Partial<Group>) => {
    if (!currentGroup?._id) {
      setError('No group loaded');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const updatedGroup = await updateGroup(currentGroup._id, data);
      setCurrentGroup(updatedGroup);
    } catch (err: any) {
      console.error('Failed to update group:', err);
      setError(err?.message || 'Failed to update group');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadMembers = async (groupId: string) => {
    try {
      setMembersLoading(true);
      setMembersError(null);
      
      const membersData = await listGroupMembers(groupId);
      setMembers(membersData || []);
    } catch (err: any) {
      console.error('Failed to load group members:', err);
      setMembersError(err?.message || 'Failed to load group members');
    } finally {
      setMembersLoading(false);
    }
  };

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMemberIds(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };

  const clearMemberSelection = () => {
    setSelectedMemberIds([]);
  };

  const selectAllMembers = () => {
    // Don't select the organizer if we have group data
    if (currentGroup?.organizer) {
      const organizerId = typeof currentGroup.organizer === 'object' 
        ? currentGroup.organizer._id 
        : currentGroup.organizer;
        
      setSelectedMemberIds(
        members
          .filter(member => member._id !== organizerId)
          .map(member => member._id)
      );
    } else {
      // Otherwise just select everyone
      setSelectedMemberIds(members.map(member => member._id));
    }
  };

  const removeMember = async (memberId: string): Promise<boolean> => {
    if (!currentGroup?._id) {
      setMembersError('No group loaded');
      return false;
    }

    // Don't allow removing the organizer
    if (isUserGroupOrganizer(memberId)) {
      setMembersError('Cannot remove the group organizer');
      return false;
    }

    try {
      await removeMemberFromGroup(currentGroup._id, memberId);
      
      // Update local state
      setMembers(prev => prev.filter(member => member._id !== memberId));
      
      // Also remove from selection if selected
      if (selectedMemberIds.includes(memberId)) {
        setSelectedMemberIds(prev => prev.filter(id => id !== memberId));
      }
      
      return true;
    } catch (err: any) {
      console.error('Failed to remove member:', err);
      setMembersError(err?.message || 'Failed to remove member');
      return false;
    }
  };

  const removeSelectedMembers = async (): Promise<boolean> => {
    if (!currentGroup?._id) {
      setMembersError('No group loaded');
      return false;
    }

    if (selectedMemberIds.length === 0) {
      setMembersError('No members selected');
      return false;
    }

    try {
      await removeMultipleMembers(currentGroup._id, selectedMemberIds);
      
      // Update local state
      setMembers(prev => 
        prev.filter(member => !selectedMemberIds.includes(member._id))
      );
      
      // Clear selection
      setSelectedMemberIds([]);
      
      return true;
    } catch (err: any) {
      console.error('Failed to remove members:', err);
      setMembersError(err?.message || 'Failed to remove members');
      return false;
    }
  };

  const inviteMember = async (email: string): Promise<boolean> => {
    if (!currentGroup?._id) {
      setMembersError('No group loaded');
      return false;
    }

    try {
      await inviteUserToGroup(currentGroup._id, email);
      return true;
    } catch (err: any) {
      console.error('Failed to invite member:', err);
      setMembersError(err?.message || 'Failed to invite member');
      return false;
    }
  };

  const toggleAdmin = async (userId: string, makeAdmin: boolean): Promise<boolean> => {
    if (!currentGroup?._id) {
      setMembersError('No group loaded');
      return false;
    }

    try {
      if (makeAdmin) {
        await makeGroupAdmin(currentGroup._id, userId);
      } else {
        await removeGroupAdmin(currentGroup._id, userId);
      }
      
      // Update local state
      setMembers(prev => 
        prev.map(member => 
          member._id === userId 
            ? { ...member, isAdmin: makeAdmin } 
            : member
        )
      );
      
      return true;
    } catch (err: any) {
      console.error(`Failed to ${makeAdmin ? 'make' : 'remove'} admin:`, err);
      setMembersError(err?.message || `Failed to ${makeAdmin ? 'make' : 'remove'} admin`);
      return false;
    }
  };

  const isUserGroupAdmin = (userId?: string): boolean => {
    if (!currentGroup) return false;
    
    const targetId = userId || user?._id;
    if (!targetId) return false;

    // Check if organizer
    if (isUserGroupOrganizer(targetId)) return true;
    
    // Check admins list if it exists
    if (currentGroup.admins) {
      return currentGroup.admins.some(adminId => 
        typeof adminId === 'object' 
          ? adminId._id === targetId 
          : adminId === targetId
      );
    }
    
    return false;
  };

  const isUserGroupOrganizer = (userId?: string): boolean => {
    if (!currentGroup?.organizer) return false;
    
    const targetId = userId || user?._id;
    if (!targetId) return false;

    if (typeof currentGroup.organizer === 'object') {
      return currentGroup.organizer._id === targetId;
    }
    
    return currentGroup.organizer === targetId;
  };

  return (
    <GroupContext.Provider
      value={{
        currentGroup,
        members,
        loading,
        error,
        membersLoading,
        membersError,
        selectedMemberIds,
        loadGroup,
        updateGroupDetails,
        loadMembers,
        toggleMemberSelection,
        clearMemberSelection,
        selectAllMembers,
        removeMember,
        removeSelectedMembers,
        inviteMember,
        toggleAdmin,
        isUserGroupAdmin,
        isUserGroupOrganizer
      }}
    >
      {children}
    </GroupContext.Provider>
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

export const useGroup = () => useContext(GroupContext);
