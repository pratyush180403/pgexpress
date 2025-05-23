import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { CalendarDays, DollarSign } from 'lucide-react-native';
import { Tenant } from '@/hooks/useTenants';
import Card from './ui/Card';

interface TenantCardProps {
  tenant: Tenant;
  style?: any;
}

export default function TenantCard({ tenant, style }: TenantCardProps) {
  const router = useRouter();
  
  const handlePress = () => {
    router.push(`/tenants/${tenant.id}`);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current':
        return '#34C759';
      case 'past_due':
        return '#FF3B30';
      case 'eviction':
        return '#FF2D55';
      default:
        return '#666666';
    }
  };

  const statusColor = getStatusColor(tenant.status);
  
  return (
    <Pressable onPress={handlePress}>
      {({ pressed }) => (
        <Card style={[styles.card, style, pressed && styles.pressed]}>
          <View style={styles.header}>
            <View>
              <Text style={styles.name}>{tenant.name}</Text>
              <Text style={styles.email}>{tenant.email}</Text>
            </View>
            
            <View style={[styles.statusContainer, { backgroundColor: statusColor + '20' }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {tenant.status === 'current' ? 'Current' : 
                 tenant.status === 'past_due' ? 'Past Due' : 'Eviction'}
              </Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <CalendarDays size={16} color="#666666" />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Lease Period</Text>
                <Text style={styles.detailValue}>
                  {formatDate(tenant.leaseStart)} - {formatDate(tenant.leaseEnd)}
                </Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <DollarSign size={16} color="#666666" />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Rent / Balance</Text>
                <Text style={styles.detailValue}>
                  {formatCurrency(tenant.rentAmount)} / 
                  <Text style={{ color: tenant.balance > 0 ? '#FF3B30' : '#34C759' }}>
                    {formatCurrency(tenant.balance)}
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </Card>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  email: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  statusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E1E1E1',
    marginBottom: 12,
  },
  details: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailTextContainer: {
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  detailValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
});