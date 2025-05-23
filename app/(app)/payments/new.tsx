import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { CreditCard, Calendar } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeContext';
import Button from '@/components/ui/Button';

export default function NewPaymentScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement Stripe payment
      router.back();
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>New Payment</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Amount (₹)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
            placeholder="Enter amount"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Description</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
            placeholder="Enter payment description"
            placeholderTextColor={colors.textSecondary}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.paymentMethods}>
          <Text style={[styles.label, { color: colors.text, marginBottom: 16 }]}>
            Payment Method
          </Text>
          
          <View style={styles.methodsGrid}>
            <View style={[styles.methodCard, { backgroundColor: colors.background }]}>
              <CreditCard size={24} color={colors.primary} />
              <Text style={[styles.methodText, { color: colors.text }]}>Credit Card</Text>
            </View>
            
            <View style={[styles.methodCard, { backgroundColor: colors.background }]}>
              <Calendar size={24} color={colors.primary} />
              <Text style={[styles.methodText, { color: colors.text }]}>UPI</Text>
            </View>
          </View>
        </View>

        <Button
          title="Make Payment"
          onPress={handleSubmit}
          isLoading={isLoading}
          style={styles.button}
        />
      </View>
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
  card: {
    borderRadius: 12,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  paymentMethods: {
    marginBottom: 24,
  },
  methodsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  methodCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  methodText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
  },
  button: {
    marginTop: 8,
  },
});