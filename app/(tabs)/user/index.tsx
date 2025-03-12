// app/(tabs)/user/index.tsx
import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { UserContext } from '../../context/UserContext';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error('ProfileScreen must be wrapped in a UserProvider');
  }

  const { user } = userContext;
  const router = useRouter();

  return (
    <ImageBackground 
      source={{uri:'https://i.pinimg.com/736x/86/da/d0/86dad02018fc7eaeb628c94b5705fef3.jpg'}}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.pageTitle}>My Profile</Text>
            
            {user ? (
              <View style={styles.profileContainer}>
                <View style={styles.avatarContainer}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{user.name ? user.name[0].toUpperCase() : '?'}</Text>
                  </View>
                  <Text style={styles.name}>{user.name || 'Anonymous'}</Text>
                </View>
                
                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Email:</Text>
                    <Text style={styles.infoValue}>{user.email || 'Not provided'}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Skill Level:</Text>
                    <Text style={styles.infoValue}>{user.level || 'Not specified'}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Availability:</Text>
                    <Text style={styles.infoValue}>{user.availability || 'Not specified'}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Status:</Text>
                    <View style={[
                      styles.statusBadge, 
                      user.accountStatus === 'Active' ? styles.activeStatus : styles.inactiveStatus
                    ]}>
                      <Text style={styles.statusText}>
                        {user.accountStatus || 'Unknown'}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => router.push('/user/settings')}
                >
                  <Ionicons name="settings-outline" size={18} color="white" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading user information...</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
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
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  // Typography Styles
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 24,
    marginTop: 20,
    textAlign: 'center',
    letterSpacing: 1,
  },
  loadingText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  
  // Profile Elements
  profileContainer: {
    width: '100%',
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(33, 150, 243, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 42,
    color: 'white',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  
  // Info Card
  infoCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#333333',
    marginBottom: 25,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    color: '#BBBBBB',
    fontWeight: 'bold',
    width: 100,
  },
  infoValue: {
    fontSize: 16,
    color: '#F0F0F0',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeStatus: {
    backgroundColor: 'rgba(76, 175, 80, 0.7)', // Green
  },
  inactiveStatus: {
    backgroundColor: 'rgba(158, 158, 158, 0.7)', // Gray
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  
  // Button Styles
  editButton: {
    backgroundColor: 'rgba(33, 150, 243, 0.9)',  // Material Blue
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.5)',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});