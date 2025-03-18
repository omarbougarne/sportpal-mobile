import React from 'react';
import { View, StyleSheet, ImageBackground, Alert } from 'react-native';
import CreateGroup from '@/app/components/group/CreateGroup';
import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'expo-router';

export default function CreateGroupScreen() {
  const { user } = useAuth();
  const router = useRouter();
  
  // Automatically redirect if not logged in
  React.useEffect(() => {
    if (!user || !user._id) {
      Alert.alert(
        'Authentication Required',
        'You need to be logged in to create a group.',
        [
          { text: 'OK', onPress: () => router.push('/') }
        ]
      );
    }
  }, [user, router]);
  
  // Don't render anything if not logged in
  if (!user || !user._id) {
    return null;
  }
  
  return (
    <ImageBackground 
      source={{uri:'https://i.pinimg.com/736x/86/da/d0/86dad02018fc7eaeb628c94b5705fef3.jpg'}}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <CreateGroup />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
});