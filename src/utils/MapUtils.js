import { Linking, Platform } from 'react-native';

export const openInExternalMaps = (latitude, longitude, title = 'Location') => {
  const label = encodeURIComponent(title);
  
  const urls = {
    ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
    android: `geo:0,0?q=${latitude},${longitude}(${label})`,
    web: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
  };

  const url = Platform.select(urls);

  return Linking.canOpenURL(url).then(supported => {
    if (supported) {
      return Linking.openURL(url);
    } else {
      // Fallback to Google Maps web
      return Linking.openURL(urls.web);
    }
  });
};

export const formatCoordinates = (latitude, longitude, precision = 6) => {
  return `${latitude.toFixed(precision)}, ${longitude.toFixed(precision)}`;
};

export const formatDistance = (distanceInMeters) => {
  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)}m`;
  } else {
    return `${(distanceInMeters / 1000).toFixed(1)}km`;
  }
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
};
