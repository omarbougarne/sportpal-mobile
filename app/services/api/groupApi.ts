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

export const createGroup = async (groupData: any, userId: string) => {
    try {
        const response = await apiClient.post(`/groups/create/${userId}`, groupData);
        // console.log(response);

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




