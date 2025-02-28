import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import Login from './Login';

export default function Home() {
  return (
    <View style={styles.container}>
      <Login />
      <Link href="./SignUp" style={styles.link}>
        Don't have an account? Sign Up
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  link: {
    marginTop: 16,
    color: 'blue',
    textAlign: 'center',
  },
});
