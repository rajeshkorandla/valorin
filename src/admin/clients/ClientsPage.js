import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useClients } from '../hooks/useSupabase';
import { formatDate } from '../lib/utils';

export default function ClientsPage() {
  const { data: clients, isLoading } = useClients();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Clients</Text>
          <Text style={styles.subtitle}>Manage your insurance clients</Text>
        </View>
      </View>

      <View style={styles.tableCard}>
        <ScrollView horizontal>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.colName]}>Name</Text>
              <Text style={[styles.tableHeaderText, styles.colEmail]}>Email</Text>
              <Text style={[styles.tableHeaderText, styles.colPhone]}>Phone</Text>
              <Text style={[styles.tableHeaderText, styles.colCity]}>City</Text>
              <Text style={[styles.tableHeaderText, styles.colDate]}>Created</Text>
            </View>

            {/* Table Rows */}
            <ScrollView>
              {clients && clients.length > 0 ? (
                clients.map((client) => (
                  <View key={client.id} style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.colName]}>
                      {client.first_name} {client.last_name}
                    </Text>
                    <Text style={[styles.tableCell, styles.colEmail]}>{client.email}</Text>
                    <Text style={[styles.tableCell, styles.colPhone]}>{client.phone}</Text>
                    <Text style={[styles.tableCell, styles.colCity]}>{client.city || '-'}</Text>
                    <Text style={[styles.tableCell, styles.colDate]}>
                      {formatDate(client.created_at)}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No clients found</Text>
              )}
            </ScrollView>
          </View>
        </ScrollView>
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
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  table: {
    minWidth: 900,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 12,
  },
  tableHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 12,
  },
  tableCell: {
    fontSize: 14,
    color: '#374151',
  },
  colName: {
    width: 200,
    fontWeight: '500',
  },
  colEmail: {
    width: 240,
  },
  colPhone: {
    width: 160,
  },
  colCity: {
    width: 140,
  },
  colDate: {
    width: 140,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 32,
  },
});
