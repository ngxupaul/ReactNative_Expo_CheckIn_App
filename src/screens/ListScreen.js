import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import StorageService from '../services/StorageService';
import { openInExternalMaps, formatCoordinates } from '../utils/MapUtils';
import { formatDate, formatFullDate } from '../utils/DateUtils';

export default function ListScreen() {
  const [checkIns, setCheckIns] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadCheckIns = async () => {
    try {
      const savedCheckIns = await StorageService.getCheckIns();
      setCheckIns(savedCheckIns);
    } catch (error) {
      console.error('Error loading check-ins:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCheckIns();
    }, [])
  );

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadCheckIns();
    setIsRefreshing(false);
  };

  const deleteCheckIn = (checkInId) => {
    Alert.alert(
      'Delete Check-in',
      'Are you sure you want to delete this check-in?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await StorageService.deleteCheckIn(checkInId);
            if (success) {
              loadCheckIns();
            } else {
              Alert.alert('Error', 'Could not delete check-in.');
            }
          },
        },
      ]
    );
  };


  const clearAllCheckIns = () => {
    Alert.alert(
      'Clear All Check-ins',
      'Are you sure you want to delete all check-ins? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            const success = await StorageService.clearAllCheckIns();
            if (success) {
              setCheckIns([]);
            } else {
              Alert.alert('Error', 'Could not clear check-ins.');
            }
          },
        },
      ]
    );
  };


  const renderCheckIn = ({ item }) => (
    <View style={styles.checkInItem}>
      <View style={styles.checkInHeader}>
        <View style={styles.locationIcon}>
          <Ionicons name="location" size={20} color="#007AFF" />
        </View>
        <View style={styles.checkInInfo}>
          <Text style={styles.locationName} numberOfLines={1}>
            {item.locationName || 'Unknown Location'}
          </Text>
          <Text style={styles.timestamp}>
            {formatDate(item.timestamp)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteCheckIn(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.note} numberOfLines={3}>
        {item.note}
      </Text>
      
      <View style={styles.coordinatesContainer}>
        <Text style={styles.coordinates}>
          {formatCoordinates(item.latitude, item.longitude)}
        </Text>
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => openInExternalMaps(
            item.latitude,
            item.longitude,
            item.locationName
          )}
        >
          <Ionicons name="map-outline" size={16} color="#007AFF" />
          <Text style={styles.mapButtonText}>Open in Maps</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="location-outline" size={64} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No Check-ins Yet</Text>
      <Text style={styles.emptyStateText}>
        Start by checking in at your current location!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {checkIns.length > 0 && (
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {checkIns.length} Check-in{checkIns.length !== 1 ? 's' : ''}
          </Text>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearAllCheckIns}
          >
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={checkIns}
        renderItem={renderCheckIn}
        keyExtractor={(item) => item.id}
        contentContainerStyle={checkIns.length === 0 ? styles.emptyContainer : styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  clearButtonText: {
    color: '#FF3B30',
    fontSize: 14,
    marginLeft: 4,
  },
  listContainer: {
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkInItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  checkInHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationIcon: {
    marginRight: 12,
  },
  checkInInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  deleteButton: {
    padding: 4,
  },
  note: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 12,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coordinates: {
    fontSize: 12,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    flex: 1,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f0f8ff',
    borderRadius: 6,
  },
  mapButtonText: {
    color: '#007AFF',
    fontSize: 12,
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});
