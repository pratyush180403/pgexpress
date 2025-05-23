import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Shield, CreditCard } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeContext';
import { useAuthContext } from '@/components/AuthContext';
import PaymentMethodForm from '@/components/payments/PaymentMethodForm';
import PaymentMethodList from '@/components/payments/PaymentMethodList';
import PaymentSummary from '@/components/payments/PaymentSummary';
import Button from '@/components/ui/Button';

export default function PaymentProcessScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuthContext();
  const { amount: amountParam } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [showNewCardForm, setShowNewCardForm] = useState(false);

  // Mock payment methods for demo
  const [paymentMethods] = useState([
    {
      id: '1',
      cardBrand: 'visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
    },
  ]);

  const amount = parseFloat(amountParam as string) || 0;
  const tax = amount * 0.1; // 10% tax
  const total = amount + tax;

  const handlePaymentMethodSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: Implement Stripe payment method creation
      console.log('Creating payment method:', data);
      
      setShowNewCardForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save payment method');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!selectedPaymentMethod) {
        throw new Error('Please select a payment method');
      }

      // TODO: Implement payment processing
      console.log('Processing payment:', {
        amount: total,
        paymentMethodId: selectedPaymentMethod,
      });

      router.replace('/payments/success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: colors.text }]}>Payment Details</Text>

      <PaymentSummary
        subtotal={amount}
        tax={tax}
        total={total}
      />

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Payment Method
        </Text>

        {!showNewCardForm ? (
          <>
            <PaymentMethodList
              paymentMethods={paymentMethods}
              onDelete={(id) => console.log('Delete payment method:', id)}
              onSetDefault={(id) => console.log('Set default payment method:', id)}
            />

            <Button
              title="Add New Card"
              variant="outline"
              onPress={() => setShowNewCardForm(true)}
              leftIcon={<CreditCard size={20} color={colors.primary} />}
              style={styles.addCardButton}
            />
          </>
        ) : (
          <PaymentMethodForm
            onSubmit={handlePaymentMethodSubmit}
            isLoading={isLoading}
          />
        )}
      </View>

      {error && (
        <View style={[styles.errorContainer, { backgroundColor: colors.error + '20' }]}>
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        </View>
      )}

      <View style={[styles.secureNote, { backgroundColor: colors.surface }]}>
        <Shield size={20} color={colors.success} />
        <Text style={[styles.secureText, { color: colors.textSecondary }]}>
          Your payment is secured with industry-standard encryption
        </Text>
      </View>

      <Button
        title={`Pay ${new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(total)}`}
        onPress={handlePayment}
        isLoading={isLoading}
        style={styles.payButton}
      />
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
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 24,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    marginBottom: 16,
  },
  addCardButton: {
    marginTop: 16,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  secureNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  secureText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  payButton: {
    marginTop: 24,
  },
});