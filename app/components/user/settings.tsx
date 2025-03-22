import React, { useContext, useState, useEffect } from 'react';
import { 
  View, 
  TextInput,  
  Text, 
  Alert, 
  ImageBackground, 
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Add this import
import { updateUser, deleteUser } from '@/app/services/api/userApi';
import { getTrainerByUserId } from '@/app/services/api/trainerApi';
import { UserContext } from '../../context/UserContext';
import { AuthContext } from '../../context/AuthContext'; // Add this import
import { styles } from '../styles/userSettingsStyle';
export default function UserSettings() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error('UserSettings must be wrapped in a UserProvider');
  }
  const { user, refreshUser } = userContext;
  
  // Get values from AuthContext with proper destructuring
  const auth = useContext(AuthContext);
  console.log("Auth context value:", auth); // Add this debug line
  
  const { isAuthenticated, isTrainer = false } = auth || {};
  console.log("Is trainer value:", isTrainer); // Add this debug line
  
  const router = useRouter();

  const [name, setName] = useState('');
  const [level, setLevel] = useState('');
  const [availability, setAvailability] = useState('');
  const [accountStatus, setAccountStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasTrainerProfile, setHasTrainerProfile] = useState(false);
  const [checkingTrainerStatus, setCheckingTrainerStatus] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setLevel(user.level || '');
      setAvailability(user.availability || '');
      setAccountStatus(user.accountStatus || '');
    }
  }, [user]);

  useEffect(() => {
    // Check if user has a trainer profile when component mounts
    const checkTrainerProfile = async () => {
      if (!user || !user._id) {
        setHasTrainerProfile(false);
        setCheckingTrainerStatus(false);
        return;
      }
      
      try {
        const trainerData = await getTrainerByUserId(user._id);
        console.log("Trainer profile found:", trainerData);
        setHasTrainerProfile(true);
      } catch (error) {
        console.log("Error checking trainer profile:", error.message);
        setHasTrainerProfile(false);
      } finally {
        setCheckingTrainerStatus(false);
      }
    };
    
    checkTrainerProfile();
  }, [user]);

  const handleUpdate = async () => {
    try {
      setIsSubmitting(true);
      if (!user || !user._id) throw new Error('User not loaded yet.');
      const updatedUser = { name, level, availability, accountStatus };
      await updateUser(user._id, updatedUser);

      // After updating on the server, refresh the user in context
      await refreshUser();
      
      Alert.alert('Success', 'Profile updated successfully');
      setError(null);
    } catch (err) {
      console.error('Failed to update user:', err);
      setError('Failed to update user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !user._id) return;
    Alert.alert(
      'Delete Account', 
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsSubmitting(true);
              await deleteUser(user._id);
              router.push('/');
            } catch (err) {
              console.error('Failed to delete user:', err);
              setError('Failed to delete user. Please try again.');
              setIsSubmitting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ImageBackground 
      source={{uri:'https://i.pinimg.com/736x/86/da/d0/86dad02018fc7eaeb628c94b5705fef3.jpg'}}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
          >
            <Text style={styles.title}>Profile Settings</Text>
            {user ? (
              <View style={styles.form}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    placeholderTextColor="#888"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Skill Level</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Beginner, Intermediate, Advanced, etc."
                    placeholderTextColor="#888"
                    value={level}
                    onChangeText={setLevel}
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Availability</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="When are you usually available?"
                    placeholderTextColor="#888"
                    value={availability}
                    onChangeText={setAvailability}
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Account Status</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Active, Inactive, etc."
                    placeholderTextColor="#888"
                    value={accountStatus}
                    onChangeText={setAccountStatus}
                  />
                </View>

                {error && <Text style={styles.error}>{error}</Text>}

                <TouchableOpacity 
                  style={styles.updateButton} 
                  onPress={handleUpdate}
                  disabled={isSubmitting}
                >
                  <Text style={styles.buttonText}>
                    {isSubmitting ? 'Updating...' : 'Update Profile'}
                  </Text>
                </TouchableOpacity>
                
                {/* Use isTrainer from AuthContext instead of user.isTrainer */}
                {!checkingTrainerStatus && (
                  <TouchableOpacity 
                    style={[styles.trainerButton, hasTrainerProfile ? 
                      {backgroundColor: '#4CAF50'} : // Green for edit
                      {backgroundColor: '#FF9800'}   // Orange for create
                    ]}
                    onPress={() => router.push(hasTrainerProfile ? '/trainer/me/edit' : '/trainer/new/edit')}
                  >
                    <Ionicons 
                      name={hasTrainerProfile ? "fitness-outline" : "create-outline"} 
                      size={20} 
                      color="white" 
                      style={styles.buttonIcon} 
                    />
                    <Text style={styles.buttonText}>
                      {hasTrainerProfile ? "Edit Trainer Profile" : "Create Trainer Profile"}
                    </Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  style={styles.deleteButton} 
                  onPress={handleDelete}
                  disabled={isSubmitting}
                >
                  <Text style={styles.buttonText}>Delete Account</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading user information...</Text>
              </View>
            )}
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
      
      {/* Add this debugging view */}
      <View style={styles.debugContainer}>
        <Text style={styles.debugText}>Auth context available: {auth ? 'Yes' : 'No'}</Text>
        <Text style={styles.debugText}>Is trainer: {isTrainer ? 'Yes' : 'No'}</Text>
        <Text style={styles.debugText}>Trainer status: {checkingTrainerStatus ? 'Checking...' : hasTrainerProfile ? 'Yes' : 'No'}</Text>
      </View>
    </ImageBackground>
  );
}


