
import React, { useContext, useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Text, 
  Alert, 
  ImageBackground, 
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { updateUser, deleteUser } from '@/app/services/api/userApi';
import { UserContext } from '../../context/UserContext';

export default function UserSettings() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error('UserSettings must be wrapped in a UserProvider');
  }
  const { user, refreshUser } = userContext;
  const router = useRouter();

  const [name, setName] = useState('');
  const [level, setLevel] = useState('');
  const [availability, setAvailability] = useState('');
  const [accountStatus, setAccountStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setLevel(user.level || '');
      setAvailability(user.availability || '');
      setAccountStatus(user.accountStatus || '');
    }
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
  title: {
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#DDDDDD',
  },
  
  // Form Elements
  form: {
    width: '100%',
  },
  formGroup: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: 'rgba(34, 34, 34, 0.9)',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 5,
    paddingHorizontal: 15,
    fontSize: 16,
    color: 'white',
  },
  error: {
    color: '#ff6b6b',
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
  },
  
  // Button Styles
  updateButton: {
    backgroundColor: 'rgba(33, 150, 243, 0.9)',  // Material Blue
    paddingVertical: 14,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.5)',
  },
  deleteButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.9)',  // Material Red
    paddingVertical: 14,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(244, 67, 54, 0.5)',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  }
});
