import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PipelineChart({ stats }) {
  if (!stats?.pipelineStats) return null;

  const maxCount = Math.max(...stats.pipelineStats.map(s => s.count || 0), 1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quote Pipeline</Text>
      <Text style={styles.subtitle}>Distribution across stages</Text>

      <View style={styles.chart}>
        {stats.pipelineStats.map((stage, index) => {
          const percentage = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;
          
          return (
            <View key={index} style={styles.barContainer}>
              <Text style={styles.stageName}>{stage.stage}</Text>
              <View style={styles.barWrapper}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      width: `${percentage}%`,
                      backgroundColor: stage.color || '#3B82F6'
                    }
                  ]} 
                />
                <Text style={styles.barValue}>{stage.count}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  chart: {
    gap: 16,
  },
  barContainer: {
    gap: 8,
  },
  stageName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  barWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bar: {
    height: 32,
    borderRadius: 6,
    minWidth: 40,
  },
  barValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    minWidth: 30,
  },
});
