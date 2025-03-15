import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Text, 
  ImageBackground,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity, 
  Alert
} from 'react-native';
import { signup } from '@/app/services/api/authApi';
import { useRouter } from 'expo-router';
import CustomDropdown from '@/app/components/CustomDropDown'; // Import the custom dropdown component

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const [role, setRole] = useState('User'); // Default role
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      // Validation
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const signupData = { name: fullName, email, password };
      const response = await signup(signupData);
      
      if (response.requiresLogin) {
        // Show message to user
        Alert.alert(
          "Account Created", 
          "Your account has been created. Please log in with your credentials.",
          [{ text: "OK", onPress: () => router.push('/') }]
        );
      } else {
        // Token was received and stored, redirect to main app
        router.push('/(tabs)');
      }
    } catch (error) {
      console.error('Failed to sign up:', error);
      setError('Failed to sign up. Please try again.');
    }
  };

  const handleLogin = () => {
    router.push('/');
  };

  return (
    <ImageBackground 
      source={{uri:'https://i.pinimg.com/736x/86/da/d0/86dad02018fc7eaeb628c94b5705fef3.jpg'}}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.formContainer}
        >
          <View style={styles.overlay}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join SportPal Today</Text>
            
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#fff"
                value={fullName}
                onChangeText={setFullName}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#fff"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#fff"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#fff"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              
              {/* <CustomDropdown
                label="Role"
                options={['User', 'Organizer', 'Admin', 'Trainer']}
                selectedValue={role}
                onValueChange={setRole}
              /> */}
              
              {error && <Text style={styles.error}>{error}</Text>}
              
              <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
                <Text style={styles.signupButtonText}>Sign Up</Text>
              </TouchableOpacity>
              
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={handleLogin}>
                  <Text style={styles.loginLink}>Log In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
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
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  
  // Typography Styles
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 30,
  },
  
  // Form Elements
  form: {
    width: '100%',
  },
  input: {
    height: 50,
    backgroundColor: 'rgba(34, 34, 34, 0.5)',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: 'white',
  },
  error: {
    color: '#ff6b6b',
    marginBottom: 15,
    textAlign: 'center',
  },
  
  // Buttons
  signupButton: {
    backgroundColor: 'rgba(0, 0, 0, 1)',
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#444444',
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Login Link
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: 'white',
  },
  loginLink: {
    color: 'rgb(9, 148, 255)',
    fontWeight: 'bold',
  }
});