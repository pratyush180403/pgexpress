import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Users, IndianRupee } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeContext';
import { Room } from '@/components/RoomBookingContext';

interface RoomCardProps {
  room: Room;
  onPress: () => void;
}

export default function RoomCard({ room, onPress }: RoomCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface }]}
      onPress={onPress}
    >
      <Image
        source={{ uri: 'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg' }}
        style={styles.image}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.roomNumber, { color: colors.text }]}>
            Room {room.number}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: colors.success + '20' }]}>
            <Text style={[styles.statusText, { color: colors.success }]}>
              Available
            </Text>
          </View>
        </View>

        <Text style={[styles.floor, { color: colors.textSecondary }]}>
          Floor {room.floor}
        </Text>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Users size={16} color={colors.primary} />
            <Text style={[styles.detailText, { color: colors.text }]}>
              {room.capacity} {room.capacity === 1 ? 'person' : 'people'}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <IndianRupee size={16} color={colors.primary} />
            <Text style={[styles.detailText, { color: colors.text }]}>
              {room.price.toLocaleString()} /month
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomNumber: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  floor: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});