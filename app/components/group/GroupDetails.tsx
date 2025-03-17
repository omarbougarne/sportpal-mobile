import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/app/hooks/useAuth';
import { getGroupById, joinGroupByName, leaveGroup, listGroupMembers } from '@/app/services/api/groupApi';
import MapView, { Marker } from 'react-native-maps';
import { getUserById } from '@/app/services/api/userApi';

interface GroupDetailsProps {
  id: string;
  onJoin?: () => void;
  onLeave?: () => void;
}

export default function GroupDetails({ id, onJoin, onLeave }: GroupDetailsProps) {
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [organizerDetails, setOrganizerDetails] = useState<any>(null);
  const [memberDetails, setMemberDetails] = useState<any[]>([]);
  
  const { user } = useAuth();
  const router = useRouter();
  
  // Fetch group data
 // Add this to your useEffect in GroupDetails.tsx

// Modify the section where you fetch user details to be more resilient:
// Replace your member fetching code with this:

useEffect(() => {
  const fetchGroupDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Get the group data
      const groupData = await getGroupById(id);
      setGroup(groupData);
      
      // Check if user is member or organizer
      if (user && groupData) {
        const userIsMember = groupData.members?.some(
          (member: any) => member._id === user._id || member === user._id
        );
        const userIsOrganizer = user._id === groupData.organizer?._id || 
                              user._id === groupData.organizer;
        
        setIsMember(userIsMember);
        setIsOrganizer(userIsOrganizer);
        
        // Instead of fetching each member separately, get them all at once
        try {
          const membersData = await listGroupMembers(id);
          setMemberDetails(membersData || []);
        } catch (err) {
          console.warn('Could not fetch member details:', err);
          // Fall back to the basic member info from the group object
        }
        
        // Only try to fetch organizer details if needed
        if (groupData.organizer && typeof groupData.organizer === 'string') {
          try {
            // Try to get organizer from the members list first
            const organizerFromMembers = memberDetails.find(
              (m: any) => m._id === groupData.organizer
            );
            
            if (organizerFromMembers) {
              setOrganizerDetails(organizerFromMembers);
            } else {
              // If not found in members, you might need a separate call
              // But maybe skip this for now since your user API has issues
              setOrganizerDetails({
                _id: groupData.organizer,
                name: 'Group Organizer'
              });
            }
          } catch (err) {
            console.warn('Could not resolve organizer details:', err);
          }
        } else if (groupData.organizer) {
          // If organizer is already an object with details
          setOrganizerDetails(groupData.organizer);
        }
      }
    } catch (err) {
      console.error('Failed to fetch group details:', err);
      setError('Could not load group details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  fetchGroupDetails();
}, [id, user?._id]);
  
  // Handle joining the group
  const handleJoinGroup = async () => {
    try {
      setJoining(true);
      
      if (!group?.name || !user?._id) {
        throw new Error("Missing group name or user data");
      }
      
      await joinGroupByName(group.name, user._id);
      setIsMember(true);
      
      const updatedGroup = await getGroupById(id);
      setGroup(updatedGroup);
      
      if (onJoin) onJoin();
      
      Alert.alert('Success', 'You have joined the group!');
    } catch (err) {
      console.error('Error joining group:', err);
      Alert.alert('Error', 'Failed to join the group. Please try again.');
    } finally {
      setJoining(false);
    }
  };
  
  // Handle leaving the group
  const handleLeaveGroup = async () => {
    Alert.alert(
      'Leave Group',
      'Are you sure you want to leave this group?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              setLeaving(true);
              
              // The leaveGroup function now uses the JWT token from the request
              // so we don't need to pass the userId
              await leaveGroup(id);
              setIsMember(false);
              
              const updatedGroup = await getGroupById(id);
              setGroup(updatedGroup);
              
              if (onLeave) onLeave();
              
              Alert.alert('Success', 'You have left the group.');
            } catch (err) {
              console.error('Error leaving group:', err);
              Alert.alert('Error', 'Failed to leave the group. Please try again.');
            } finally {
              setLeaving(false);
            }
          }
        }
      ]
    );
  };
  
  // Handle editing group
  const handleEditGroup = () => {
    router.push(`/group/${id}/edit`);
  };
  
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading group details...</Text>
      </View>
    );
  }
  
  if (error || !group) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={60} color="#FF3B30" />
        <Text style={styles.errorText}>{error || 'Group not found'}</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Group header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.groupName}>{group.name || 'Unnamed Group'}</Text>
          <Text style={styles.groupSport}>{group.sport || 'No sport specified'}</Text>
          {group.activity && <Text style={styles.groupActivity}>{group.activity}</Text>}
        </View>
        
        {isOrganizer && (
          <TouchableOpacity style={styles.editButton} onPress={handleEditGroup}>
            <Ionicons name="create-outline" size={24} color="#2196F3" />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Description */}
      {group.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{group.description}</Text>
        </View>
      )}
      
      {/* Group membership info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Members</Text>
        <Text style={styles.memberCount}>
          {group.members?.length || 0} members
        </Text>
        
        <View style={styles.membersList}>
          {/* Show first few members - THIS IS WHERE YOU ADD THE MEMBER LIST CODE */}
          {(memberDetails.length > 0 ? memberDetails : group?.members?.slice(0, 5) || [])
            .map((member: any, index: number) => (
              <View key={member?._id || `member-${index}`} style={styles.memberItem}>
                <View style={styles.memberAvatar}>
                  {member && member.profileImageUrl ? (
                    <Image 
                      source={{ uri: member.profileImageUrl }} 
                      style={styles.memberImage}
                    />
                  ) : (
                    <Text style={styles.memberInitial}>
                      {member && member.name ? member.name.charAt(0).toUpperCase() : "?"}
                    </Text>
                  )}
                </View>
                <Text style={styles.memberName} numberOfLines={1}>
                  {member && member.name ? member.name : 'Unknown member'}
                </Text>
              </View>
            ))}
          
          {/* Show more members indicator if needed */}
          {(group.members?.length > 5) && (
            <View style={styles.memberItem}>
              <View style={[styles.memberAvatar, styles.moreMembersAvatar]}>
                <Text style={styles.memberInitial}>+{group.members.length - 5}</Text>
              </View>
              <Text style={styles.memberName}>More members</Text>
            </View>
          )}
        </View>
      </View>
      
      {/* Organizer info */}
      {(organizerDetails || group.organizer) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Organizer</Text>
          <View style={styles.organizerContainer}>
            <View style={styles.organizerAvatar}>
              {organizerDetails && organizerDetails.profileImageUrl ? (
                <Image 
                  source={{ uri: organizerDetails.profileImageUrl }} 
                  style={styles.organizerImage}
                />
              ) : (
                <Text style={styles.organizerInitial}>
                  {organizerDetails && organizerDetails.name 
                    ? organizerDetails.name.charAt(0).toUpperCase() 
                    : group.organizer && group.organizer.name 
                      ? group.organizer.name.charAt(0).toUpperCase() 
                      : "O"}
                </Text>
              )}
            </View>
            <View>
              <Text style={styles.organizerName}>
                {organizerDetails && organizerDetails.name 
                  ? organizerDetails.name 
                  : group.organizer && group.organizer.name 
                    ? group.organizer.name 
                    : 'Unknown organizer'}
              </Text>
              {organizerDetails && organizerDetails.email && (
                <Text style={styles.organizerEmail}>{organizerDetails.email}</Text>
              )}
            </View>
          </View>
        </View>
      )}
      
      {/* Location info */}
      {/* Location info */}
{group.location && (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Location</Text>
    
    {/* Display location name if available */}
    {group.location.name && (
      <Text style={styles.locationName}>{group.location.name}</Text>
    )}
    
    {/* Make sure coordinates exist and are in the right format */}
    {group.location.coordinates && 
     Array.isArray(group.location.coordinates) && 
     group.location.coordinates.length >= 2 && (
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: parseFloat(group.location.coordinates[1]) || 0,
            longitude: parseFloat(group.location.coordinates[0]) || 0,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
        >
          <Marker
            coordinate={{
              latitude: parseFloat(group.location.coordinates[1]) || 0,
              longitude: parseFloat(group.location.coordinates[0]) || 0,
            }}
            title={group.name || "Group Location"}
          />
        </MapView>
      </View>
    )}
    
    {/* Display formatted address if available */}
    {(group.location.address || group.location.city || group.location.country) && (
      <Text style={styles.address}>
        {group.location.address ? `${group.location.address}, ` : ''}
        {group.location.city ? `${group.location.city}, ` : ''}
        {group.location.country || ''}
      </Text>
    )}
    
    {/* If no specific location details available, show generic message */}
    {!group.location.name && 
     !group.location.address && 
     !group.location.city && 
     !group.location.country && 
     (!group.location.coordinates || !Array.isArray(group.location.coordinates)) && (
      <Text style={styles.locationMissing}>No detailed location information available</Text>
    )}
  </View>
)}
      
      {/* Action buttons */}
      <View style={styles.actionContainer}>
        {!isMember ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.joinButton]}
            onPress={handleJoinGroup}
            disabled={joining}
          >
            {joining ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="add-circle-outline" size={20} color="white" style={styles.buttonIcon} />
                <Text style={styles.actionButtonText}>Join Group</Text>
              </>
            )}
          </TouchableOpacity>
        ) : !isOrganizer ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.leaveButton]}
            onPress={handleLeaveGroup}
            disabled={leaving}
          >
            {leaving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="exit-outline" size={20} color="white" style={styles.buttonIcon} />
                <Text style={styles.actionButtonText}>Leave Group</Text>
              </>
            )}
          </TouchableOpacity>
        ) : null}
        
        {/* If user is organizer, show manage group option */}
        {isOrganizer && (
          <TouchableOpacity
            style={[styles.actionButton, styles.manageButton]}
            onPress={() => router.push(`/group/${id}/manage`)}
          >
            <Ionicons name="settings-outline" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.actionButtonText}>Manage Group</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerContent: {
    flex: 1,
  },
  groupName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  groupSport: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },
  groupActivity: {
    fontSize: 14,
    color: '#888',
  },
  editButton: {
    padding: 8,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  memberCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  membersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  memberItem: {
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 12,
    width: 70,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  moreMembersAvatar: {
    backgroundColor: '#888',
  },
  memberInitial: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  memberName: {
    fontSize: 12,
    textAlign: 'center',
  },
  organizerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  organizerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF9800',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  organizerInitial: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  organizerName: {
    fontSize: 16,
    fontWeight: '500',
  },
  organizerEmail: {
    fontSize: 12,
    color: '#666',
  },
  mapContainer: {
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    color: '#666',
  },
  actionContainer: {
    padding: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  joinButton: {
    backgroundColor: '#2196F3',
  },
  leaveButton: {
    backgroundColor: '#FF3B30',
  },
  manageButton: {
    backgroundColor: '#FF9800',
  },
  buttonIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  organizerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});