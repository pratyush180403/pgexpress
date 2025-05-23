import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { useAuthContext } from '@/components/AuthContext';
import { useMaintenanceRequests } from '@/hooks/useMaintenanceRequests';
import { useRoomBooking } from '@/components/RoomBookingContext';
import MaintenanceRequestCard from '@/components/MaintenanceRequestCard';
import PaymentSummary from '@/components/payments/PaymentSummary';
import Button from '@/components/ui/Button';

export default function TenantDashboardScreen() {
  const { colors } = useTheme();
  const { user } = useAuthContext();
  const { requests } = useMaintenanceRequests();
  const { bookings } = useRoomBooking();

  if (user?.role !== 'tenant') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          Access denied. Tenant access only.
        </Text>
      </View>
    );
  }

  const activeBooking = bookings[0]; // Get most recent booking

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Welcome, {user.name}</Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Room Details</Text>
        {activeBooking ? (
          <>
            <Text style={[styles.roomNumber, { color: colors.text }]}>
              Room {activeBooking.room?.number}
            </Text>
            <Text style={[styles.bookingDates, { color: colors.textSecondary }]}>
              From: {new Date(activeBooking.startDate).toLocaleDateString()}
              {activeBooking.endDate && ` To: ${new Date(activeBooking.endDate).toLocaleDateString()}`}
            </Text>
          </>
        ) : (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No active bookings
          </Text>
        )}
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Summary</Text>
        <PaymentSummary
          subtotal={15000}
          tax={1500}
          total={16500}
          currency="INR"
        />
        <Button
          title="View Payment History"
          variant="outline"
          style={styles.button}
        />
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Recent Maintenance Requests
        </Text>
        {requests.slice(0, 3).map(request => (
          <MaintenanceRequestCard
            key={request.id}
            request={request}
          />
        ))}
        <Button
          title="View All Requests"
          variant="outline"
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
  header: {
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    marginBottom: 16,
  },
  roomNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  bookingDates: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginVertical: 16,
  },
  button: {
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: 24,
  },
});