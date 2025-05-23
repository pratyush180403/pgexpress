import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Mail, ArrowRight } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { email } = useLocalSearchParams();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      router.replace('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/verify-email/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      setCountdown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
          <Mail size={48} color={colors.primary} />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>
          Verify your email
        </Text>

        <Text style={[styles.description, { color: colors.textSecondary }]}>
          We've sent a verification code to {email}. Enter the code below to verify your email address.
        </Text>

        <Input
          value={code}
          onChangeText={setCode}
          placeholder="Enter verification code"
          keyboardType="number-pad"
          maxLength={6}
          style={styles.input}
        />

        {error && (
          <View style={[styles.errorContainer, { backgroundColor: colors.error + '20' }]}>
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          </View>
        )}

        <Button
          title="Verify Email"
          onPress={handleVerify}
          isLoading={isLoading}
          leftIcon={<ArrowRight size={20} color="#FFFFFF" />}
          style={styles.verifyButton}
        />

        <Button
          title={countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code'}
          variant="text"
          onPress={handleResend}
          disabled={countdown > 0 || isLoading}
          style={styles.resendButton}
        />
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
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  verifyButton: {
    width: '100%',
  },
  resendButton: {
    marginTop: 12,
  },
});