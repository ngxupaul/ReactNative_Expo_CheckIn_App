# Geo-Checkin App

**Student**: Nguyen Xuan Phong  
**Student ID**: 22IT221

A React Native Expo app for location-based check-ins with map visualization.

## Features

- **Location Check-in**: Get current GPS location and add notes
- **Map View**: Display all check-ins on an interactive map
- **List View**: Browse all check-ins in a chronological list
- **External Maps**: Open locations in Google Maps or Apple Maps
- **Local Storage**: All check-ins are saved locally using AsyncStorage

## Requirements

- Node.js
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your preferred platform:
```bash
npm run ios     # iOS
npm run android # Android
npm run web     # Web
```

## Permissions

The app requires location permissions to function properly:
- **iOS**: Location When In Use permission
- **Android**: ACCESS_FINE_LOCATION and ACCESS_COARSE_LOCATION

## Usage

1. **Check In**: 
   - Tap "Get Current Location" to fetch your GPS coordinates
   - Add a note describing what you're doing
   - Tap "Check In" to save your location

2. **Map View**:
   - View all your check-ins as markers on the map
   - Tap markers to see details
   - Tap marker callouts to open in external maps
   - Use the location button to center on your current position

3. **List View**:
   - Browse all check-ins chronologically
   - Tap "Open in Maps" to view in external apps
   - Delete individual check-ins or clear all

## Dependencies

- `expo-location`: GPS location services
- `react-native-maps`: Interactive map component
- `@react-native-async-storage/async-storage`: Local data storage
- `@react-navigation/native`: Navigation between screens
- `@react-navigation/bottom-tabs`: Tab navigation

## Data Structure

Check-ins are stored with the following structure:
```javascript
{
  id: string,
  latitude: number,
  longitude: number,
  note: string,
  locationName: string,
  accuracy: number,
  timestamp: string
}
```

## External Maps Integration

The app supports opening locations in:
- **iOS**: Apple Maps (native)
- **Android**: Google Maps (native)
- **Fallback**: Google Maps web version

## Development

To modify the app:
1. Edit files in the `src/` directory
2. The app will hot-reload automatically
3. Test on both iOS and Android for best compatibility

## Screenshots

Below are sample screenshots of the app:

![Screenshot 1](public/images/Screenshot%202025-10-07%20at%2014.12.56.png)

![Screenshot 2](public/images/Screenshot%202025-10-07%20at%2014.13.06.png)

![Screenshot 3](public/images/Screenshot%202025-10-07%20at%2014.13.24.png)

![Screenshot 4](public/images/Screenshot%202025-10-07%20at%2014.13.36.png)
