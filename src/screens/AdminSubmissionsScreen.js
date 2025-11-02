import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
  TextInput,
  RefreshControl
} from 'react-native';
import { API_ENDPOINTS } from '../config/api';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function AdminSubmissionsScreen({ navigation }) {
  const { signOut } = useAuth();
  const [submissions, setSubmissions] = useState({
    clientSubmissions: [],
    quoteRequests: []
  });
  const [filteredData, setFilteredData] = useState({
    clientSubmissions: [],
    quoteRequests: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('clients');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchQuery, submissions, selectedTab]);

  const fetchSubmissions = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        Alert.alert('Error', 'Not authenticated');
        navigation.replace('AdminLogin');
        return;
      }

      const response = await fetch(API_ENDPOINTS.SUBMISSIONS, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          const message = response.status === 401 
            ? 'Session Expired. Please log in again' 
            : 'Access Denied. Admin privileges required.';
          Alert.alert('Unauthorized', message);
          await signOut();
          navigation.replace('AdminLogin');
          return;
        }
        throw new Error(data.message || 'Failed to fetch submissions');
      }
      
      if (data.success) {
        setSubmissions(data.data);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      Alert.alert('Error', 'Failed to load submissions');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterData = () => {
    if (!searchQuery.trim()) {
      setFilteredData(submissions);
      return;
    }

    const query = searchQuery.toLowerCase();
    
    const filteredClients = submissions.clientSubmissions.filter(item => 
      item.first_name?.toLowerCase().includes(query) ||
      item.last_name?.toLowerCase().includes(query) ||
      item.email?.toLowerCase().includes(query) ||
      item.phone?.includes(query) ||
      item.city?.toLowerCase().includes(query)
    );

    const filteredQuotes = submissions.quoteRequests.filter(item =>
      item.full_name?.toLowerCase().includes(query) ||
      item.email?.toLowerCase().includes(query) ||
      item.phone?.includes(query) ||
      item.insurance_type?.toLowerCase().includes(query)
    );

    setFilteredData({
      clientSubmissions: filteredClients,
      quoteRequests: filteredQuotes
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSubmissions();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteClient = async (id) => {
    Alert.alert(
      'Delete Submission',
      'Are you sure you want to delete this client submission?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { data: { session } } = await supabase.auth.getSession();
              
              if (!session?.access_token) {
                Alert.alert('Error', 'Not authenticated');
                navigation.replace('AdminLogin');
                return;
              }

              const response = await fetch(`${API_ENDPOINTS.BASE_URL}/api/client-submissions/${id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${session.access_token}`
                }
              });

              if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                  const message = response.status === 401 
                    ? 'Session Expired. Please log in again' 
                    : 'Access Denied. Admin privileges required.';
                  Alert.alert('Unauthorized', message);
                  await signOut();
                  navigation.replace('AdminLogin');
                  return;
                }
                throw new Error('Failed to delete submission');
              }

              setSubmissions(prev => ({
                ...prev,
                clientSubmissions: prev.clientSubmissions.filter(item => item.id !== id)
              }));
              Alert.alert('Success', 'Submission deleted successfully');
            } catch (error) {
              console.error('Error deleting submission:', error);
              Alert.alert('Error', 'Failed to delete submission');
            }
          }
        }
      ]
    );
  };

  const handleDeleteQuote = async (id) => {
    Alert.alert(
      'Delete Quote Request',
      'Are you sure you want to delete this quote request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { data: { session } } = await supabase.auth.getSession();
              
              if (!session?.access_token) {
                Alert.alert('Error', 'Not authenticated');
                navigation.replace('AdminLogin');
                return;
              }

              const response = await fetch(`${API_ENDPOINTS.BASE_URL}/api/quote-requests/${id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${session.access_token}`
                }
              });

              if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                  const message = response.status === 401 
                    ? 'Session Expired. Please log in again' 
                    : 'Access Denied. Admin privileges required.';
                  Alert.alert('Unauthorized', message);
                  await signOut();
                  navigation.replace('AdminLogin');
                  return;
                }
                throw new Error('Failed to delete quote request');
              }

              setSubmissions(prev => ({
                ...prev,
                quoteRequests: prev.quoteRequests.filter(item => item.id !== id)
              }));
              Alert.alert('Success', 'Quote request deleted successfully');
            } catch (error) {
              console.error('Error deleting quote request:', error);
              Alert.alert('Error', 'Failed to delete quote request');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  const currentData = selectedTab === 'clients' 
    ? filteredData.clientSubmissions 
    : filteredData.quoteRequests;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Submissions</Text>
        <Text style={styles.subtitle}>
          Total: {submissions.clientSubmissions.length + submissions.quoteRequests.length} submissions
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by name, email, phone..."
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'clients' && styles.tabActive]}
          onPress={() => setSelectedTab('clients')}
        >
          <Text style={[styles.tabText, selectedTab === 'clients' && styles.tabTextActive]}>
            Client Info ({filteredData.clientSubmissions.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'quotes' && styles.tabActive]}
          onPress={() => setSelectedTab('quotes')}
        >
          <Text style={[styles.tabText, selectedTab === 'quotes' && styles.tabTextActive]}>
            Quote Requests ({filteredData.quoteRequests.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {currentData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No submissions found</Text>
          </View>
        ) : (
          currentData.map((item) => (
            <View key={item.id} style={styles.card}>
              {selectedTab === 'clients' ? (
                <>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>
                      {item.first_name} {item.last_name}
                    </Text>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteClient(item.id)}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.detailText}>📧 {item.email}</Text>
                    <Text style={styles.detailText}>📱 {item.phone}</Text>
                    <Text style={styles.detailText}>
                      📍 {item.address}, {item.city}, {item.state} {item.zip_code}
                    </Text>
                    {item.date_of_birth && (
                      <Text style={styles.detailText}>🎂 {item.date_of_birth}</Text>
                    )}
                    <Text style={styles.timestampText}>
                      Submitted: {formatDate(item.submitted_at)}
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.full_name}</Text>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteQuote(item.id)}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.cardContent}>
                    <View style={styles.insuranceBadge}>
                      <Text style={styles.insuranceBadgeText}>
                        {item.insurance_type.charAt(0).toUpperCase() + item.insurance_type.slice(1)} Insurance
                      </Text>
                    </View>
                    <Text style={styles.detailText}>📧 {item.email}</Text>
                    <Text style={styles.detailText}>📱 {item.phone}</Text>
                    {item.coverage_amount && (
                      <Text style={styles.detailText}>💰 {item.coverage_amount}</Text>
                    )}
                    {item.additional_info && (
                      <Text style={styles.detailText}>📝 {item.additional_info}</Text>
                    )}
                    <Text style={styles.timestampText}>
                      Submitted: {formatDate(item.submitted_at)}
                    </Text>
                  </View>
                </>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingBottom: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  searchContainer: {
    padding: 20,
    paddingBottom: 0,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    gap: 8,
  },
  insuranceBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  insuranceBadgeText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '600',
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  timestampText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
});
