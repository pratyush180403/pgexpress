import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, IndianRupee, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useRoomBooking } from '@/components/RoomBookingContext';
import { useTheme } from '@/components/ThemeContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function BookingConfirmationScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { roomId } = useLocalSearchParams();
  const { rooms, createBooking, isLoading } = useRoomBooking();
  const [startDate, setStartDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  const room = rooms.find(r => r.id === roomId);

  if (!room) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>Room not found</Text>
      </View>
    );
  }

  const handleBooking = async () => {
    try {
      setError(null);
      
      if (!startDate) {
        throw new Error('Please select a move-in date');
      }

      await createBooking({
        roomId: room.id,
        startDate,
      });

      router.replace('/rooms/success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: colors.text }]}>Booking Details</Text>

      <View style={[styles.roomCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.roomNumber, { color: colors.text }]}>
          Room {room.number}
        </Text>
        <Text style={[styles.floor, { color: colors.textSecondary }]}>
          Floor {room.floor}
        </Text>
        <Text style={[styles.price, { color: colors.primary }]}>
          ₹{room.price.toLocaleString()} per month
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Move-in Date
        </Text>
        <Input
          value={startDate}
          onChangeText={setStartDate}
          placeholder="Select date"
          leftIcon={<Calendar size={20} color={colors.textSecondary} />}
        />
      </View>

      <View style={[styles.summary, { backgroundColor: colors.surface }]}>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
            Monthly Rent
          </Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>
            ₹{room.price.toLocaleString()}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
            Security Deposit
          </Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>
            ₹{(room.price * 2).toLocaleString()}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.summaryRow}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>
            Total Due Now
          </Text>
          <Text style={[styles.totalValue, { color: colors.primary }]}>
            ₹{(room.price * 3).toLocaleString()}
          </Text>
        </View>
      </View>

      {error && (
        <View style={[styles.errorContainer, { backgroundColor: colors.error + '20' }]}>
          <AlertCircle size={20} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        </View>
      )}

      <Button
        title="Confirm Booking"
        onPress={handleBooking}
        isLoading={isLoading}
        style={styles.confirmButton}
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
  roomCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  roomNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  floor: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    marginBottom: 12,
  },
  summary: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  totalValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  confirmButton: {
    marginBottom: 24,
  },
});