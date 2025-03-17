import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './apiClient';

export const fetchGroups = async () => {
    try {
        console.log('Fetching groups...');
        const response = await apiClient.get('/groups');
        console.log('Fetched groups:', response.data);
        return response.data; // Assuming response.data is now the array of groups
    } catch (error) {
        console.error('Error fetching groups:', error);
        throw error;
    }
};
// Leave a group
// Update your leaveGroup function to match your controller
export async function leaveGroup(groupId: string) {
    try {
        const response = await apiClient.post(`/groups/${groupId}/leave`);
        return response.data;
    } catch (error) {
        console.error('Error leaving group:', error);
        throw error;
    }
}
export const joinGroupByName = async (groupName: string, userId: string) => {
    try {
        console.log(`User ${userId} attempting to join group ${groupName}`);
        // Use RESTful resource pattern where the resource (group) is in the path
        const response = await apiClient.post(`/groups/${encodeURIComponent(groupName)}/join`, { userId });
        console.log('Join group response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error joining group by name:', error);
        throw error;
    }
};

export const searchGroups = async (query: string) => {
    try {
        const response = await apiClient.get(`/groups/search`, {
            params: { query },
        });
        return response.data;
    } catch (error) {
        console.error('Error searching groups:', error);
        throw error;
    }
};

export const getGroupById = async (groupId: string) => {
    try {
        const response = await apiClient.get(`/groups/${groupId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching group by ID:', error);
        throw error;
    }
};

// Update your createGroup function like this
export const createGroup = async (groupData: any) => {
    try {
        // The userId is now extracted from JWT token on the backend
        const response = await apiClient.post('/groups/create', groupData);
        return response.data;
    } catch (error) {
        console.error('Error creating group:', error);
        throw error;
    }
};

export const updateGroup = async (groupId: string, groupData: any) => {
    try {
        const response = await apiClient.patch(`/groups/${groupId}`, groupData);
        return response.data;
    } catch (error) {
        console.error('Error updating group:', error);
        throw error;
    }
};

export const deleteGroup = async (groupId: string) => {
    try {
        const response = await apiClient.delete(`/groups/${groupId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting group:', error);
        throw error;
    }
};

export const removeMemberFromGroup = async (groupId: string, userId: string) => {
    try {
        const response = await apiClient.post(`/groups/${groupId}/removeMember`, { userId });
        return response.data;
    } catch (error) {
        console.error('Error removing member from group:', error);
        throw error;
    }
};

export const listGroupMembers = async (groupId: string) => {
    try {
        const response = await apiClient.get(`/groups/${groupId}/members`);
        return response.data;
    } catch (error) {
        console.error('Error listing group members:', error);
        throw error;
    }
};

export const addMessageToGroup = async (groupId: string, messageId: string) => {
    try {
        const response = await apiClient.post(`/groups/${groupId}/messages`, { messageId });
        return response.data;
    } catch (error) {
        console.error('Error adding message to group:', error);
        throw error;
    }
};

export const fetchUserGroups = async (userId: string) => {
    try {
        console.log(`Fetching groups for user ${userId}...`);
        const response = await apiClient.get(`/groups/member/${userId}`);
        console.log(`Fetched ${response.data.length} groups for user:`, response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching user groups:', error);
        throw error;
    }
};



// Add to your existing groupApi.ts file

// Get nearby groups based on coordinates
export async function getNearbyGroups(latitude: number, longitude: number, distance: number = 5000) {
    try {
        const response = await apiClient.get(`/groups/nearby?lat=${latitude}&lng=${longitude}&distance=${distance}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching nearby groups:', error);
        throw error;
    }
}


// Add this function to your groupApi.ts file

// Get detailed member info for a group
export async function getGroupMembers(groupId: string) {
    try {
        // This uses the listGroupMembers function you already have
        const members = await listGroupMembers(groupId);
        return members;
    } catch (error) {
        console.error('Error fetching group members:', error);
        throw error;
    }
}