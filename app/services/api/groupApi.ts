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

export const joinGroup = async (groupId: string) => {
    try {
        const response = await apiClient.post(`/groups/${groupId}/join`);
        return response.data;
    } catch (error) {
        console.error('Error joining group:', error);
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

export const createGroup = async (groupData: any) => {
    try {
        const response = await apiClient.post('/groups', groupData);
        return response.data;
    } catch (error) {
        console.error('Error creating group:', error);
        throw error;
    }
};

export const updateGroup = async (groupId: string, groupData: any) => {
    try {
        const response = await apiClient.put(`/groups/${groupId}`, groupData);
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


