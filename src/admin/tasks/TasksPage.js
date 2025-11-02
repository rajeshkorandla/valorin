import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TasksPage() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Tasks</Text>
          <Text style={styles.subtitle}>Manage follow-ups and to-dos</Text>
        </View>
      </View>

      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Tasks feature coming soon</Text>
        <Text style={styles.placeholderSubtext}>
          Agent task management with due dates and priorities
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
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
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
});
