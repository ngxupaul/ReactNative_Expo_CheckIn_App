import AsyncStorage from '@react-native-async-storage/async-storage';

const CHECKINS_KEY = 'checkins';

class StorageService {
  static async saveCheckIn(checkIn) {
    try {
      const existingCheckIns = await this.getCheckIns();
      const newCheckIn = {
        id: Date.now().toString(),
        ...checkIn,
        timestamp: new Date().toISOString(),
      };
      
      const updatedCheckIns = [newCheckIn, ...existingCheckIns];
      await AsyncStorage.setItem(CHECKINS_KEY, JSON.stringify(updatedCheckIns));
      return newCheckIn;
    } catch (error) {
      console.error('Error saving check-in:', error);
      throw error;
    }
  }

  static async getCheckIns() {
    try {
      const checkIns = await AsyncStorage.getItem(CHECKINS_KEY);
      return checkIns ? JSON.parse(checkIns) : [];
    } catch (error) {
      console.error('Error getting check-ins:', error);
      return [];
    }
  }

  static async deleteCheckIn(checkInId) {
    try {
      const existingCheckIns = await this.getCheckIns();
      const updatedCheckIns = existingCheckIns.filter(checkIn => checkIn.id !== checkInId);
      await AsyncStorage.setItem(CHECKINS_KEY, JSON.stringify(updatedCheckIns));
      return true;
    } catch (error) {
      console.error('Error deleting check-in:', error);
      return false;
    }
  }

  static async clearAllCheckIns() {
    try {
      await AsyncStorage.removeItem(CHECKINS_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing check-ins:', error);
      return false;
    }
  }
}

export default StorageService;
