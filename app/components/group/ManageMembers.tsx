import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { listGroupMembers, removeMemberFromGroup } from '@/app/services/api/groupApi';
import { styles } from '../styles/ManageMembersStyle';
interface ManageMembersProps {
  groupId: string;
}

interface Member {
  _id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  isOrganizer?: boolean;
  hasValidId?: boolean;
}

// Add this MongoDB ObjectId validation function
const isValidMongoId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

export default function ManageMembers({ groupId }: ManageMembersProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRemoving, setIsRemoving] = useState(false);
  
  useEffect(() => {
    fetchMembers();
    console.log(fetchMembers())
  }, [groupId]);
  
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await listGroupMembers(groupId);
      console.log('Fetched members raw data:', JSON.stringify(data, null, 2));
      
      // Process members based on your actual schema structure
      const processedMembers = (data || []).map((member: any, index: number) => ({
        // Use userId as the _id since that's the actual user ID reference
        _id: member.userId || member._id || `temp-id-${index}`, 
        name: member.name || 'Unknown User',
        // Email isn't stored in your group schema, would need separate user fetch
        email: member.email || 'Member', 
        profileImageUrl: member.profileImageUrl,
        isOrganizer: groupId && member.userId === (data.organizer?.userId || ''),
        hasValidId: isValidMongoId(member.userId || member._id)
      }));
      
      setMembers(processedMembers);
    } catch (error) {
      console.error('Error fetching members:', error);
      Alert.alert('Error', 'Failed to load group members');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchMembers();
  };
  
  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };
  
  const handleRemoveSingleMember = (memberId: string, memberName: string) => {
    // First check if this is a valid MongoDB ID
    if (!isValidMongoId(memberId)) {
      Alert.alert(
        'Cannot Remove Member',
        'This member cannot be removed because they have an invalid ID. This might be a temporary entry.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${memberName} from the group?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: async () => {
            try {
              setIsRemoving(true);
              console.log('Removing member:', memberId, 'from group:', groupId);
              
              const result = await removeMemberFromGroup(groupId, memberId);
              console.log('Removal result:', result);
              
              // Remove member from the local state to update UI immediately
              setMembers(prev => prev.filter(member => member._id !== memberId));
              Alert.alert('Success', 'Member removed successfully');
            } catch (error) {
              console.error('Error removing member:', error);
              // Show more detailed error message
              Alert.alert('Error', `Failed to remove member: ${error.message || 'Unknown error'}`);
            } finally {
              setIsRemoving(false);
            }
          }
        }
      ]
    );
  };
  
  const handleRemoveSelectedMembers = async () => {
    if (selectedMembers.length === 0) {
      Alert.alert('No Selection', 'Please select members to remove');
      return;
    }
    
    // Filter out invalid MongoDB IDs
    const validMemberIds = selectedMembers.filter(id => isValidMongoId(id));
    
    if (validMemberIds.length === 0) {
      Alert.alert('Invalid Selection', 'None of the selected members can be removed because they have invalid IDs.');
      return;
    }
    
    if (validMemberIds.length < selectedMembers.length) {
      Alert.alert(
        'Partial Selection',
        `Only ${validMemberIds.length} of ${selectedMembers.length} selected members can be removed. Others have invalid IDs.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Continue',
            onPress: () => proceedWithRemoval(validMemberIds)
          }
        ]
      );
    } else {
      proceedWithRemoval(validMemberIds);
    }
  };
  
  // Helper function to proceed with batch removal
  const proceedWithRemoval = (memberIds: string[]) => {
    Alert.alert(
      'Remove Members',
      `Are you sure you want to remove ${memberIds.length} member${memberIds.length > 1 ? 's' : ''}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: async () => {
            try {
              setIsRemoving(true);
              
              // Remove each member one by one
              for (const memberId of memberIds) {
                await removeMemberFromGroup(groupId, memberId);
              }
              
              // Update local state
              setMembers(prev => 
                prev.filter(member => !memberIds.includes(member._id))
              );
              
              // Clear selection
              setSelectedMembers([]);
              
              Alert.alert('Success', 'Members removed successfully');
            } catch (error) {
              console.error('Error removing members:', error);
              Alert.alert('Error', 'Failed to remove members');
              
              // Refresh to ensure UI is in sync with backend
              fetchMembers();
            } finally {
              setIsRemoving(false);
            }
          }
        }
      ]
    );
  };
  
  // Filter members based on search query
 // Updated filter function with null checks
const filteredMembers = members.filter(member => 
  (member.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
  (member.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
);
  
  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading members...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search members by name or email"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>
      
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>
          {searchQuery ? `Found ${filteredMembers.length} members` : `All Members (${members.length})`}
        </Text>
        
        {selectedMembers.length > 0 && (
          <TouchableOpacity 
            style={styles.batchActionButton}
            onPress={handleRemoveSelectedMembers}
            disabled={isRemoving}
          >
            <Text style={styles.batchActionText}>
              {isRemoving 
                ? 'Removing...' 
                : `Remove (${selectedMembers.length})`}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
  data={filteredMembers}
  keyExtractor={(item, index) => item._id || `item-${index}`}
  refreshing={refreshing}
  onRefresh={handleRefresh}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[
              styles.memberItem,
              selectedMembers.includes(item._id) && styles.selectedMemberItem,
              item.isOrganizer && styles.organizerItem
            ]}
            onPress={() => !item.isOrganizer && toggleMemberSelection(item._id)}
            disabled={item.isOrganizer || isRemoving}
          >
            <View style={styles.memberInfo}>
              {selectedMembers.includes(item._id) ? (
                <View style={styles.checkboxContainer}>
                  <Ionicons name="checkmark-circle" size={28} color="#2196F3" />
                </View>
              ) : (
                <View style={[
                  styles.memberAvatar,
                  item.isOrganizer && styles.organizerAvatar
                ]}>
                  {item.profileImageUrl ? (
                    <Image source={{ uri: item.profileImageUrl }} style={styles.avatarImage} />
                  ) : (
                    <Text style={styles.avatarText}>
                      {(item.name && item.name[0]) ? item.name[0].toUpperCase() : '?'}
                    </Text>
                  )}
                </View>
              )}
              
              <View>
                <Text style={styles.memberName}>
                  {item.name || 'Unknown User'}
                  {item.isOrganizer && <Text style={styles.organizerLabel}> (Organizer)</Text>}
                </Text>
                <Text style={styles.memberEmail}>{item.email || 'Group Member'}</Text>
              </View>
            </View>
            
            {!item.isOrganizer && (
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => handleRemoveSingleMember(item._id, item.name)}
                disabled={isRemoving}
              >
                <Ionicons 
                  name="close-circle" 
                  size={24} 
                  color={isRemoving ? "#ccc" : "#FF3B30"} 
                />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery 
                ? "No members match your search criteria" 
                : "No members in this group yet"}
            </Text>
          </View>
        }
      />
    </View>
  );
}

