import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useQuotes, useQuoteStatuses } from '../hooks/useSupabase';
import { formatCurrency, formatDate } from '../lib/utils';

export default function QuotesPage() {
  const { data: quotes, isLoading } = useQuotes();
  const { data: statuses } = useQuoteStatuses();

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
          <Text style={styles.title}>Quotes Pipeline</Text>
          <Text style={styles.subtitle}>Manage insurance quotes and deals</Text>
        </View>
      </View>

      {/* Pipeline Stats */}
      {statuses && (
        <View style={styles.statsRow}>
          {statuses.map((status) => {
            const count = quotes?.filter(q => q.status_id === status.id).length || 0;
            return (
              <View key={status.id} style={styles.statCard}>
                <View style={[styles.statusDot, { backgroundColor: status.color }]} />
                <View>
                  <Text style={styles.statValue}>{count}</Text>
                  <Text style={styles.statLabel}>{status.display_name}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Quotes Table */}
      <View style={styles.tableCard}>
        <Text style={styles.tableTitle}>All Quotes</Text>
        
        <ScrollView horizontal>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.colTitle]}>Title</Text>
              <Text style={[styles.tableHeaderText, styles.colClient]}>Client</Text>
              <Text style={[styles.tableHeaderText, styles.colType]}>Type</Text>
              <Text style={[styles.tableHeaderText, styles.colAmount]}>Coverage</Text>
              <Text style={[styles.tableHeaderText, styles.colStatus]}>Status</Text>
              <Text style={[styles.tableHeaderText, styles.colDate]}>Created</Text>
            </View>

            {/* Table Rows */}
            <ScrollView>
              {quotes && quotes.length > 0 ? (
                quotes.map((quote) => (
                  <View key={quote.id} style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.colTitle]}>{quote.title}</Text>
                    <Text style={[styles.tableCell, styles.colClient]}>
                      {quote.client ? `${quote.client.first_name} ${quote.client.last_name}` : '-'}
                    </Text>
                    <Text style={[styles.tableCell, styles.colType]}>
                      {quote.insurance_type}
                    </Text>
                    <Text style={[styles.tableCell, styles.colAmount]}>
                      {formatCurrency(quote.coverage_amount)}
                    </Text>
                    <View style={styles.colStatus}>
                      <View style={[styles.statusBadge, { backgroundColor: quote.status?.color || '#gray' }]}>
                        <Text style={styles.statusText}>{quote.status?.display_name}</Text>
                      </View>
                    </View>
                    <Text style={[styles.tableCell, styles.colDate]}>
                      {formatDate(quote.created_at)}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No quotes found</Text>
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
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: 160,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  table: {
    minWidth: 1000,
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
  colTitle: {
    width: 240,
    fontWeight: '500',
  },
  colClient: {
    width: 180,
  },
  colType: {
    width: 120,
  },
  colAmount: {
    width: 140,
  },
  colStatus: {
    width: 140,
  },
  colDate: {
    width: 120,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 32,
  },
});
