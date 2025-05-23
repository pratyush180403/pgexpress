import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import AnalyticsCard from './AnalyticsCard';
import LineChart from './LineChart';
import PieChart from './PieChart';

interface AnalyticsDashboardProps {
  data: {
    revenue: {
      total: number;
      trend: { date: string; value: number }[];
    };
    occupancy: {
      rate: number;
      trend: { date: string; value: number }[];
    };
    maintenance: {
      open: number;
      inProgress: number;
      completed: number;
    };
    payments: {
      pending: number;
      completed: number;
      overdue: number;
    };
  };
}

export default function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  const { colors } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.grid}>
        <AnalyticsCard
          title="Total Revenue"
          value={`$${data.revenue.total.toLocaleString()}`}
          trend={data.revenue.trend}
          type="currency"
        />
        
        <AnalyticsCard
          title="Occupancy Rate"
          value={`${(data.occupancy.rate * 100).toFixed(1)}%`}
          trend={data.occupancy.trend}
          type="percentage"
        />
      </View>

      <View style={[styles.chart, { backgroundColor: colors.surface }]}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>
          Revenue Trend
        </Text>
        <LineChart
          data={data.revenue.trend}
          height={200}
          color={colors.primary}
        />
      </View>

      <View style={styles.grid}>
        <View style={[styles.pieChart, { backgroundColor: colors.surface }]}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>
            Maintenance Status
          </Text>
          <PieChart
            data={[
              { label: 'Open', value: data.maintenance.open, color: colors.warning },
              { label: 'In Progress', value: data.maintenance.inProgress, color: colors.primary },
              { label: 'Completed', value: data.maintenance.completed, color: colors.success },
            ]}
          />
        </View>

        <View style={[styles.pieChart, { backgroundColor: colors.surface }]}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>
            Payment Status
          </Text>
          <PieChart
            data={[
              { label: 'Pending', value: data.payments.pending, color: colors.warning },
              { label: 'Completed', value: data.payments.completed, color: colors.success },
              { label: 'Overdue', value: data.payments.overdue, color: colors.error },
            ]}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
    padding: 16,
  },
  chart: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    marginBottom: 16,
  },
  pieChart: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
  },
});