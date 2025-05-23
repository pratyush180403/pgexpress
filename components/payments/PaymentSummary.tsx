import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/components/ThemeContext';

interface PaymentSummaryProps {
  subtotal: number;
  tax: number;
  total: number;
  currency?: string;
}

export default function PaymentSummary({
  subtotal,
  tax,
  total,
  currency = 'USD',
}: PaymentSummaryProps) {
  const { colors } = useTheme();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Subtotal
        </Text>
        <Text style={[styles.amount, { color: colors.text }]}>
          {formatAmount(subtotal)}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Tax
        </Text>
        <Text style={[styles.amount, { color: colors.text }]}>
          {formatAmount(tax)}
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.row}>
        <Text style={[styles.totalLabel, { color: colors.text }]}>
          Total
        </Text>
        <Text style={[styles.totalAmount, { color: colors.text }]}>
          {formatAmount(total)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  amount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  totalAmount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
});