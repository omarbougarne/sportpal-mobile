import React from 'react';
import { ImageBackground, StyleSheet, SafeAreaView } from 'react-native';
import Login from './Login';

export default function Home() {
  return (
    <ImageBackground 
      source={{uri:'https://i.pinimg.com/736x/86/da/d0/86dad02018fc7eaeb628c94b5705fef3.jpg'}}// Update 
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <Login />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});
