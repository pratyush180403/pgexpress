import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import { Search, Plus } from 'lucide-react-native';
import { useMaintenanceRequests } from '@/hooks/useMaintenanceRequests';
import { useAuthContext } from '@/components/AuthContext';
import MaintenanceRequestCard from '@/components/MaintenanceRequestCard';

export default function MaintenanceScreen() {
  const { requests, isLoading } = useMaintenanceRequests();
  const { user } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter requests based on user role
  const userRequests = user?.role === 'tenant'
    ? requests.filter(request => request.tenantId === user.id)
    : requests;

  // Apply status filter
  const filteredByStatus = statusFilter === 'all'
    ? userRequests
    : userRequests.filter(request => request.status === statusFilter);

  // Apply search filter
  const filteredRequests = searchQuery
    ? filteredByStatus.filter(request => 
        request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredByStatus;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0A6CFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Maintenance</Text>
          
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <Search size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search requests..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#8E8E93"
          />
        </View>
        
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              statusFilter === 'all' && styles.activeFilter,
            ]}
            onPress={() => setStatusFilter('all')}
          >
            <Text
              style={[
                styles.filterText,
                statusFilter === 'all' && styles.activeFilterText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              statusFilter === 'open' && styles.activeFilter,
            ]}
            onPress={() => setStatusFilter('open')}
          >
            <Text
              style={[
                styles.filterText,
                statusFilter === 'open' && styles.activeFilterText,
              ]}
            >
              Open
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              statusFilter === 'in_progress' && styles.activeFilter,
            ]}
            onPress={() => setStatusFilter('in_progress')}
          >
            <Text
              style={[
                styles.filterText,
                statusFilter === 'in_progress' && styles.activeFilterText,
              ]}
            >
              In Progress
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              statusFilter === 'complete' && styles.activeFilter,
            ]}
            onPress={() => setStatusFilter('complete')}
          >
            <Text
              style={[
                styles.filterText,
                statusFilter === 'complete' && styles.activeFilterText,
              ]}
            >
              Complete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={filteredRequests}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <MaintenanceRequestCard request={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No maintenance requests found</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: 'Inter-Bold',
  },
  addButton: {
    backgroundColor: '#0A6CFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333333',
    fontFamily: 'Inter-Regular',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
  },
  activeFilter: {
    backgroundColor: '#0A6CFF',
  },
  filterText: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Inter-Medium',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    color: '#8E8E93',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
});