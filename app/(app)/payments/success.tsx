import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeContext';
import Button from '@/components/ui/Button';

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={[styles.iconContainer, { backgroundColor: colors.success + '20' }]}>
          <Check size={48} color={colors.success} />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>
          Payment Successful!
        </Text>

        <Text style={[styles.message, { color: colors.textSecondary }]}>
          Your payment has been processed successfully. A confirmation email has been sent to your registered email address.
        </Text>

        <View style={styles.buttons}>
          <Button
            title="View Receipt"
            variant="outline"
            onPress={() => {}}
            style={styles.button}
          />
          <Button
            title="Done"
            onPress={() => router.replace('/payments')}
            style={styles.button}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttons: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
});