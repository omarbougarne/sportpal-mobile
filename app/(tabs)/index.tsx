import React, { useEffect, useContext, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ImageBackground, TextInput, Modal, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { UserContext } from '../context/UserContext';
import { useGroups } from '../context/GroupContext';
import { Ionicons } from '@expo/vector-icons';

export default function Index() {
  const router = useRouter();
  const { user, refreshUser } = useContext(UserContext)!;
  const { groups, loading, error, fetchAllGroups, joinGroupByNameContext } = useGroups();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    sport: '',
    activity: '',
    city: ''
  });
  
  // Extract unique filter options
  const sportOptions = Array.isArray(groups) ? 
    [...new Set(groups.map(group => group.sport))] : [];
  
  const activityOptions = Array.isArray(groups) ? 
    [...new Set(groups.map(group => group.activity))] : [];
  
  const cityOptions = Array.isArray(groups) ? 
    [...new Set(groups.map(group => group.location?.city).filter(Boolean))] : [];

  useEffect(() => {
    fetchAllGroups();
    refreshUser();
  }, []);

  // Filter and search logic
  const filteredGroups = Array.isArray(groups) ? 
    groups.filter(group => {
      // Text search
      const matchesSearch = searchQuery === '' || 
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (group.location?.city || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filters
      const matchesSport = activeFilters.sport === '' || group.sport === activeFilters.sport;
      const matchesActivity = activeFilters.activity === '' || group.activity === activeFilters.activity;
      const matchesCity = activeFilters.city === '' || group.location?.city === activeFilters.city;
      
      return matchesSearch && matchesSport && matchesActivity && matchesCity;
    }) : [];

  const handleClearFilters = () => {
    setActiveFilters({
      sport: '',
      activity: '',
      city: ''
    });
    setFilterModalVisible(false);
  };

  const handleJoinGroup = async (groupName: string) => {
    if (!user || !user._id) {
      Alert.alert(
        "Authentication Required",
        "You need to login first to join a group.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => router.push("./") }
        ]
      );
      return;
    }

    try {
      await joinGroupByNameContext(groupName);
      Alert.alert("Success", "You have successfully joined the group!");
      refreshUser();
    } catch (err) {
      console.error('Error joining group:', err);
      Alert.alert("Hello", "You are Already a Member");
    }
  };

  if (loading) return (
    <ImageBackground 
      source={{uri:'https://i.pinimg.com/736x/86/da/d0/86dad02018fc7eaeb628c94b5705fef3.jpg'}}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading groups...</Text>
        </View>
      </View>
    </ImageBackground>
  );
  
  if (error) return (
    <ImageBackground 
      source={{uri:'https://i.pinimg.com/736x/86/da/d0/86dad02018fc7eaeb628c94b5705fef3.jpg'}}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      </View>
    </ImageBackground>
  );

  return (
    <ImageBackground 
      source={{uri:'https://i.pinimg.com/736x/86/da/d0/86dad02018fc7eaeb628c94b5705fef3.jpg'}}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.pageTitle}>Best Groups for You</Text>
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#FFFFFF" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search groups..."
                placeholderTextColor="#AAAAAA"
                value={searchQuery}
                onChangeText={setSearchQuery}
                clearButtonMode="while-editing"
              />
              {searchQuery !== '' && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color="#CCCCCC" />
                </TouchableOpacity>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setFilterModalVisible(true)}
            >
              <Ionicons name="options" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          {/* Active Filters Display */}
          {(activeFilters.sport !== '' || activeFilters.activity !== '' || activeFilters.city !== '') && (
            <View style={styles.activeFiltersContainer}>
              <Text style={styles.activeFiltersTitle}>Active Filters:</Text>
              <View style={styles.filterChipsContainer}>
                {activeFilters.sport !== '' && (
                  <View style={styles.filterChip}>
                    <Text style={styles.filterChipText}>Sport: {activeFilters.sport}</Text>
                    <TouchableOpacity 
                      onPress={() => setActiveFilters({...activeFilters, sport: ''})}
                      style={styles.filterChipRemove}
                    >
                      <Ionicons name="close-circle" size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                )}
                
                {activeFilters.activity !== '' && (
                  <View style={styles.filterChip}>
                    <Text style={styles.filterChipText}>Activity: {activeFilters.activity}</Text>
                    <TouchableOpacity 
                      onPress={() => setActiveFilters({...activeFilters, activity: ''})}
                      style={styles.filterChipRemove}
                    >
                      <Ionicons name="close-circle" size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                )}
                
                {activeFilters.city !== '' && (
                  <View style={styles.filterChip}>
                    <Text style={styles.filterChipText}>Location: {activeFilters.city}</Text>
                    <TouchableOpacity 
                      onPress={() => setActiveFilters({...activeFilters, city: ''})}
                      style={styles.filterChipRemove}
                    >
                      <Ionicons name="close-circle" size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                )}
                
                <TouchableOpacity 
                  onPress={handleClearFilters}
                  style={styles.clearAllButton}
                >
                  <Text style={styles.clearAllText}>Clear All</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {/* Results Count */}
          <View style={styles.resultsCountContainer}>
            <Text style={styles.resultsCount}>
              {filteredGroups.length} groups found
              {searchQuery ? ` for "${searchQuery}"` : ''}
            </Text>
          </View>
          
          {/* Create Group Button */}
          <TouchableOpacity 
            style={styles.createGroupButton}
            onPress={() => router.push('/group/create')}
            disabled={!user || !user._id}
          >
            <Text style={styles.createGroupButtonText}>
              {user && user._id ? "Create New Group" : "Login to Create Group"}
            </Text>
            <Ionicons name="add-circle" size={24} color="white" style={styles.createGroupIcon} />
          </TouchableOpacity>

          {/* Group List */}
          <FlatList
            data={filteredGroups}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              // Existing group item UI...
              <View style={styles.groupItem}>
                <Text style={styles.groupName}>{item.name}</Text>
                <View style={styles.detailsContainer}>
                  <Text style={styles.detailLabel}>Sport:</Text>
                  <Text style={styles.detailValue}>{item.sport}</Text>
                </View>
                <View style={styles.detailsContainer}>
                  <Text style={styles.detailLabel}>Activity:</Text>
                  <Text style={styles.detailValue}>{item.activity}</Text>
                </View>
                <View style={styles.detailsContainer}>
                  <Text style={styles.detailLabel}>Location:</Text>
                  <Text style={styles.detailValue}>{item?.location.city || 'unknown'}</Text>
                </View>
                
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => router.push(`/group/${item._id}`)}
                  >
                    <Text style={styles.buttonText}>View Group</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.joinButton, 
                      { opacity: (!user || !user._id) ? 0.7 : 1 }
                    ]}
                    onPress={() => handleJoinGroup(item.name)}
                    disabled={!user || !user._id}
                  >
                    <Text style={styles.buttonText}>
                      {user && user._id ? "Join Group" : "Login to Join"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyMessage}>
                  {searchQuery || activeFilters.sport || activeFilters.activity || activeFilters.city ? 
                    'No groups match your search criteria' : 
                    'No groups available'}
                </Text>
              </View>
            }
          />
        </View>
      </View>
      
      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Groups</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.filterOptionsContainer}>
              {/* Sport Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Sport</Text>
                <View style={styles.filterOptions}>
                  {sportOptions.map(sport => (
                    <TouchableOpacity 
                      key={sport} 
                      style={[
                        styles.filterOption,
                        activeFilters.sport === sport && styles.filterOptionActive
                      ]}
                      onPress={() => setActiveFilters({...activeFilters, sport: activeFilters.sport === sport ? '' : sport})}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        activeFilters.sport === sport && styles.filterOptionTextActive
                      ]}>
                        {sport}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Activity Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Activity</Text>
                <View style={styles.filterOptions}>
                  {activityOptions.map(activity => (
                    <TouchableOpacity 
                      key={activity} 
                      style={[
                        styles.filterOption,
                        activeFilters.activity === activity && styles.filterOptionActive
                      ]}
                      onPress={() => setActiveFilters({...activeFilters, activity: activeFilters.activity === activity ? '' : activity})}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        activeFilters.activity === activity && styles.filterOptionTextActive
                      ]}>
                        {activity}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* City Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Location</Text>
                <View style={styles.filterOptions}>
                  {cityOptions.map(city => (
                    <TouchableOpacity 
                      key={city} 
                      style={[
                        styles.filterOption,
                        activeFilters.city === city && styles.filterOptionActive
                      ]}
                      onPress={() => setActiveFilters({...activeFilters, city: activeFilters.city === city ? '' : city})}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        activeFilters.city === city && styles.filterOptionTextActive
                      ]}>
                        {city}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.clearFiltersButton}
                onPress={handleClearFilters}
              >
                <Text style={styles.clearFiltersText}>Clear All Filters</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.applyFiltersButton}
                onPress={() => setFilterModalVisible(false)}
              >
                <Text style={styles.applyFiltersText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // Background & Container Styles
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  container: { 
    flex: 1, 
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(34, 34, 34, 0.7)',
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  
  // Typography Styles
  pageTitle: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 20,
    color: 'white',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 10,
  },
  loadingText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: '#ff6b6b',
    fontWeight: 'bold',
  },
  
  // Group Item Styles
  groupItem: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  groupName: { 
    fontSize: 22, 
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  detailsContainer: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 16,
    color: '#BBBBBB',
    fontWeight: 'bold',
    width: 80,
  },
  detailValue: {
    fontSize: 16,
    color: '#F0F0F0',
    flex: 1,
  },
  
  // Button Styles
  viewButton: {
    backgroundColor: 'rgba(12, 54, 88, 0.9)',  // Material Blue
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.5)',
  },
  joinButton: {
    backgroundColor: 'rgba(17, 134, 64, 0.7)',  // Material Green
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.5)',
  },
  buttonText: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  emptyMessage: { 
    fontSize: 18, 
    color: '#BBBBBB',
    textAlign: 'center',
  },
  // Add these styles to your StyleSheet

// Create Group Button Style
createGroupButton: {
  flexDirection: 'row',
  backgroundColor: 'rgba(76, 50, 171, 0.8)', // Purple color
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 10,
  marginBottom: 20,
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
  borderWidth: 1,
  borderColor: 'rgba(136, 116, 204, 0.5)', // Light purple border
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 5,
},
createGroupButtonText: {
  color: 'white',
  fontSize: 18,
  fontWeight: 'bold',
  letterSpacing: 0.5,
  marginRight: 10,
},
createGroupIcon: {
  marginLeft: 5,
},
  // Search Bar Styles
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(30, 30, 30, 0.7)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444444',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    height: 40,
  },
  filterButton: {
    padding: 12,
    backgroundColor: 'rgba(76, 50, 171, 0.8)',
    borderRadius: 8,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: 'rgba(136, 116, 204, 0.5)',
  },
  
  // Active Filters Styles
  activeFiltersContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.7)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  activeFiltersTitle: {
    color: '#BBBBBB',
    fontSize: 14,
    marginBottom: 8,
  },
  filterChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterChip: {
    flexDirection: 'row',
    backgroundColor: 'rgba(76, 50, 171, 0.7)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(136, 116, 204, 0.5)',
  },
  filterChipText: {
    color: 'white',
    marginRight: 8,
    fontSize: 14,
  },
  filterChipRemove: {
    padding: 2,
  },
  clearAllButton: {
    backgroundColor: 'rgba(180, 50, 50, 0.7)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(220, 76, 76, 0.5)',
  },
  clearAllText: {
    color: 'white',
    fontSize: 14,
  },
  
  // Results Count
  resultsCountContainer: {
    marginBottom: 16,
  },
  resultsCount: {
    color: '#BBBBBB',
    fontSize: 14,
    fontStyle: 'italic',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    paddingBottom: 15,
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  filterOptionsContainer: {
    maxHeight: '70%',
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    color: '#BBBBBB',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    backgroundColor: 'rgba(40, 40, 40, 0.8)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#444444',
  },
  filterOptionActive: {
    backgroundColor: 'rgba(76, 50, 171, 0.8)',
    borderColor: 'rgba(136, 116, 204, 0.7)',
  },
  filterOptionText: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  filterOptionTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#333333',
    paddingTop: 15,
  },
  clearFiltersButton: {
    backgroundColor: 'rgba(50, 50, 50, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444444',
  },
  clearFiltersText: {
    color: '#CCCCCC',
    fontSize: 16,
  },
  applyFiltersButton: {
    backgroundColor: 'rgba(76, 50, 171, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(136, 116, 204, 0.5)',
  },
  applyFiltersText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});