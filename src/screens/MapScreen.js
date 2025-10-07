import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import StorageService from '../services/StorageService';
import { openInExternalMaps } from '../utils/MapUtils';

export default function MapScreen() {
  const [checkIns, setCheckIns] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    loadCheckIns();
    getCurrentLocation();
  }, []);

  const loadCheckIns = async () => {
    try {
      const savedCheckIns = await StorageService.getCheckIns();
      setCheckIns(savedCheckIns);
    } catch (error) {
      console.error('Error loading check-ins:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setIsLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting current location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const focusOnCurrentLocation = () => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };


  const getInitialRegion = () => {
    if (currentLocation) {
      return {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }

    if (checkIns.length > 0) {
      const firstCheckIn = checkIns[0];
      return {
        latitude: firstCheckIn.latitude,
        longitude: firstCheckIn.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }

    // Default to a central location (e.g., New York)
    return {
      latitude: 40.7128,
      longitude: -74.0060,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={getInitialRegion()}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
      >
        {checkIns.map((checkIn, index) => (
          <Marker
            key={checkIn.id}
            coordinate={{
              latitude: checkIn.latitude,
              longitude: checkIn.longitude,
            }}
            title={checkIn.locationName || 'Check-in Location'}
            description={checkIn.note}
            pinColor="#007AFF"
            onCalloutPress={() => openInExternalMaps(
              checkIn.latitude,
              checkIn.longitude,
              checkIn.locationName
            )}
          />
        ))}
      </MapView>

      {currentLocation && (
        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={focusOnCurrentLocation}
        >
          <Ionicons name="locate" size={24} color="#007AFF" />
        </TouchableOpacity>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {checkIns.length} check-in{checkIns.length !== 1 ? 's' : ''} found
        </Text>
        <Text style={styles.helpText}>
          Tap markers to open in external maps
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentLocationButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
});
