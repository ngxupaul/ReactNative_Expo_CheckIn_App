import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import CheckInScreen from './src/screens/CheckInScreen';
import MapScreen from './src/screens/MapScreen';
import ListScreen from './src/screens/ListScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'CheckIn') {
              iconName = focused ? 'location' : 'location-outline';
            } else if (route.name === 'Map') {
              iconName = focused ? 'map' : 'map-outline';
            } else if (route.name === 'List') {
              iconName = focused ? 'list' : 'list-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen 
          name="CheckIn" 
          component={CheckInScreen} 
          options={{ title: 'Check In' }}
        />
        <Tab.Screen 
          name="Map" 
          component={MapScreen} 
          options={{ title: 'Map View' }}
        />
        <Tab.Screen 
          name="List" 
          component={ListScreen} 
          options={{ title: 'Check-ins List' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
