import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity,  
  ActivityIndicator,
  TextInput,
  Modal,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Workout } from '@/app/types/workout/workout';
import { styles } from '../styles/workoutListStyle';
interface FilterOptions {
  categories: string[];
  difficulties: string[];
  durations: string[];
  targetMuscles: string[];
}

interface WorkoutFilters {
  category: string;
  difficulty: string;
  duration: string;
  targetMuscle: string;
}

interface WorkoutListUIProps {
  workouts: Workout[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filters: WorkoutFilters;
  filterOptions: FilterOptions;
  filterModalVisible: boolean;
  onSearch: (query: string) => void;
  onFilterChange: (filterName: keyof WorkoutFilters, value: string) => void;
  onToggleFilter: (filterName: keyof WorkoutFilters, value: string) => void;
  onClearFilters: () => void;
  onToggleFilterModal: () => void;
  onWorkoutPress: (workout: Workout) => void;
  onCreatePress: () => void;
  onRefresh: () => void;
  totalCount: number;
  filteredCount: number;
}

export default function WorkoutListUI({
  workouts,
  loading,
  error,
  searchQuery,
  filters,
  filterOptions,
  filterModalVisible,
  onSearch,
  onFilterChange,
  onToggleFilter,
  onClearFilters,
  onToggleFilterModal,
  onWorkoutPress,
  onCreatePress,
  onRefresh,
  totalCount,
  filteredCount
}: WorkoutListUIProps) {
  
  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => value !== '');
  
  // Format duration label
  const formatDuration = (durationKey: string): string => {
    switch(durationKey) {
      case 'short': return 'Short (≤15 min)';
      case 'medium': return 'Medium (15-30 min)';
      case 'long': return 'Long (>30 min)';
      default: return durationKey;
    }
  };

  if (loading && workouts.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.loadingText}>Loading workouts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle" size={60} color="#ff6b6b" />
        <Text style={styles.errorTitle}>Error</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search and Filter Header */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#777" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search workouts..."
            value={searchQuery}
            onChangeText={onSearch}
            clearButtonMode="while-editing"
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => onSearch('')}>
              <Ionicons name="close-circle" size={20} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={[styles.filterButton, hasActiveFilters && styles.activeFilterButton]}
          onPress={onToggleFilterModal}
        >
          <Ionicons 
            name="options" 
            size={22} 
            color={hasActiveFilters ? "#fff" : "#555"} 
          />
        </TouchableOpacity>
      </View>
      
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersTitle}>Active Filters:</Text>
          <View style={styles.filterChipsContainer}>
            {filters.category && (
              <View style={styles.filterChip}>
                <Text style={styles.filterChipText}>Category: {filters.category}</Text>
                <TouchableOpacity 
                  onPress={() => onFilterChange('category', '')}
                  style={styles.filterChipRemove}
                >
                  <Ionicons name="close-circle" size={18} color="#666" />
                </TouchableOpacity>
              </View>
            )}
            
            {filters.difficulty && (
              <View style={styles.filterChip}>
                <Text style={styles.filterChipText}>Difficulty: {filters.difficulty}</Text>
                <TouchableOpacity 
                  onPress={() => onFilterChange('difficulty', '')}
                  style={styles.filterChipRemove}
                >
                  <Ionicons name="close-circle" size={18} color="#666" />
                </TouchableOpacity>
              </View>
            )}
            
            {filters.duration && (
              <View style={styles.filterChip}>
                <Text style={styles.filterChipText}>Duration: {formatDuration(filters.duration)}</Text>
                <TouchableOpacity 
                  onPress={() => onFilterChange('duration', '')}
                  style={styles.filterChipRemove}
                >
                  <Ionicons name="close-circle" size={18} color="#666" />
                </TouchableOpacity>
              </View>
            )}
            
            {filters.targetMuscle && (
              <View style={styles.filterChip}>
                <Text style={styles.filterChipText}>Target: {filters.targetMuscle}</Text>
                <TouchableOpacity 
                  onPress={() => onFilterChange('targetMuscle', '')}
                  style={styles.filterChipRemove}
                >
                  <Ionicons name="close-circle" size={18} color="#666" />
                </TouchableOpacity>
              </View>
            )}
            
            <TouchableOpacity 
              onPress={onClearFilters}
              style={styles.clearAllButton}
            >
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredCount === totalCount
            ? `${filteredCount} workouts available`
            : `${filteredCount} of ${totalCount} workouts`}
        </Text>
      </View>
      
      {/* Workout List */}
      <FlatList
        data={workouts}
        keyExtractor={(item) => item._id}
        refreshing={loading}
        onRefresh={onRefresh}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.workoutItem}
            onPress={() => onWorkoutPress(item)}
          >
            {/* Your existing workout item UI */}
            <Text style={styles.workoutName}>{item.name}</Text>
            <View style={styles.workoutDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="fitness" size={16} color="#4a90e2" />
                <Text style={styles.detailText}>{item.category}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="time" size={16} color="#4a90e2" />
                <Text style={styles.detailText}>{item.duration} min</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="speedometer" size={16} color="#4a90e2" />
                <Text style={styles.detailText}>{item.difficulty}</Text>
              </View>
            </View>
            {item.targetMuscles && item.targetMuscles.length > 0 && (
              <View style={styles.targetContainer}>
                <Text style={styles.targetLabel}>Targets: </Text>
                <Text style={styles.targetText}>{item.targetMuscles.join(', ')}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="fitness-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery || hasActiveFilters
                ? "No workouts match your search criteria"
                : "No workouts available yet"}
            </Text>
            {searchQuery || hasActiveFilters ? (
              <TouchableOpacity 
                style={styles.clearFiltersButton}
                onPress={() => {
                  onSearch('');
                  onClearFilters();
                }}
              >
                <Text style={styles.clearFiltersText}>Clear Search & Filters</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        }
      />
      
      {/* Create Workout Button */}
      <TouchableOpacity style={styles.createButton} onPress={onCreatePress}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
      
      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={onToggleFilterModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Workouts</Text>
              <TouchableOpacity onPress={onToggleFilterModal}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.filterOptionsContainer}>
              {/* Category Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Category</Text>
                <View style={styles.filterOptions}>
                  {filterOptions.categories.map(category => (
                    <TouchableOpacity 
                      key={category} 
                      style={[
                        styles.filterOption,
                        filters.category === category && styles.filterOptionActive
                      ]}
                      onPress={() => onToggleFilter('category', category)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        filters.category === category && styles.filterOptionTextActive
                      ]}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Difficulty Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Difficulty</Text>
                <View style={styles.filterOptions}>
                  {filterOptions.difficulties.map(difficulty => (
                    <TouchableOpacity 
                      key={difficulty} 
                      style={[
                        styles.filterOption,
                        filters.difficulty === difficulty && styles.filterOptionActive
                      ]}
                      onPress={() => onToggleFilter('difficulty', difficulty)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        filters.difficulty === difficulty && styles.filterOptionTextActive
                      ]}>
                        {difficulty}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Duration Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Duration</Text>
                <View style={styles.filterOptions}>
                  {filterOptions.durations.map(duration => (
                    <TouchableOpacity 
                      key={duration} 
                      style={[
                        styles.filterOption,
                        filters.duration === duration && styles.filterOptionActive
                      ]}
                      onPress={() => onToggleFilter('duration', duration)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        filters.duration === duration && styles.filterOptionTextActive
                      ]}>
                        {formatDuration(duration)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Target Muscle Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Target Muscle</Text>
                <View style={styles.filterOptions}>
                  {filterOptions.targetMuscles.map(muscle => (
                    <TouchableOpacity 
                      key={muscle} 
                      style={[
                        styles.filterOption,
                        filters.targetMuscle === muscle && styles.filterOptionActive
                      ]}
                      onPress={() => onToggleFilter('targetMuscle', muscle)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        filters.targetMuscle === muscle && styles.filterOptionTextActive
                      ]}>
                        {muscle}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.clearFiltersModalButton}
                onPress={onClearFilters}
              >
                <Text style={styles.clearFiltersModalText}>Clear All</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.applyFiltersButton}
                onPress={onToggleFilterModal}
              >
                <Text style={styles.applyFiltersText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

