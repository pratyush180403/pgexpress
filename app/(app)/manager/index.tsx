import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { useAuthContext } from '@/components/AuthContext';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import MaintenanceRequestList from '@/components/maintenance/MaintenanceRequestList';

export default function ManagerDashboardScreen() {
  const { colors } = useTheme();
  const { user } = useAuthContext();

  // Mock analytics data
  const analyticsData = {
    revenue: {
      total: 150000,
      trend: [
        { date: '2025-01', value: 28000 },
        { date: '2025-02', value: 30000 },
        { date: '2025-03', value: 32000 },
        { date: '2025-04', value: 35000 },
        { date: '2025-05', value: 25000 },
      ],
    },
    occupancy: {
      rate: 0.82,
      trend: [
        { date: '2025-01', value: 0.75 },
        { date: '2025-02', value: 0.78 },
        { date: '2025-03', value: 0.82 },
        { date: '2025-04', value: 0.85 },
        { date: '2025-05', value: 0.82 },
      ],
    },
    maintenance: {
      open: 8,
      inProgress: 5,
      completed: 25,
    },
    payments: {
      pending: 10,
      completed: 45,
      overdue: 3,
    },
  };

  if (user?.role !== 'manager') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          Access denied. Manager privileges required.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Manager Dashboard</Text>
      </View>

      <AnalyticsDashboard data={analyticsData} />

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Recent Maintenance Requests
        </Text>
        <MaintenanceRequestList />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: 24,
  },
});