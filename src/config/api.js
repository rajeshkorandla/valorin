import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getApiUrl = () => {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      return `https://${window.location.hostname}`;
    }
    return 'http://localhost:3000';
  } else {
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
      const host = hostUri.split(':')[0];
      return `http://${host}:3000`;
    }
    return 'http://localhost:3000';
  }
};

export const API_BASE_URL = getApiUrl();

export const API_ENDPOINTS = {
  CLIENT_INFO: `${API_BASE_URL}/api/client-info`,
  QUOTE_REQUEST: `${API_BASE_URL}/api/quote-request`,
  SUBMISSIONS: `${API_BASE_URL}/api/submissions`,
};
