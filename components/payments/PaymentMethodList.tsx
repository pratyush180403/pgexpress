import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { CreditCard, Trash2, Check } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeContext';

interface PaymentMethod {
  id: string;
  cardBrand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

interface PaymentMethodListProps {
  paymentMethods: PaymentMethod[];
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export default function PaymentMethodList({
  paymentMethods,
  onDelete,
  onSetDefault,
}: PaymentMethodListProps) {
  const { colors } = useTheme();

  if (paymentMethods.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.surface }]}>
        <CreditCard size={48} color={colors.textSecondary} />
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          No payment methods added
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {paymentMethods.map(method => (
        <View
          key={method.id}
          style={[styles.card, { backgroundColor: colors.surface }]}
        >
          <View style={styles.cardInfo}>
            <CreditCard size={24} color={colors.primary} />
            <View>
              <Text style={[styles.cardNumber, { color: colors.text }]}>
                •••• {method.last4}
              </Text>
              <Text style={[styles.cardExpiry, { color: colors.textSecondary }]}>
                Expires {method.expiryMonth}/{method.expiryYear}
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            {!method.isDefault && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.success + '20' }]}
                onPress={() => onSetDefault(method.id)}
              >
                <Check size={20} color={colors.success} />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.error + '20' }]}
              onPress={() => onDelete(method.id)}
            >
              <Trash2 size={20} color={colors.error} />
            </TouchableOpacity>
          </View>

          {method.isDefault && (
            <View style={[styles.defaultBadge, { backgroundColor: colors.success + '20' }]}>
              <Text style={[styles.defaultText, { color: colors.success }]}>
                Default
              </Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  emptyContainer: {
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  card: {
    borderRadius: 12,
    padding: 16,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardNumber: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  cardExpiry: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  actions: {
    position: 'absolute',
    right: 16,
    top: 16,
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
});