import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FileText, Activity, DollarSign, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

export default function StatsCards({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      title: 'Total Quotes',
      value: stats.totalQuotes,
      icon: FileText,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
    },
    {
      title: 'Active Quotes',
      value: stats.activeQuotes,
      icon: Activity,
      color: '#8B5CF6',
      bgColor: '#F5F3FF',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: '#10B981',
      bgColor: '#ECFDF5',
    },
    {
      title: 'Win Rate',
      value: `${stats.winRate}%`,
      icon: TrendingUp,
      color: '#F59E0B',
      bgColor: '#FFFBEB',
    },
  ];

  return (
    <View style={styles.grid}>
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <View key={index} style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardValue}>{card.value}</Text>
              </View>
              <View style={[styles.iconContainer, { backgroundColor: card.bgColor }]}>
                <Icon size={24} color={card.color} />
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: 20,
    flexWrap: 'wrap',
  },
  card: {
    flex: 1,
    minWidth: 240,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
