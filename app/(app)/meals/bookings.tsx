import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Clock, Star } from 'lucide-react-native';
import { useMeal } from '@/components/MealContext';
import { useTheme } from '@/components/ThemeContext';
import Button from '@/components/ui/Button';

export default function BookingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { bookings, cancelBooking, submitFeedback } = useMeal();
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleCancel = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);
    } catch (err) {
      console.error('Failed to cancel booking:', err);
    }
  };

  const handleFeedback = async () => {
    if (!selectedBooking || rating === 0) return;

    try {
      await submitFeedback(selectedBooking, rating, feedback);
      setSelectedBooking(null);
      setRating(0);
      setFeedback('');
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>My Bookings</Text>
      </View>

      {bookings.map(booking => (
        <View
          key={booking.id}
          style={[styles.bookingCard, { backgroundColor: colors.surface }]}
        >
          <View style={styles.bookingHeader}>
            <Text style={[styles.mealName, { color: colors.text }]}>
              {booking.meal.name}
            </Text>
            <Text
              style={[
                styles.status,
                {
                  color:
                    booking.status === 'confirmed'
                      ? colors.success
                      : booking.status === 'cancelled'
                      ? colors.error
                      : colors.warning,
                },
              ]}
            >
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Text>
          </View>

          <View style={styles.bookingInfo}>
            <View style={styles.infoItem}>
              <Calendar size={16} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {formatDate(booking.date)}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Clock size={16} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {booking.meal.type}
              </Text>
            </View>
          </View>

          {booking.status === 'confirmed' && (
            <View style={styles.actions}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => handleCancel(booking.id)}
                style={styles.actionButton}
              />
              <Button
                title="Give Feedback"
                onPress={() => setSelectedBooking(booking.id)}
                style={styles.actionButton}
              />
            </View>
          )}

          {selectedBooking === booking.id && (
            <View style={styles.feedbackContainer}>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map(value => (
                  <TouchableOpacity
                    key={value}
                    onPress={() => setRating(value)}
                  >
                    <Star
                      size={24}
                      color={value <= rating ? colors.primary : colors.textSecondary}
                      fill={value <= rating ? colors.primary : 'none'}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <Input
                placeholder="Write your feedback..."
                value={feedback}
                onChangeText={setFeedback}
                multiline
                numberOfLines={3}
                containerStyle={styles.feedbackInput}
              />

              <Button
                title="Submit Feedback"
                onPress={handleFeedback}
                disabled={rating === 0}
              />
            </View>
          )}
        </View>
      ))}

      {bookings.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No bookings found
          </Text>
          <Button
            title="Browse Meals"
            onPress={() => router.push('/meals')}
            style={styles.browseButton}
          />
        </View>
      )}
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
  },
  bookingCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealName: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
  },
  status: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  bookingInfo: {
    gap: 8,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  feedbackContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  feedbackInput: {
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 32,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
  },
  browseButton: {
    minWidth: 200,
  },
});