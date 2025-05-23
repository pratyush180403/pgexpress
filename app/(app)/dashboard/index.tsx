import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useProperties } from '@/hooks/useProperties';
import { useTenants } from '@/hooks/useTenants';
import { useMaintenanceRequests } from '@/hooks/useMaintenanceRequests';
import { useAuthContext } from '@/components/AuthContext';
import PropertyCard from '@/components/PropertyCard';
import MaintenanceRequestCard from '@/components/MaintenanceRequestCard';
import TenantCard from '@/components/TenantCard';
import Card from '@/components/ui/Card';

export default function DashboardScreen() {
  const { properties, isLoading: propertiesLoading } = useProperties();
  const { tenants, isLoading: tenantsLoading } = useTenants();
  const { requests, isLoading: requestsLoading } = useMaintenanceRequests();
  const { user } = useAuthContext();
  
  const isLoading = propertiesLoading || tenantsLoading || requestsLoading;
  
  // Filter data based on user role
  const filteredProperties = properties.slice(0, 2);
  const filteredTenants = tenants.filter(tenant => tenant.status === 'past_due').slice(0, 2);
  const openRequests = requests.filter(request => request.status === 'open' || request.status === 'in_progress').slice(0, 3);
  
  // Tenant view shows only their own information
  const isTenant = user?.role === 'tenant';
  const tenantRequests = isTenant 
    ? requests.filter(request => request.tenantId === user.id)
    : [];
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0A6CFF" />
      </View>
    );
  }
  
  // Calculate summary stats
  const totalUnits = properties.reduce((sum, property) => sum + property.units, 0);
  const totalRevenue = properties.reduce((sum, property) => sum + property.monthlyRevenue, 0);
  const overdueTenants = tenants.filter(tenant => tenant.status === 'past_due').length;
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name}</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
      </View>
      
      {!isTenant ? (
        // Admin/Manager Dashboard
        <>
          <View style={styles.statCards}>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{properties.length}</Text>
              <Text style={styles.statLabel}>Properties</Text>
            </Card>
            
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{totalUnits}</Text>
              <Text style={styles.statLabel}>Units</Text>
            </Card>
            
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>${(totalRevenue / 1000).toFixed(0)}k</Text>
              <Text style={styles.statLabel}>Revenue</Text>
            </Card>
            
            <Card style={[styles.statCard, overdueTenants > 0 && styles.alertCard]}>
              <Text style={[styles.statValue, overdueTenants > 0 && styles.alertText]}>{overdueTenants}</Text>
              <Text style={[styles.statLabel, overdueTenants > 0 && styles.alertText]}>Overdue</Text>
            </Card>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Properties</Text>
            {filteredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overdue Tenants</Text>
            {filteredTenants.length > 0 ? (
              filteredTenants.map(tenant => (
                <TenantCard key={tenant.id} tenant={tenant} />
              ))
            ) : (
              <Card>
                <Text style={styles.emptyText}>No overdue tenants</Text>
              </Card>
            )}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Maintenance Requests</Text>
            {openRequests.map(request => (
              <MaintenanceRequestCard key={request.id} request={request} />
            ))}
          </View>
        </>
      ) : (
        // Tenant Dashboard
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Maintenance Requests</Text>
            {tenantRequests.length > 0 ? (
              tenantRequests.map(request => (
                <MaintenanceRequestCard key={request.id} request={request} />
              ))
            ) : (
              <Card>
                <Text style={styles.emptyText}>No maintenance requests</Text>
              </Card>
            )}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rent Summary</Text>
            <Card>
              <View style={styles.rentInfo}>
                <View>
                  <Text style={styles.rentLabel}>Monthly Rent</Text>
                  <Text style={styles.rentAmount}>$2,000</Text>
                </View>
                
                <View>
                  <Text style={styles.rentLabel}>Next Payment</Text>
                  <Text style={styles.rentDate}>June 1, 2025</Text>
                </View>
                
                <View>
                  <Text style={styles.rentLabel}>Status</Text>
                  <Text style={styles.rentStatus}>Current</Text>
                </View>
              </View>
            </Card>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lease Information</Text>
            <Card>
              <View style={styles.leaseInfo}>
                <View style={styles.leaseDetail}>
                  <Text style={styles.leaseLabel}>Start Date</Text>
                  <Text style={styles.leaseValue}>January 1, 2025</Text>
                </View>
                
                <View style={styles.leaseDetail}>
                  <Text style={styles.leaseLabel}>End Date</Text>
                  <Text style={styles.leaseValue}>December 31, 2025</Text>
                </View>
                
                <View style={styles.leaseDetail}>
                  <Text style={styles.leaseLabel}>Security Deposit</Text>
                  <Text style={styles.leaseValue}>$2,000</Text>
                </View>
              </View>
            </Card>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 24,
    marginTop: 60,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: 'Inter-Bold',
  },
  date: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  statCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  statCard: {
    width: '48%',
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  alertCard: {
    backgroundColor: '#FFEBEB',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Inter-Regular',
  },
  alertText: {
    color: '#FF3B30',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333333',
    fontFamily: 'Inter-Bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#8E8E93',
    padding: 16,
    fontFamily: 'Inter-Regular',
  },
  rentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  rentLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
    fontFamily: 'Inter-Regular',
  },
  rentAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: 'Inter-Bold',
  },
  rentDate: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'Inter-Medium',
  },
  rentStatus: {
    fontSize: 16,
    color: '#34C759',
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  leaseInfo: {
    padding: 8,
  },
  leaseDetail: {
    marginBottom: 12,
  },
  leaseLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
    fontFamily: 'Inter-Regular',
  },
  leaseValue: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'Inter-Medium',
  },
});