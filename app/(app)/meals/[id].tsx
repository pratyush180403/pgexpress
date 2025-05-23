import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, Clock, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useMeal } from '@/components/MealContext';
import { useTheme } from '@/components/ThemeContext';
import Button from '@/components/ui/Button';

export default function MealDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();
  const { meals, bookMeal, isLoading } = useMeal();
  const [error, setError] = useState<string | null>(null);

  const meal = meals.find(m => m.id === id);

  if (!meal) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          Meal not found
        </Text>
      </View>
    );
  }

  const handleBook = async () => {
    try {
      setError(null);
      await bookMeal(meal.id, new Date().toISOString());
      router.push('/meals/bookings');
    } catch (err) {
      setError('Failed to book meal');
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Image
        source={{ uri: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg' }}
        style={styles.image}
      />

      <View style={styles.details}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: colors.text }]}>{meal.name}</Text>
          <Text style={[styles.price, { color: colors.primary }]}>
            ₹{meal.price}
          </Text>
        </View>

        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {meal.description}
        </Text>

        <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
          <View style={styles.infoItem}>
            <Calendar size={20} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.text }]}>
              Available {meal.availableOn.join(', ')}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Clock size={20} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.text }]}>
              {meal.type}
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
          title="Book Now"
          onPress={handleBook}
          isLoading={isLoading}
          style={styles.bookButton}
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
    paddingBottom: 32,
  },
  image: {
    width: '100%',
    height: 300,
  },
  details: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  price: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    marginBottom: 24,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
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
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  bookButton: {
    marginTop: 8,
  },
});