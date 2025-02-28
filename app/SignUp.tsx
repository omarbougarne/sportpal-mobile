import { signUp } from "@/app/services/api/authApi";
import { SignUpData } from "@/app/types/auth";
import { useState } from "react";
import { TextInput, Button } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
    
  const handleSignUp = async () => {
    try {
      const userData: SignUpData = { name, email, password };
      const response = await signUp(userData);
      console.log('User signed up successfully:', response);
      // Navigate to the login screen after successful signup
      router.push('./Login');
    } catch (error) {
      setError('Failed to sign up. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input}
        placeholder='Name...'
        value={name}
        onChangeText={setName}
      />
      <TextInput 
        style={styles.input}
        placeholder='Email...'
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput 
        style={styles.input}
        placeholder='Password***'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
});