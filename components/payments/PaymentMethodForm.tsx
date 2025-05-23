import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { CreditCard, Lock } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface PaymentMethodFormProps {
  onSubmit: (data: {
    cardNumber: string;
    expiryDate: string;
    cvc: string;
    name: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export default function PaymentMethodForm({ onSubmit, isLoading }: PaymentMethodFormProps) {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    name: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setError(null);

      // Basic validation
      if (!formData.cardNumber.trim()) {
        throw new Error('Card number is required');
      }
      if (!formData.expiryDate.trim()) {
        throw new Error('Expiry date is required');
      }
      if (!formData.cvc.trim()) {
        throw new Error('CVC is required');
      }
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }

      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save payment method');
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Input
          label="Card Number"
          value={formData.cardNumber}
          onChangeText={(value) => setFormData(prev => ({ ...prev, cardNumber: value }))}
          placeholder="1234 5678 9012 3456"
          keyboardType="numeric"
          maxLength={19}
          leftIcon={<CreditCard size={20} color={colors.textSecondary} />}
        />

        <View style={styles.row}>
          <Input
            label="Expiry Date"
            value={formData.expiryDate}
            onChangeText={(value) => setFormData(prev => ({ ...prev, expiryDate: value }))}
            placeholder="MM/YY"
            keyboardType="numeric"
            maxLength={5}
            containerStyle={styles.expiryInput}
          />

          <Input
            label="CVC"
            value={formData.cvc}
            onChangeText={(value) => setFormData(prev => ({ ...prev, cvc: value }))}
            placeholder="123"
            keyboardType="numeric"
            maxLength={4}
            containerStyle={styles.cvcInput}
            leftIcon={<Lock size={20} color={colors.textSecondary} />}
          />
        </View>

        <Input
          label="Name on Card"
          value={formData.name}
          onChangeText={(value) => setFormData(prev => ({ ...prev, name: value }))}
          placeholder="Enter name as shown on card"
        />

        {error && (
          <View style={[styles.errorContainer, { backgroundColor: colors.error + '20' }]}>
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          </View>
        )}

        <Button
          title="Save Card"
          onPress={handleSubmit}
          isLoading={isLoading}
          style={styles.button}
        />
      </View>

      <View style={[styles.secureNote, { backgroundColor: colors.surface }]}>
        <Lock size={16} color={colors.textSecondary} />
        <Text style={[styles.secureText, { color: colors.textSecondary }]}>
          Your payment information is securely encrypted
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  expiryInput: {
    flex: 1,
  },
  cvcInput: {
    flex: 1,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  button: {
    marginTop: 8,
  },
  secureNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
  },
  secureText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});