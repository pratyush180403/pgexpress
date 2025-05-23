import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Checkbox } from '@/components/ui/Checkbox';
import { useTheme } from '@/components/ThemeContext';
import { useAuthContext } from '@/components/AuthContext';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import BulkOperations from '@/components/admin/BulkOperations';
import AdvancedSearch from '@/components/search/AdvancedSearch';

export default function AdminDashboardScreen() {
  const { colors } = useTheme();
  const { user } = useAuthContext();

  // Mock analytics data
  const analyticsData = {
    revenue: {
      total: 250000,
      trend: [
        { date: '2025-01', value: 45000 },
        { date: '2025-02', value: 48000 },
        { date: '2025-03', value: 52000 },
        { date: '2025-04', value: 55000 },
        { date: '2025-05', value: 50000 },
      ],
    },
    occupancy: {
      rate: 0.85,
      trend: [
        { date: '2025-01', value: 0.80 },
        { date: '2025-02', value: 0.82 },
        { date: '2025-03', value: 0.85 },
        { date: '2025-04', value: 0.88 },
        { date: '2025-05', value: 0.85 },
      ],
    },
    maintenance: {
      open: 12,
      inProgress: 8,
      completed: 45,
    },
    payments: {
      pending: 15,
      completed: 85,
      overdue: 5,
    },
  };

  // Mock items for bulk operations
  const items = [
    { id: '1', name: 'Room 101', status: 'available' },
    { id: '2', name: 'Room 102', status: 'occupied' },
    { id: '3', name: 'Room 103', status: 'maintenance' },
  ];

  // Search fields configuration
  const searchFields = [
    { id: 'name', label: 'Name', type: 'text' },
    { id: 'status', label: 'Status', type: 'select', options: [
      { label: 'Available', value: 'available' },
      { label: 'Occupied', value: 'occupied' },
      { label: 'Maintenance', value: 'maintenance' },
    ]},
    { id: 'floor', label: 'Floor', type: 'number' },
    { id: 'price', label: 'Price', type: 'number' },
  ];

  const handleBulkAction = async (action: string, selectedItems: any[]) => {
    console.log('Bulk action:', action, selectedItems);
    // Implement bulk action logic
  };

  const handleSearch = (filters: any[]) => {
    console.log('Search filters:', filters);
    // Implement search logic
  };

  if (user?.role !== 'admin') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          Access denied. Admin privileges required.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Admin Dashboard</Text>
      </View>

      <AdvancedSearch
        fields={searchFields}
        onSearch={handleSearch}
      />

      <AnalyticsDashboard data={analyticsData} />

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Bulk Operations
        </Text>
        
        <BulkOperations
          items={items}
          onBulkAction={handleBulkAction}
          actions={[
            { id: 'update', label: 'Update Status', variant: 'primary' },
            { id: 'delete', label: 'Delete', variant: 'danger' },
          ]}
          renderItem={(item, isSelected, onToggle) => (
            <View style={[styles.itemRow, { backgroundColor: colors.surface }]}>
              <Checkbox checked={isSelected} onPress={onToggle} />
              <Text style={[styles.itemText, { color: colors.text }]}>
                {item.name}
              </Text>
              <Text style={[styles.itemStatus, { color: colors.textSecondary }]}>
                {item.status}
              </Text>
            </View>
          )}
        />
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
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginLeft: 12,
  },
  itemStatus: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: 24,
  },
});