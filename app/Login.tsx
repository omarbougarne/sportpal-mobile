import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from 'react-native';
import { login } from '@/app/services/api/authApi';
import { useRouter } from 'expo-router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      console.log('Attempting to log in with email:', email);
      const loginData = { email, password };
      const response = await login(loginData);
      console.log('User logged in successfully:', response);
      router.push('/(tabs)');
    } catch (error) {
      console.error('Failed to log in:', error);
      setError('Failed to log in. Please try again.');
    }
  };

  const handleSignup = () => {
    router.push('/SignUp');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.formContainer}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>SportPal</Text>
        <Text style={styles.subtitle}>Connect & Train Together</Text>
        
        <View style={styles.form}>
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
          
          {error && <Text style={styles.error}>{error}</Text>}
          
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
          
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignup}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    padding: 16,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#DDDDDD',
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  
  // Error Messaging
  error: {
    color: '#ff6b6b',
    marginBottom: 15,
    textAlign: 'center',
  },
  
  // Buttons
  loginButton: {
    backgroundColor: 'rgba(0, 0, 0, 1)',
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#444444',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
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
  submitButton: {
    backgroundColor: '#333333',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#444444',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  disabledButton: {
    opacity: 0.7,
  },
  cancelButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#333333',
  },
  cancelButtonText: {
    color: '#BBBBBB',
    fontSize: 16,
  },
  
  // Sign Up/Login Link Area
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: 'white',
  },
  signupLink: {
    color: 'rgb(9, 148, 255)',
    fontWeight: 'bold',
  },
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
  },
  
  // Exercise Components
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  exerciseInput: {
    flex: 1,
  },
  removeButton: {
    marginLeft: 10,
    padding: 5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  addButtonText: {
    color: '#BBBBBB',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  
  // Dropdown/Picker Components
  customPickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#222222',
  },
  pickerText: {
    fontSize: 16,
    color: 'white',
  },
  dropdownArrow: {
    fontSize: 14,
    color: '#BBBBBB',
  },
  dropdownList: {
    position: 'absolute',
    top: 85,
    left: 0,
    right: 0,
    backgroundColor: '#333333',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 8,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#444444',
  },
  selectedDropdownItem: {
    backgroundColor: '#444444',
  },
  optionText: {
    fontSize: 16,
    color: '#DDDDDD',
  },
  selectedOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  
  // Layout Helpers
  spacer: {
    height: 40,
  },
});