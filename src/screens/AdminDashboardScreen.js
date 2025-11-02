import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import { supabase } from '../config/supabase';
import { useResponsive } from '../hooks/useResponsive';
import DesktopNavBar from '../components/DesktopNavBar';

export default function AdminDashboardScreen({ navigation }) {
  const { isDesktop } = useResponsive();
  const [stats, setStats] = useState({
    totalClients: 0,
    totalQuotes: 0,
    recentSubmissions: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, signOut, loading: authLoading } = useAuth();

  useEffect(() => {
    // Wait for auth to load before checking authentication
    if (!authLoading) {
      if (!user) {
        setError('Not authenticated. Please log in.');
        setTimeout(() => navigation.replace('AdminLogin'), 2000);
        setLoading(false);
        return;
      }
      fetchStats();
    }
  }, [authLoading, user]);

  const fetchStats = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        setError('Not authenticated. Please log in.');
        setTimeout(() => navigation.replace('AdminLogin'), 2000);
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
            ? 'Session expired. Please log in again.' 
            : 'Access denied. You do not have admin privileges.';
          setError(message);
          await signOut();
          setTimeout(() => navigation.replace('AdminLogin'), 2000);
          return;
        }
        throw new Error(data.message || 'Failed to fetch stats');
      }
      
      if (data.success) {
        const clientsCount = data.data.clientSubmissions.length;
        const quotesCount = data.data.quoteRequests.length;
        
        setStats({
          totalClients: clientsCount,
          totalQuotes: quotesCount,
          recentSubmissions: clientsCount + quotesCount
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigation.replace('Home');
    } catch (error) {
      setError('Failed to log out. Please try again.');
    }
  };

  if (authLoading || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>
          {authLoading ? 'Checking authentication...' : 'Loading dashboard...'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {isDesktop && <DesktopNavBar />}
      <View style={[styles.content, isDesktop && styles.contentDesktop]}>
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Admin Dashboard</Text>
            <Text style={styles.subtitle}>Welcome, {user?.email}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalClients}</Text>
            <Text style={styles.statLabel}>Client Submissions</Text>
            <Text style={styles.statIcon}>👤</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalQuotes}</Text>
            <Text style={styles.statLabel}>Quote Requests</Text>
            <Text style={styles.statIcon}>📋</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.recentSubmissions}</Text>
            <Text style={styles.statLabel}>Total Submissions</Text>
            <Text style={styles.statIcon}>📊</Text>
          </View>
        </View>

        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Management</Text>
          
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('AdminSubmissions')}
          >
            <View style={styles.actionCardHeader}>
              <Text style={styles.actionCardIcon}>📝</Text>
              <Text style={styles.actionCardTitle}>Manage Submissions</Text>
            </View>
            <Text style={styles.actionCardDescription}>
              View, edit, and delete client submissions and quote requests
            </Text>
            <Text style={styles.actionCardLink}>Open →</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Home')}
          >
            <View style={styles.actionCardHeader}>
              <Text style={styles.actionCardIcon}>🏠</Text>
              <Text style={styles.actionCardTitle}>View Public Site</Text>
            </View>
            <Text style={styles.actionCardDescription}>
              Go to the public-facing homepage
            </Text>
            <Text style={styles.actionCardLink}>Open →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  content: {
    padding: 20,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: Platform.OS === 'web' ? 'center' : 'flex-start',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  logoutButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: Platform.OS === 'web' ? 0 : 12,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
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
  statNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 24,
  },
  actionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
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
  actionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionCardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  actionCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  actionCardDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  actionCardLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  errorIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  errorText: {
    flex: 1,
    color: '#991B1B',
    fontSize: 14,
    lineHeight: 20,
  },
  contentDesktop: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
});
