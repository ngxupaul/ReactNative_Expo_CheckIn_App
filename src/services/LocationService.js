import * as Location from 'expo-location';

class LocationService {
  static async requestLocationPermission() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission not granted');
      }
      return true;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  static async getCurrentLocation() {
    try {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        throw new Error('Location permission not granted');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      throw error;
    }
  }

  static async getLocationName(latitude, longitude) {
    try {
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode.length > 0) {
        const location = reverseGeocode[0];
        return `${location.street || ''} ${location.city || ''} ${location.region || ''} ${location.country || ''}`.trim();
      }
      return 'Unknown Location';
    } catch (error) {
      console.error('Error getting location name:', error);
      return 'Unknown Location';
    }
  }
}

export default LocationService;
