import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from './AuthContext';

export interface Room {
  id: string;
  number: string;
  floor: number;
  capacity: number;
  price: number;
  status: 'available' | 'occupied' | 'maintenance';
  amenities: Record<string, any>;
}

export interface RoomBooking {
  id: string;
  roomId: string;
  tenantId: string;
  startDate: string;
  endDate: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  room?: Room;
}

interface RoomBookingContextValue {
  rooms: Room[];
  bookings: RoomBooking[];
  isLoading: boolean;
  error: string | null;
  createBooking: (data: Omit<RoomBooking, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
  approveBooking: (id: string) => Promise<void>;
  rejectBooking: (id: string) => Promise<void>;
  getAvailableRooms: (startDate: string, endDate?: string) => Promise<Room[]>;
}

const RoomBookingContext = createContext<RoomBookingContextValue | undefined>(undefined);

export function RoomBookingProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRooms();
    fetchBookings();

    // Subscribe to real-time updates
    const roomSubscription = supabase
      .channel('rooms')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setRooms(prev => [payload.new as Room, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setRooms(prev => 
              prev.map(room => 
                room.id === payload.new.id ? payload.new as Room : room
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setRooms(prev => prev.filter(room => room.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    const bookingSubscription = supabase
      .channel('bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookings(prev => [payload.new as RoomBooking, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setBookings(prev =>
              prev.map(booking =>
                booking.id === payload.new.id ? payload.new as RoomBooking : booking
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setBookings(prev => prev.filter(booking => booking.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      roomSubscription.unsubscribe();
      bookingSubscription.unsubscribe();
    };
  }, [user]);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('number');

      if (error) throw error;
      setRooms(data || []);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError('Failed to load rooms');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          room:rooms(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const createBooking = async (data: Omit<RoomBooking, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .insert(data);

      if (error) throw error;
    } catch (err) {
      console.error('Error creating booking:', err);
      throw new Error('Failed to create booking');
    }
  };

  const updateBookingStatus = async (id: string, status: RoomBooking['status']) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating booking:', err);
      throw new Error('Failed to update booking');
    }
  };

  const cancelBooking = async (id: string) => {
    await updateBookingStatus(id, 'cancelled');
  };

  const approveBooking = async (id: string) => {
    await updateBookingStatus(id, 'approved');
  };

  const rejectBooking = async (id: string) => {
    await updateBookingStatus(id, 'rejected');
  };

  const getAvailableRooms = async (startDate: string, endDate?: string): Promise<Room[]> => {
    try {
      let query = supabase
        .from('rooms')
        .select('*')
        .eq('status', 'available');

      if (endDate) {
        // Check for no overlapping bookings
        query = query.not('id', 'in', 
          supabase
            .from('bookings')
            .select('room_id')
            .gte('start_date', startDate)
            .lte('end_date', endDate)
            .in('status', ['pending', 'approved'])
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching available rooms:', err);
      throw new Error('Failed to fetch available rooms');
    }
  };

  return (
    <RoomBookingContext.Provider
      value={{
        rooms,
        bookings,
        isLoading,
        error,
        createBooking,
        cancelBooking,
        approveBooking,
        rejectBooking,
        getAvailableRooms,
      }}
    >
      {children}
    </RoomBookingContext.Provider>
  );
}

export function useRoomBooking() {
  const context = useContext(RoomBookingContext);
  if (!context) {
    throw new Error('useRoomBooking must be used within RoomBookingProvider');
  }
  return context;
}