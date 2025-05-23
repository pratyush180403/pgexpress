import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  FileText, 
  Upload, 
  LogOut, 
  ChevronRight, 
  Shield, 
  UserCheck,
  CreditCard
} from 'lucide-react-native';
import { useTheme } from '@/components/ThemeContext';
import { useAuthContext } from '@/components/AuthContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, signOut } = useAuthContext();

  const menuItems = [
    {
      title: 'Documents',
      icon: FileText,
      route: '/settings/documents',
      description: 'Manage your documents and KYC',
      badge: user?.kyc_status === 'pending' ? 'Pending' : undefined,
      badgeColor: colors.warning
    },
    {
      title: 'Police Verification',
      icon: Shield,
      route: '/settings/verification',
      description: 'View verification status',
      badge: user?.police_verification === 'pending' ? 'Pending' : undefined,
      badgeColor: colors.warning
    },
    {
      title: 'Profile',
      icon: UserCheck,
      route: '/settings/profile',
      description: 'Update your personal information'
    },
    {
      title: 'Payment Methods',
      icon: CreditCard,
      route: '/settings/payment-methods',
      description: 'Manage your payment options'
    }
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      </View>

      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              { backgroundColor: colors.surface },
              index === 0 && styles.menuItemFirst,
              index === menuItems.length - 1 && styles.menuItemLast
            ]}
            onPress={() => router.push(item.route)}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '10' }]}>
                <item.icon size={20} color={colors.primary} />
              </View>
              <View style={styles.menuItemContent}>
                <Text style={[styles.menuItemTitle, { color: colors.text }]}>
                  {item.title}
                </Text>
                <Text style={[styles.menuItemDescription, { color: colors.textSecondary }]}>
                  {item.description}
                </Text>
              </View>
            </View>

            <View style={styles.menuItemRight}>
              {item.badge && (
                <View style={[styles.badge, { backgroundColor: item.badgeColor + '20' }]}>
                  <Text style={[styles.badgeText, { color: item.badgeColor }]}>
                    {item.badge}
                  </Text>
                </View>
              )}
              <ChevronRight size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.signOutButton, { backgroundColor: colors.error + '10' }]}
        onPress={signOut}
      >
        <LogOut size={20} color={colors.error} />
        <Text style={[styles.signOutText, { color: colors.error }]}>Sign Out</Text>
      </TouchableOpacity>
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
  header: {
    paddingTop: 44,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
  },
  menuSection: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  menuItemFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  menuItemLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  signOutText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
});