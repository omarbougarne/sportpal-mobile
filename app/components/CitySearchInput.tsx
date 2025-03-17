import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface LocationItem {
  name: string;
  city: string;
  country?: string;
  coordinates: number[];
  display_name: string;
}

interface CitySearchInputProps {
  onLocationSelected: (location: LocationItem) => void;
}

export default function CitySearchInput({ onLocationSelected }: CitySearchInputProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (query.length > 2) {
        searchLocations(query);
      }
    }, 500);
    
    return () => clearTimeout(searchTimeout);
  }, [query]);
  
  const searchLocations = async (search: string) => {
    if (!search.trim()) return;
    
    setIsSearching(true);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`
      );
      
      const data = await response.json();
      setResults(data.slice(0, 5)); // Limit to 5 results
    } catch (error) {
      console.error('Error searching locations:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleSelectLocation = (item: any) => {
    const location = {
      name: item.display_name.split(',')[0],
      city: item.address?.city || item.address?.town || item.display_name.split(',')[0],
      country: item.address?.country || '',
      coordinates: [parseFloat(item.lon), parseFloat(item.lat)],
      display_name: item.display_name
    };
    
    onLocationSelected(location);
    setQuery(location.city);
    setResults([]);
  };
  
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder="Search for city..."
        placeholderTextColor="#999"
      />
      
      {isSearching && (
        <ActivityIndicator style={styles.loadingIndicator} color="#FFF" />
      )}
      
      {results.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={results}
            keyExtractor={(item) => item.place_id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.resultItem}
                onPress={() => handleSelectLocation(item)}
              >
                <Text style={styles.resultText}>{item.display_name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: 'white',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
  },
  loadingIndicator: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  resultsContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(40, 40, 40, 0.95)',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    zIndex: 999,
    maxHeight: 200,
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  resultText: {
    color: 'white',
    fontSize: 14,
  }
});