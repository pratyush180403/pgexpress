import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useRoomBooking } from '@/components/RoomBookingContext';
import { useTheme } from '@/components/ThemeContext';
import SearchBar from '@/components/ui/SearchBar';
import Button from '@/components/ui/Button';
import RoomCard from '@/components/rooms/RoomCard';

export default function RoomsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { rooms, isLoading } = useRoomBooking();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRooms = searchQuery
    ? rooms.filter(room =>
        room.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.amenities?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    : rooms;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Available Rooms</Text>
        
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search rooms..."
        />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.roomsGrid}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : filteredRooms.length > 0 ? (
          filteredRooms.map(room => (
            <RoomCard
              key={room.id}
              room={room}
              onPress={() => router.push(`/rooms/${room.id}`)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No rooms found
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
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
  content: {
    flex: 1,
  },
  roomsGrid: {
    padding: 16,
    gap: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
});