import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#555',
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
        color: '#ff6b6b',
    },
    errorMessage: {
        marginTop: 8,
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 20,
        backgroundColor: '#4a90e2',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },

    // Search and Filter Styles
    searchContainer: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'center',
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        elevation: 2,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
    },
    filterButton: {
        padding: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        marginLeft: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    activeFilterButton: {
        backgroundColor: '#4a90e2',
        borderColor: '#3a80d2',
    },

    // Active Filters Styles
    activeFiltersContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    activeFiltersTitle: {
        color: '#666',
        fontSize: 14,
        marginBottom: 8,
    },
    filterChipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    filterChip: {
        flexDirection: 'row',
        backgroundColor: '#e8f4fd',
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginRight: 8,
        marginBottom: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#c5e1f9',
    },
    filterChipText: {
        color: '#4a90e2',
        marginRight: 4,
        fontSize: 14,
    },
    filterChipRemove: {
        padding: 2,
    },
    clearAllButton: {
        backgroundColor: '#ffeeee',
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#ffcccc',
    },
    clearAllText: {
        color: '#ff6b6b',
        fontSize: 14,
    },

    // Results count
    resultsContainer: {
        marginBottom: 12,
    },
    resultsText: {
        color: '#666',
        fontSize: 14,
        fontStyle: 'italic',
    },

    // Workout Item Styles
    workoutItem: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    workoutName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    workoutDetails: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    detailText: {
        marginLeft: .5,
        color: '#555',
        fontSize: 14,
    },
    targetContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    targetLabel: {
        color: '#666',
        fontSize: 14,
        fontWeight: '500',
    },
    targetText: {
        color: '#666',
        fontSize: 14,
    },

    // Empty State
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    clearFiltersButton: {
        marginTop: 16,
        backgroundColor: '#f0f0f0',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    clearFiltersText: {
        color: '#555',
        fontWeight: '500',
    },

    // Create Button
    createButton: {
        position: 'absolute',
        right: 24,
        bottom: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#4a90e2',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    filterOptionsContainer: {
        maxHeight: '70%',
    },
    filterSection: {
        marginBottom: 20,
    },
    filterSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    filterOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    filterOption: {
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    filterOptionActive: {
        backgroundColor: '#e8f4fd',
        borderColor: '#c5e1f9',
    },
    filterOptionText: {
        color: '#666',
    },
    filterOptionTextActive: {
        color: '#4a90e2',
        fontWeight: '500',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    clearFiltersModalButton: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    clearFiltersModalText: {
        color: '#666',
        fontWeight: '500',
    },
    applyFiltersButton: {
        backgroundColor: '#4a90e2',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    applyFiltersText: {
        color: 'white',
        fontWeight: 'bold',
    },
});