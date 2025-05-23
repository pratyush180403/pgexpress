import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Building2, Banknote, Users } from 'lucide-react-native';
import { Property } from '@/hooks/useProperties';
import Card from './ui/Card';

interface PropertyCardProps {
  property: Property;
  style?: any;
}

export default function PropertyCard({ property, style }: PropertyCardProps) {
  const router = useRouter();
  
  const handlePress = () => {
    router.push(`/properties/${property.id}`);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  // Format percentage
  const formatPercentage = (decimal: number) => {
    return `${(decimal * 100).toFixed(0)}%`;
  };
  
  return (
    <Pressable onPress={handlePress}>
      {({ pressed }) => (
        <Card style={[styles.card, style, pressed && styles.pressed]}>
          <Image source={{ uri: property.imageUrl }} style={styles.image} />
          
          <View style={styles.contentContainer}>
            <Text style={styles.name}>{property.name}</Text>
            <Text style={styles.address}>{property.address}</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Building2 size={16} color="#666666" />
                <Text style={styles.statText}>{property.units} units</Text>
              </View>
              
              <View style={styles.statItem}>
                <Banknote size={16} color="#666666" />
                <Text style={styles.statText}>
                  {formatCurrency(property.monthlyRevenue)}
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Users size={16} color="#666666" />
                <Text style={styles.statText}>
                  {formatPercentage(property.occupancyRate)} occupied
                </Text>
              </View>
            </View>
          </View>
        </Card>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  image: {
    height: 160,
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  contentContainer: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333333',
  },
  address: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666666',
  },
});