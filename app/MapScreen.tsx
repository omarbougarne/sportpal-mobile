import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { getNearbyGroups } from '@/app/services/api/groupApi';
import { Ionicons } from '@expo/vector-icons';

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<any>(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        // Get location permission
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          setLoading(false);
          return;
        }

        // Get current location
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
        
        // Fetch nearby groups
        const nearbyGroups = await getNearbyGroups(
          location.coords.latitude,
          location.coords.longitude,
          5000 // 5 km radius
        );
        
        setGroups(nearbyGroups);
      } catch (err) {
        console.error('Error loading map data:', err);
        setError('Failed to load map data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const navigateToGroup = (groupId) => {
    router.push(`./groups/${groupId}`);
  };

  const refreshLocation = async () => {
    try {
      setLoading(true);
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
      
      const nearbyGroups = await getNearbyGroups(
        location.coords.latitude,
        location.coords.longitude,
        5000
      );
      
      setGroups(nearbyGroups);
    } catch (err) {
      console.error('Error refreshing location:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Nearby Groups" }} />
      
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Loading map...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.button} onPress={refreshLocation}>
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <MapView 
              style={styles.map}
              initialRegion={{
                latitude: userLocation?.coords.latitude || 0,
                longitude: userLocation?.coords.longitude || 0,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              {/* User location marker */}
              {userLocation && (
                <Marker
                  coordinate={{
                    latitude: userLocation.coords.latitude,
                    longitude: userLocation.coords.longitude,
                  }}
                  title="Your location"
                  pinColor="blue"
                >
                  <Callout>
                    <Text>You are here</Text>
                  </Callout>
                </Marker>
              )}
              
              {/* Group markers */}
              {groups.map(group => (
                <Marker
                  key={group._id}
                  coordinate={{
                    latitude: group.coordinates?.coordinates[1] || 0,
                    longitude: group.coordinates?.coordinates[0] || 0,
                  }}
                  title={group.name}
                  pinColor="red"
                >
                  <Callout onPress={() => navigateToGroup(group._id)}>
                    <View style={styles.callout}>
                      <Text style={styles.calloutTitle}>{group.name}</Text>
                      <Text>{group.sport}</Text>
                      <Text style={styles.calloutAction}>Tap to view details</Text>
                    </View>
                  </Callout>
                </Marker>
              ))}
            </MapView>
            
            <TouchableOpacity 
              style={styles.refreshButton} 
              onPress={refreshLocation}
            >
              <Ionicons name="refresh" size={24} color="white" />
            </TouchableOpacity>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  callout: {
    width: 160,
    padding: 5,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  calloutAction: {
    marginTop: 5,
    color: '#2196F3',
    fontSize: 12,
  },
  refreshButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});