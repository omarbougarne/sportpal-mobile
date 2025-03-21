import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './apiClient';

export const fetchGroups = async () => {
    try {
        // console.log('Fetching groups...');
        const response = await apiClient.get('/groups');
        // console.log('Fetched groups:', response.data);
        return response.data; // Assuming response.data is now the array of groups
    } catch (error) {
        // console.error('Error fetching groups:', error);
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
        // console.error('Error leaving group:', error);
        throw error;
    }
}
export const joinGroupByName = async (groupName: string, userId: string) => {
    try {
        // console.log(`User ${userId} attempting to join group ${groupName}`);
        // Use RESTful resource pattern where the resource (group) is in the path
        const response = await apiClient.post(`/groups/${encodeURIComponent(groupName)}/join`, { userId });
        // console.log('Join group response:', response.data);
        return response.data;
    } catch (error) {
        // console.error('Error joining group by name:', error);
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
export const getUserGroups = async () => {
    try {
        // Get user data from AsyncStorage
        const userData = await AsyncStorage.getItem('userData');
        console.log('User data exists:', !!userData);

        let userId = null;

        if (userData) {
            // Parse stored data
            const parsedData = JSON.parse(userData);
            console.log('Parsed user data:', parsedData);

            // Check if we have a token-only format
            if (parsedData.access_token) {
                // Extract user ID from JWT token
                try {
                    // The token is in format: header.payload.signature
                    // We need to decode the payload (second part)
                    const tokenParts = parsedData.access_token.split('.');
                    if (tokenParts.length >= 2) {
                        const payload = JSON.parse(atob(tokenParts[1]));
                        userId = payload.sub; // The user ID is in the 'sub' claim
                        console.log('Extracted user ID from token:', userId);
                    }
                } catch (decodeError) {
                    console.error('Error decoding JWT token:', decodeError);
                }
            } else if (parsedData._id) {
                // Regular user object format
                userId = parsedData._id;
            } else if (parsedData.id) {
                userId = parsedData.id;
            }
        }

        // If we still don't have a user ID, try the /auth/me endpoint
        if (!userId) {
            try {
                console.log('No user ID found in stored data, trying /auth/me');
                const response = await apiClient.get('/auth/me');
                userId = response.data._id || response.data.id || response.data.sub;
                console.log('Got user ID from /auth/me:', userId);
            } catch (authError) {
                console.error('Error getting user from /auth/me:', authError);
            }
        }

        // Final check for user ID
        if (!userId) {
            console.warn('No user ID available after all attempts, returning empty groups array');
            return [];
        }

        // Use the extracted user ID
        console.log(`Fetching groups for user ID: ${userId}`);
        const response = await apiClient.get(`/groups/member/${userId}`);

        console.log(`Fetched ${response.data.length} groups for current user`);
        return response.data || [];
    } catch (error) {
        console.error('Error fetching user groups:', error);
        return [];
    }
};

export const deleteGroup = async (groupId: string) => {
    try {
        const response = await apiClient.delete(`/groups/${groupId}`);
        return response.data;
    } catch (error) {
        // console.error('Error deleting group:', error);
        throw error;
    }
};

export const removeMemberFromGroup = async (groupId: string, memberId: string) => {
    try {
        const response = await apiClient.delete(`/groups/${groupId}/members/${memberId}`);
        return response.data;
    } catch (error) {
        console.error('Error removing member:', error);
        throw error; // Make sure to rethrow the error to handle it in the component
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

// Add these new functions to your groupApi.ts file

// Remove multiple members at once
export const removeMultipleMembers = async (groupId: string, memberIds: string[]) => {
    try {
        const response = await apiClient.delete(`/groups/${groupId}/members`, {
            data: { memberIds }
        });
        return response.data;
    } catch (error) {
        console.error('Error removing members:', error);
        throw error;
    }
};

// Invite user to group
export const inviteUserToGroup = async (groupId: string, email: string) => {
    try {
        const response = await apiClient.post(`/groups/${groupId}/invite`, { email });
        return response.data;
    } catch (error) {
        console.error('Error inviting user to group:', error);
        throw error;
    }
};

// Get group member details with pagination support
export const getGroupMembersWithDetails = async (
    groupId: string,
    page: number = 1,
    limit: number = 20
) => {
    try {
        const response = await apiClient.get(
            `/groups/${groupId}/members/details`,
            { params: { page, limit } }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching member details:', error);
        throw error;
    }
};

// Check if user is member of group
export const checkGroupMembership = async (groupId: string) => {
    try {
        const response = await apiClient.get(`/groups/${groupId}/membership`);
        return response.data.isMember;
    } catch (error) {
        console.error('Error checking group membership:', error);
        return false;
    }
};

// Make a user admin of the group
export const makeGroupAdmin = async (groupId: string, userId: string) => {
    try {
        const response = await apiClient.post(`/groups/${groupId}/admins`, { userId });
        return response.data;
    } catch (error) {
        console.error('Error making user admin:', error);
        throw error;
    }
};

// Remove admin privileges
export const removeGroupAdmin = async (groupId: string, userId: string) => {
    try {
        const response = await apiClient.delete(`/groups/${groupId}/admins/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error removing admin privileges:', error);
        throw error;
    }
};