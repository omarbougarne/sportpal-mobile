import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
}

interface LocationPickerProps {
  onLocationSelected: (location: LocationData) => void;
  initialLocation?: LocationData;
}

export default function LocationPicker({ onLocationSelected, initialLocation }: LocationPickerProps) {
  const [location, setLocation] = useState<LocationData | null>(initialLocation || null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Get current location when component mounts
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        
        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setLoading(false);
          return;
        }

        // Get current location
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        // Reverse geocode to get address
        const geocodeResult = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        if (geocodeResult.length > 0) {
          const address = geocodeResult[0];
          const locationData = {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            address: `${address.street || ''} ${address.name || ''}`.trim(),
            city: address.city || address.region || '',
            country: address.country || '',
          };
          
          setLocation(locationData);
          onLocationSelected(locationData);
        }
      } catch (error) {
        setErrorMsg('Could not fetch location');
        console.error('Location error:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Refresh location manually
  const refreshLocation = async () => {
    try {
      setLoading(true);
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const geocodeResult = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (geocodeResult.length > 0) {
        const address = geocodeResult[0];
        const locationData = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          address: `${address.street || ''} ${address.name || ''}`.trim(),
          city: address.city || address.region || '',
          country: address.country || '',
        };
        
        setLocation(locationData);
        onLocationSelected(locationData);
      }
    } catch (error) {
      setErrorMsg('Could not refresh location');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.text}>Getting your location...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errorMsg}</Text>
        <TouchableOpacity style={styles.button} onPress={refreshLocation}>
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {location && (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Your location"
            />
          </MapView>
          
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>
              {location.address ? `${location.address}, ` : ''}
              {location.city ? `${location.city}, ` : ''}
              {location.country || ''}
            </Text>
          </View>
          
          <TouchableOpacity style={styles.refreshButton} onPress={refreshLocation}>
            <Ionicons name="refresh" size={24} color="white" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  text: {
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addressContainer: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 5,
    width: '90%',
    alignSelf: 'center',
  },
  addressText: {
    textAlign: 'center',
  },
  refreshButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 30,
  },
});