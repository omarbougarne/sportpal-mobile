import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '@/app/context/AuthContext';
import { getTrainerByUserId } from '@/app/services/api/trainerApi';
import TrainerProfileContainer from '@/app/containers/trainer/TrainerProfileContainer';
import TrainersListContainer from '@/app/containers/trainer/TrainersListContainer';

export default function TrainerIndex() {
  const router = useRouter();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [hasTrainerProfile, setHasTrainerProfile] = useState<boolean | null>(null); // null means still loading
  const [loading, setLoading] = useState(true);
  const [showTrainersList, setShowTrainersList] = useState(false); // Toggle between profile and trainers list

  useEffect(() => {
    checkTrainerProfile();
  }, [user]);

  const checkTrainerProfile = async () => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      setHasTrainerProfile(false);
      return;
    }

    try {
      setLoading(true);
      const trainerData = await getTrainerByUserId(user._id);
      setHasTrainerProfile(!!trainerData);
    } catch (error) {
      console.error('Error checking trainer profile:', error);
      setHasTrainerProfile(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = () => {
    router.push('/trainer/new');
  };

  // Toggle between my profile and trainers list views
  const toggleView = () => {
    setShowTrainersList(prev => !prev);
  };

  // If still loading, show a loading indicator
  if (loading) {
    return (
      <ImageBackground 
        source={{uri:'https://i.pinimg.com/736x/86/da/d0/86dad02018fc7eaeb628c94b5705fef3.jpg'}}
        style={styles.backgroundImage}
      >
        <View style={[styles.overlay, styles.centerContainer]}>
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text style={styles.loadingText}>Loading trainer profile...</Text>
        </View>
      </ImageBackground>
    );
  }

  // If not authenticated, show a login prompt
  if (!isAuthenticated) {
    return (
      <ImageBackground 
        source={{uri:'https://i.pinimg.com/736x/86/da/d0/86dad02018fc7eaeb628c94b5705fef3.jpg'}}
        style={styles.backgroundImage}
      >
        <View style={[styles.overlay, styles.centerContainer]}>
          <Ionicons name="lock-closed" size={60} color="#ff6b6b" />
          <Text style={styles.title}>Authentication Required</Text>
          <Text style={styles.subtitle}>Please log in to access trainer features</Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/')}
          >
            <Text style={styles.buttonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  // If user doesn't have a trainer profile, show create profile option
  if (!hasTrainerProfile) {
    return (
      <ImageBackground 
        source={{uri:'https://i.pinimg.com/736x/86/da/d0/86dad02018fc7eaeb628c94b5705fef3.jpg'}}
        style={styles.backgroundImage}
      >
        <View style={[styles.overlay, styles.centerContainer]}>
          <Ionicons name="fitness" size={60} color="#4a90e2" />
          <Text style={styles.title}>Become a Trainer</Text>
          <Text style={styles.subtitle}>Share your expertise and create workout plans for others</Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={handleCreateProfile}
          >
            <Text style={styles.buttonText}>Create Trainer Profile</Text>
          </TouchableOpacity>
          
          {/* Add option to browse trainers even if user isn't a trainer yet */}
          <TouchableOpacity 
  style={styles.secondaryButton}
  onPress={() => router.push('/booking/new')}
>
  <Text style={styles.secondaryButtonText}>Browse Trainers</Text>
</TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  // If showing trainers list, display that with toggle button
  if (showTrainersList) {
    return (
      <View style={styles.container}>
        <View style={styles.toggleBar}>
          <TouchableOpacity 
            style={[styles.toggleButton, !showTrainersList && styles.activeToggle]} 
            onPress={toggleView}
          >
            <Ionicons name="person" size={20} color={showTrainersList ? "#777" : "#fff"} />
            <Text style={[styles.toggleText, !showTrainersList && styles.activeToggleText]}>My Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.toggleButton, showTrainersList && styles.activeToggle]} 
            onPress={toggleView}
          >
            <Ionicons name="people" size={20} color={!showTrainersList ? "#777" : "#fff"} />
            <Text style={[styles.toggleText, showTrainersList && styles.activeToggleText]}>All Trainers</Text>
          </TouchableOpacity>
        </View>
        
        <TrainersListContainer />
      </View>
    );
  }

  // If user has a trainer profile and wants to see their profile, show that with toggle button
  return (
    <View style={styles.container}>
      <View style={styles.toggleBar}>
        <TouchableOpacity 
          style={[styles.toggleButton, !showTrainersList && styles.activeToggle]} 
          onPress={toggleView}
        >
          <Ionicons name="person" size={20} color={showTrainersList ? "#777" : "#fff"} />
          <Text style={[styles.toggleText, !showTrainersList && styles.activeToggleText]}>My Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.toggleButton, showTrainersList && styles.activeToggle]} 
          onPress={toggleView}
        >
          <Ionicons name="people" size={20} color={!showTrainersList ? "#777" : "#fff"} />
          <Text style={[styles.toggleText, showTrainersList && styles.activeToggleText]}>All Trainers</Text>
        </TouchableOpacity>
      </View>
      
      <TrainerProfileContainer />
    </View>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    flex: 1,
  },
  
  // Typography
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#DDDDDD',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#DDDDDD',
    fontWeight: 'bold',
  },
  
  // Buttons
  button: {
    backgroundColor: 'rgba(33, 150, 243, 0.9)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.5)',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Toggle Bar
  toggleBar: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    margin: 10,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 6,
  },
  activeToggle: {
    backgroundColor: '#4a90e2',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginLeft: 6,
  },
  activeToggleText: {
    color: 'white',
    fontWeight: 'bold',
  },
});