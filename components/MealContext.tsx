import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from './AuthContext';

export interface Meal {
  id: string;
  name: string;
  description: string;
  type: string;
  price: number;
  availableOn: string[];
}

export interface MealBooking {
  id: string;
  userId: string;
  mealId: string;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  meal: Meal;
}

export interface MealPreferences {
  userId: string;
  dietaryRestrictions: string[];
  allergies: string[];
}

export interface MealFeedback {
  id: string;
  bookingId: string;
  rating: number;
  comments: string;
}

interface MealContextValue {
  meals: Meal[];
  bookings: MealBooking[];
  preferences: MealPreferences | null;
  isLoading: boolean;
  error: string | null;
  bookMeal: (mealId: string, date: string) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  updatePreferences: (preferences: Partial<MealPreferences>) => Promise<void>;
  submitFeedback: (bookingId: string, rating: number, comments: string) => Promise<void>;
}

const MealContext = createContext<MealContextValue | undefined>(undefined);

export function MealProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthContext();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [bookings, setBookings] = useState<MealBooking[]>([]);
  const [preferences, setPreferences] = useState<MealPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch meals
  useEffect(() => {
    async function fetchMeals() {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('meals')
          .select('*')
          .order('name');

        if (fetchError) throw fetchError;

        setMeals(data || []);
      } catch (err) {
        console.error('Error fetching meals:', err);
        setError('Failed to load meals');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMeals();
  }, []);

  // Fetch user's bookings and preferences
  useEffect(() => {
    if (!user) return;

    async function fetchUserData() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('meal_bookings')
          .select(`
            *,
            meal:meals(*)
          `)
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        if (bookingsError) throw bookingsError;

        // Fetch preferences
        const { data: preferencesData, error: preferencesError } = await supabase
          .from('meal_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (preferencesError && preferencesError.code !== 'PGRST116') {
          throw preferencesError;
        }

        setBookings(bookingsData || []);
        setPreferences(preferencesData || null);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, [user]);

  const bookMeal = async (mealId: string, date: string) => {
    if (!user) throw new Error('Not authenticated');

    try {
      const { data, error } = await supabase
        .from('meal_bookings')
        .insert({
          user_id: user.id,
          meal_id: mealId,
          date,
        })
        .select(`
          *,
          meal:meals(*)
        `)
        .single();

      if (error) throw error;

      setBookings(prev => [data, ...prev]);
    } catch (err) {
      console.error('Error booking meal:', err);
      throw new Error('Failed to book meal');
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('meal_bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;

      setBookings(prev =>
        prev.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );
    } catch (err) {
      console.error('Error cancelling booking:', err);
      throw new Error('Failed to cancel booking');
    }
  };

  const updatePreferences = async (newPreferences: Partial<MealPreferences>) => {
    if (!user) throw new Error('Not authenticated');

    try {
      const { data, error } = await supabase
        .from('meal_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
          ...newPreferences,
        })
        .select()
        .single();

      if (error) throw error;

      setPreferences(data);
    } catch (err) {
      console.error('Error updating preferences:', err);
      throw new Error('Failed to update preferences');
    }
  };

  const submitFeedback = async (bookingId: string, rating: number, comments: string) => {
    try {
      const { error } = await supabase
        .from('meal_feedback')
        .insert({
          booking_id: bookingId,
          rating,
          comments,
        });

      if (error) throw error;
    } catch (err) {
      console.error('Error submitting feedback:', err);
      throw new Error('Failed to submit feedback');
    }
  };

  return (
    <MealContext.Provider
      value={{
        meals,
        bookings,
        preferences,
        isLoading,
        error,
        bookMeal,
        cancelBooking,
        updatePreferences,
        submitFeedback,
      }}
    >
      {children}
    </MealContext.Provider>
  );
}

export function useMeal() {
  const context = useContext(MealContext);
  if (context === undefined) {
    throw new Error('useMeal must be used within a MealProvider');
  }
  return context;
}