import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Bell, Calendar, CreditCard, PenTool as Tool, MessageSquare } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeContext';

type NotificationType = 'all' | 'payment' | 'maintenance' | 'announcement';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Rent Due Reminder',
    message: 'Your rent payment of ₹17,700 is due in 3 days.',
    type: 'payment',
    timestamp: '2025-05-15T09:30:00Z',
    read: false,
  },
  {
    id: '2',
    title: 'Maintenance Update',
    message: 'Your maintenance request for AC repair has been scheduled for tomorrow.',
    type: 'maintenance',
    timestamp: '2025-05-14T14:45:00Z',
    read: false,
  },
  {
    id: '3',
    title: 'Festival Celebration',
    message: 'Join us for Diwali celebrations in the common area on Saturday evening.',
    type: 'announcement',
    timestamp: '2025-05-13T11:15:00Z',
    read: true,
  },
];

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const [activeType, setActiveType] = useState<NotificationType>('all');
  
  const filteredNotifications = MOCK_NOTIFICATIONS.filter(
    notification => activeType === 'all' || notification.type === activeType
  );

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
    }
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'payment':
        return <CreditCard size={20} color={colors.primary} />;
      case 'maintenance':
        return <Tool size={20} color={colors.primary} />;
      case 'announcement':
        return <MessageSquare size={20} color={colors.primary} />;
      default:
        return <Bell size={20} color={colors.primary} />;
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      style={[
        styles.notificationCard,
        { backgroundColor: colors.surface },
        !item.read && { borderLeftWidth: 3, borderLeftColor: colors.primary }
      ]}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.notificationLeft}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '10' }]}>
            {getTypeIcon(item.type)}
          </View>
          <View style={styles.notificationContent}>
            <Text style={[styles.notificationTitle, { color: colors.text }]}>
              {item.title}
            </Text>
            <Text 
              style={[styles.notificationMessage, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {item.message}
            </Text>
          </View>
        </View>
        <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
          {formatDate(item.timestamp)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={[styles.title, { color: colors.text }]}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeType === 'all' && { backgroundColor: colors.primary }
            ]}
            onPress={() => setActiveType('all')}
          >
            <Text style={[
              styles.filterText,
              { color: activeType === 'all' ? '#FFFFFF' : colors.textSecondary }
            ]}>
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              activeType === 'payment' && { backgroundColor: colors.primary }
            ]}
            onPress={() => setActiveType('payment')}
          >
            <Text style={[
              styles.filterText,
              { color: activeType === 'payment' ? '#FFFFFF' : colors.textSecondary }
            ]}>
              Payments
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              activeType === 'maintenance' && { backgroundColor: colors.primary }
            ]}
            onPress={() => setActiveType('maintenance')}
          >
            <Text style={[
              styles.filterText,
              { color: activeType === 'maintenance' ? '#FFFFFF' : colors.textSecondary }
            ]}>
              Maintenance
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              activeType === 'announcement' && { backgroundColor: colors.primary }
            ]}
            onPress={() => setActiveType('announcement')}
          >
            <Text style={[
              styles.filterText,
              { color: activeType === 'announcement' ? '#FFFFFF' : colors.textSecondary }
            ]}>
              Announcements
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <FlatList
        data={filteredNotifications}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Bell size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No notifications
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
  },
  badge: {
    marginLeft: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
  },
  filterContainer: {
    paddingHorizontal: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
  },
  list: {
    padding: 16,
  },
  notificationCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  notificationLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
});