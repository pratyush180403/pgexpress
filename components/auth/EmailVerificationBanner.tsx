import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeContext';
import Button from '@/components/ui/Button';

interface EmailVerificationBannerProps {
  email: string;
}

export default function EmailVerificationBanner({ email }: EmailVerificationBannerProps) {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.warning + '20' }]}>
      <View style={styles.content}>
        <Mail size={20} color={colors.warning} />
        <Text style={[styles.message, { color: colors.text }]}>
          Please verify your email address to access all features
        </Text>
      </View>
      
      <Button
        title="Verify Now"
        variant="outline"
        onPress={() => router.push(`/verify-email?email=${email}`)}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  message: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    flex: 1,
  },
  button: {
    minWidth: 100,
  },
});