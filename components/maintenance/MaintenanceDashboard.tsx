import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useMaintenanceRequests } from '@/hooks/useMaintenanceRequests';
import { useTheme } from '@/components/ThemeContext';
import MaintenanceStats from './MaintenanceStats';
import MaintenanceChart from './MaintenanceChart';
import MaintenanceRequestList from './MaintenanceRequestList';

export default function MaintenanceDashboard() {
  const { colors } = useTheme();
  const { requests, isLoading, error } = useMaintenanceRequests();

  // Calculate statistics
  const stats = {
    total: requests.length,
    open: requests.filter(r => r.status === 'open').length,
    inProgress: requests.filter(r => r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'complete').length,
  };

  // Calculate priority distribution
  const priorityData = {
    low: requests.filter(r => r.priority === 'low').length,
    medium: requests.filter(r => r.priority === 'medium').length,
    high: requests.filter(r => r.priority === 'high').length,
    urgent: requests.filter(r => r.priority === 'urgent').length,
  };

  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.error + '20' }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <MaintenanceStats stats={stats} isLoading={isLoading} />
      
      <View style={styles.charts}>
        <MaintenanceChart
          title="Request Status"
          data={[
            { name: 'Open', value: stats.open, color: colors.warning },
            { name: 'In Progress', value: stats.inProgress, color: colors.primary },
            { name: 'Completed', value: stats.completed, color: colors.success },
          ]}
          type="pie"
        />
        
        <MaintenanceChart
          title="Priority Distribution"
          data={[
            { name: 'Urgent', value: priorityData.urgent, color: colors.error },
            { name: 'High', value: priorityData.high, color: colors.warning },
            { name: 'Medium', value: priorityData.medium, color: colors.primary },
            { name: 'Low', value: priorityData.low, color: colors.success },
          ]}
          type="donut"
        />
      </View>

      <MaintenanceRequestList
        title="Recent Requests"
        requests={requests.slice(0, 5)}
        isLoading={isLoading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  charts: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
});