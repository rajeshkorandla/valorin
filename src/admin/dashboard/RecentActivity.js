import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { formatRelativeTime } from '../lib/utils';

export default function RecentActivity({ activities, loading }) {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#3B82F6" />
      </View>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Recent Activity</Text>
        <Text style={styles.emptyText}>No recent activity</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Activity</Text>
      <Text style={styles.subtitle}>Latest updates</Text>

      <ScrollView style={styles.activityList}>
        {activities.slice(0, 10).map((activity) => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.activityDot} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              {activity.description && (
                <Text style={styles.activityDescription}>
                  {activity.description}
                </Text>
              )}
              <Text style={styles.activityTime}>
                {formatRelativeTime(activity.created_at)}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
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
    paddingVertical: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 32,
  },
  activityList: {
    flex: 1,
  },
  activityItem: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginTop: 6,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  activityDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
});
