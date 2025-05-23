import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, AlertCircle } from 'lucide-react-native';
import { MaintenanceRequest } from '@/hooks/useMaintenanceRequests';
import Card from './ui/Card';

interface MaintenanceRequestCardProps {
  request: MaintenanceRequest;
  style?: any;
}

export default function MaintenanceRequestCard({ request, style }: MaintenanceRequestCardProps) {
  const router = useRouter();
  
  const handlePress = () => {
    router.push(`/maintenance/${request.id}`);
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
  
  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return '#34C759';
      case 'medium':
        return '#FFD60A';
      case 'high':
        return '#FF9500';
      case 'urgent':
        return '#FF3B30';
      default:
        return '#666666';
    }
  };

  // Get status UI elements
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'open':
        return {
          color: '#FF9500',
          text: 'Open',
        };
      case 'in_progress':
        return {
          color: '#0A6CFF',
          text: 'In Progress',
        };
      case 'complete':
        return {
          color: '#34C759',
          text: 'Complete',
        };
      case 'cancelled':
        return {
          color: '#8E8E93',
          text: 'Cancelled',
        };
      default:
        return {
          color: '#666666',
          text: status,
        };
    }
  };

  const statusInfo = getStatusInfo(request.status);
  
  return (
    <Pressable onPress={handlePress}>
      {({ pressed }) => (
        <Card style={[styles.card, style, pressed && styles.pressed]}>
          <View style={styles.header}>
            <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(request.priority) }]} />
            <Text style={styles.title}>{request.title}</Text>
          </View>
          
          <Text style={styles.description} numberOfLines={2}>
            {request.description}
          </Text>
          
          <View style={styles.footer}>
            <View style={styles.footerItem}>
              <Clock size={16} color="#666666" />
              <Text style={styles.footerText}>{formatDate(request.createdAt)}</Text>
            </View>
            
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, { backgroundColor: statusInfo.color }]} />
              <Text style={[styles.statusText, { color: statusInfo.color }]}>
                {statusInfo.text}
              </Text>
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
    alignItems: 'center',
    marginBottom: 8,
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666666',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
});