import { signUp } from "@/services/api/authApi";
import { SignUpData } from "@/types/auth";
import { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { View } from "react-native-reanimated/lib/typescript/Animated";

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
    
  const handleSignUp = async () => {
    try{
      const userData: SignUpData = { name, email, password };
      const response = await signUp(userData)
      console.log('User signed up successfully:', response);
    }catch(error){
      setError('Failed to sign up. Please try again.');
    }
  }

  <View>
    <TextInput 
    style={}
    />
  </View>
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