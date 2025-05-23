import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Filter, Star } from 'lucide-react-native';
import { useMeal } from '@/components/MealContext';
import { useTheme } from '@/components/ThemeContext';
import Button from '@/components/ui/Button';

export default function MealsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { meals, bookings, isLoading } = useMeal();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  const filteredMeals = meals.filter(meal => {
    if (selectedType && meal.type !== selectedType) return false;
    return true;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDateChange = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Meals</Text>
      </View>

      <View style={[styles.dateSelector, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={styles.dateArrow}
          onPress={() => handleDateChange(-1)}
        >
          <Text style={[styles.dateArrowText, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>

        <View style={styles.dateContainer}>
          <Calendar size={20} color={colors.primary} />
          <Text style={[styles.dateText, { color: colors.text }]}>
            {formatDate(selectedDate)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.dateArrow}
          onPress={() => handleDateChange(1)}
        >
          <Text style={[styles.dateArrowText, { color: colors.primary }]}>→</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.typeFilters}
        contentContainerStyle={styles.typeFiltersContent}
      >
        {mealTypes.map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeFilter,
              { backgroundColor: colors.surface },
              selectedType === type && { backgroundColor: colors.primary },
            ]}
            onPress={() => setSelectedType(type === selectedType ? null : type)}
          >
            <Text
              style={[
                styles.typeFilterText,
                { color: selectedType === type ? '#FFFFFF' : colors.text },
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filteredMeals.map(meal => (
        <View
          key={meal.id}
          style={[styles.mealCard, { backgroundColor: colors.surface }]}
        >
          <Image
            source={{ uri: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg' }}
            style={styles.mealImage}
          />

          <View style={styles.mealContent}>
            <View style={styles.mealHeader}>
              <Text style={[styles.mealName, { color: colors.text }]}>
                {meal.name}
              </Text>
              <Text style={[styles.mealPrice, { color: colors.primary }]}>
                ₹{meal.price}
              </Text>
            </View>

            <Text style={[styles.mealDescription, { color: colors.textSecondary }]}>
              {meal.description}
            </Text>

            <View style={styles.mealFooter}>
              <View style={styles.mealType}>
                <Text style={[styles.mealTypeText, { color: colors.textSecondary }]}>
                  {meal.type}
                </Text>
              </View>

              <Button
                title="Book Now"
                onPress={() => router.push(`/meals/${meal.id}`)}
                style={styles.bookButton}
              />
            </View>
          </View>
        </View>
      ))}
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
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  dateArrow: {
    padding: 8,
  },
  dateArrowText: {
    fontSize: 24,
    fontFamily: 'Inter-Medium',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  typeFilters: {
    marginBottom: 16,
  },
  typeFiltersContent: {
    paddingHorizontal: 4,
    gap: 8,
  },
  typeFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  typeFilterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  mealCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  mealImage: {
    width: '100%',
    height: 200,
  },
  mealContent: {
    padding: 16,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealName: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
  },
  mealPrice: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  mealDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
  },
  mealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealType: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  mealTypeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  bookButton: {
    minWidth: 100,
  },
});