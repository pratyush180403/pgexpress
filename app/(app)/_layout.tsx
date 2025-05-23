import React from 'react';
import { Tabs } from 'expo-router';
import { Chrome as Home, Users, Wallet, Bell, Settings, MessageSquare, UtensilsCrossed, CalendarDays } from 'lucide-react-native';
import { useAuthContext } from '@/components/AuthContext';
import { useTheme } from '@/components/ThemeContext';
import { NotificationBell } from '@/components/NotificationBell';

export default function AppLayout() {
  const { user } = useAuthContext();
  const { colors } = useTheme();
  
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.background,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
        }}
      />
      
      {(isAdmin || isManager) && (
        <Tabs.Screen
          name="tenants"
          options={{
            title: 'Tenants',
            tabBarIcon: ({ size, color }) => <Users size={size} color={color} />,
          }}
        />
      )}
      
      <Tabs.Screen
        name="payments"
        options={{
          title: 'Payments',
          tabBarIcon: ({ size, color }) => <Wallet size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="rooms"
        options={{
          title: 'Rooms',
          tabBarIcon: ({ size, color }) => <CalendarDays size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="meals"
        options={{
          title: 'Meals',
          tabBarIcon: ({ size, color }) => <UtensilsCrossed size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ size, color }) => <MessageSquare size={size} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ size, color }) => <Bell size={size} color={color} />,
          tabBarBadge: '1',
        }}
      />
      
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}