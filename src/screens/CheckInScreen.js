import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LocationService from '../services/LocationService';
import StorageService from '../services/StorageService';

export default function CheckInScreen() {
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationName, setLocationName] = useState('');

  const getCurrentLocation = async () => {
    setIsLoading(true);
    try {
      const location = await LocationService.getCurrentLocation();
      setCurrentLocation(location);
      
      const name = await LocationService.getLocationName(location.latitude, location.longitude);
      setLocationName(name);
    } catch (error) {
      Alert.alert('Error', 'Could not get your location. Please make sure location services are enabled.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!currentLocation) {
      Alert.alert('Error', 'Please get your current location first.');
      return;
    }

    if (!note.trim()) {
      Alert.alert('Error', 'Please enter a note for your check-in.');
      return;
    }

    setIsLoading(true);
    try {
      const checkIn = {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        note: note.trim(),
        locationName: locationName,
        accuracy: currentLocation.accuracy,
      };

      await StorageService.saveCheckIn(checkIn);
      
      Alert.alert(
        'Success!',
        'Check-in saved successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              setNote('');
              setCurrentLocation(null);
              setLocationName('');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Could not save check-in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Ionicons name="location" size={48} color="#007AFF" />
            <Text style={styles.title}>Check In</Text>
            <Text style={styles.subtitle}>Share your current location with a note</Text>
          </View>

          <View style={styles.locationSection}>
            <TouchableOpacity
              style={[styles.locationButton, isLoading && styles.disabledButton]}
              onPress={getCurrentLocation}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="locate" size={24} color="#fff" />
                  <Text style={styles.locationButtonText}>Get Current Location</Text>
                </>
              )}
            </TouchableOpacity>

            {currentLocation && (
              <View style={styles.locationInfo}>
                <Text style={styles.locationLabel}>Current Location:</Text>
                <Text style={styles.locationText}>{locationName}</Text>
                <Text style={styles.coordinatesText}>
                  {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                </Text>
                <Text style={styles.accuracyText}>
                  Accuracy: ±{Math.round(currentLocation.accuracy)}m
                </Text>
              </View>
            )}
          </View>

          <View style={styles.noteSection}>
            <Text style={styles.noteLabel}>Add a note:</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="What are you doing here?"
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.checkInButton,
              (!currentLocation || !note.trim() || isLoading) && styles.disabledButton
            ]}
            onPress={handleCheckIn}
            disabled={!currentLocation || !note.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color="#fff" />
                <Text style={styles.checkInButtonText}>Check In</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  locationSection: {
    marginBottom: 30,
  },
  locationButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  locationInfo: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  locationText: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 5,
  },
  coordinatesText: {
    fontSize: 12,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  accuracyText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  noteSection: {
    marginBottom: 30,
  },
  noteLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  noteInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
  },
  checkInButton: {
    backgroundColor: '#34C759',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
  },
  checkInButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});
