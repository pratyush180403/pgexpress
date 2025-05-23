import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { CreditCard, Plus, Trash2 } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeContext';
import Button from '@/components/ui/Button';

interface PaymentMethod {
  id: string;
  type: 'card';
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export default function PaymentMethodsScreen() {
  const { colors } = useTheme();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      last4: '4242',
      brand: 'visa',
      expMonth: 12,
      expYear: 2025,
      isDefault: true,
    },
  ]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleAddCard = () => {
    // TODO: Implement Stripe card addition
    console.log('Add card');
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id);
      // TODO: Implement Stripe card deletion
      setPaymentMethods(methods =>
        methods.filter(method => method.id !== id)
      );
    } catch (err) {
      console.error('Failed to delete card:', err);
    } finally {
      setIsDeleting(null);
    }
  };

  const getBrandIcon = (brand: string) => {
    // TODO: Add card brand icons
    return <CreditCard size={24} color={colors.primary} />;
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Payment Methods</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Manage your payment methods
        </Text>
      </View>

      {paymentMethods.map(method => (
        <View
          key={method.id}
          style={[styles.card, { backgroundColor: colors.surface }]}
        >
          <View style={styles.cardHeader}>
            {getBrandIcon(method.brand)}
            <View style={styles.cardInfo}>
              <Text style={[styles.cardNumber, { color: colors.text }]}>
                •••• {method.last4}
              </Text>
              <Text style={[styles.cardExpiry, { color: colors.textSecondary }]}>
                Expires {method.expMonth}/{method.expYear}
              </Text>
            </View>
          </View>

          <View style={styles.cardActions}>
            {!method.isDefault && (
              <Button
                title="Set as Default"
                variant="outline"
                onPress={() => handleSetDefault(method.id)}
                style={styles.actionButton}
              />
            )}
            <Button
              title="Delete"
              variant="danger"
              onPress={() => handleDelete(method.id)}
              isLoading={isDeleting === method.id}
              style={styles.actionButton}
              leftIcon={<Trash2 size={20} color={colors.error} />}
            />
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

      <TouchableOpacity
        style={[styles.addCard, { backgroundColor: colors.surface }]}
        onPress={handleAddCard}
      >
        <Plus size={24} color={colors.primary} />
        <Text style={[styles.addCardText, { color: colors.primary }]}>
          Add New Card
        </Text>
      </TouchableOpacity>

      <Text style={[styles.secureText, { color: colors.textSecondary }]}>
        Your payment information is securely stored using Stripe.
      </Text>
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
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardInfo: {
    marginLeft: 12,
  },
  cardNumber: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
  },
  cardExpiry: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
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
  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  addCardText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  secureText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});