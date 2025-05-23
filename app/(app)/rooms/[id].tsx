import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, Users, IndianRupee, Wifi, Tv, Coffee } from 'lucide-react-native';
import { useRoomBooking } from '@/components/RoomBookingContext';
import { useTheme } from '@/components/ThemeContext';
import Button from '@/components/ui/Button';
import VirtualTourViewer from '@/components/VirtualTourViewer';

export default function RoomDetailsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();
  const { rooms, isLoading } = useRoomBooking();
  const [showVirtualTour, setShowVirtualTour] = useState(false);

  const room = rooms.find(r => r.id === id);

  if (!room) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>Room not found</Text>
      </View>
    );
  }

  const amenityIcons = {
    wifi: Wifi,
    tv: Tv,
    coffee: Coffee,
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Image
        source={{ uri: 'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg' }}
        style={styles.image}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.roomNumber, { color: colors.text }]}>
              Room {room.number}
            </Text>
            <Text style={[styles.floor, { color: colors.textSecondary }]}>
              Floor {room.floor}
            </Text>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: colors.success + '20' }]}>
            <Text style={[styles.statusText, { color: colors.success }]}>
              Available
            </Text>
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
          <View style={styles.infoItem}>
            <Users size={20} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.text }]}>
              Capacity: {room.capacity} {room.capacity === 1 ? 'person' : 'people'}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <IndianRupee size={20} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.text }]}>
              ₹{room.price.toLocaleString()} per month
            </Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Amenities
          </Text>
          <View style={styles.amenitiesGrid}>
            {Object.entries(room.amenities).map(([key, value]) => {
              if (!value) return null;
              const Icon = amenityIcons[key as keyof typeof amenityIcons];
              return (
                <View key={key} style={styles.amenityItem}>
                  {Icon && <Icon size={20} color={colors.primary} />}
                  <Text style={[styles.amenityText, { color: colors.text }]}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <Button
          title="View Virtual Tour"
          variant="outline"
          onPress={() => setShowVirtualTour(true)}
          style={styles.tourButton}
        />

        <Button
          title="Book Now"
          onPress={() => router.push(`/rooms/booking-confirmation?roomId=${room.id}`)}
          style={styles.bookButton}
        />
      </View>

      {showVirtualTour && (
        <VirtualTourViewer
          images={[
            'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg',
            'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg',
          ]}
          hotspots={[
            {
              id: '1',
              x: 50,
              y: 50,
              title: 'Window View',
              description: 'Natural lighting with city view',
            },
          ]}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  roomNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  floor: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginLeft: 8,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    marginBottom: 12,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amenityText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  tourButton: {
    marginBottom: 12,
  },
  bookButton: {
    marginBottom: 24,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: 24,
  },
});