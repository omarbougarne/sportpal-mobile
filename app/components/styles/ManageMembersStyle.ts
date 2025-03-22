import { StyleSheet } from 'react-native'
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingContainer: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'white',
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedMemberItem: {
    backgroundColor: '#e6f2ff',
    borderColor: '#2196F3',
  },
  organizerItem: {
    backgroundColor: '#fffbeb',
    borderColor: '#fbbf24',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  organizerAvatar: {
    backgroundColor: '#fbbf24',
  },
  checkboxContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: 40,
    height: 40,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
  },
  organizerLabel: {
    color: '#b45309',
    fontStyle: 'italic',
  },
  memberEmail: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  inviteButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    marginTop: 16,
  },
  inviteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 8,
  },
  batchActionButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  batchActionText: {
    color: 'white',
    fontWeight: '500',
  },
});