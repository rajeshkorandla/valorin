import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useDashboardStats, useActivities } from '../hooks/useSupabase';
import StatsCards from './StatsCards';
import RecentActivity from './RecentActivity';
import PipelineChart from './PipelineChart';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: activities, isLoading: activitiesLoading } = useActivities();

  if (statsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Page Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Insurance CRM Overview</Text>
        </View>
      </View>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Charts and Activity */}
      <View style={styles.chartsGrid}>
        {/* Pipeline Chart */}
        <View style={styles.chartCard}>
          <PipelineChart stats={stats} />
        </View>

        {/* Recent Activity */}
        <View style={styles.activityCard}>
          <RecentActivity activities={activities} loading={activitiesLoading} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  chartsGrid: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 24,
  },
  chartCard: {
    flex: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activityCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});
