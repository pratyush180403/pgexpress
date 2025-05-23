import { useState, useEffect } from 'react';

export interface Property {
  id: string;
  name: string;
  address: string;
  units: number;
  imageUrl: string;
  monthlyRevenue: number;
  occupancyRate: number;
}

export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  rent: number;
  status: 'occupied' | 'vacant' | 'maintenance';
  tenantId?: string;
}

const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    name: 'Sunset Apartments',
    address: '123 Main St, Anytown, CA 90210',
    units: 24,
    imageUrl: 'https://images.pexels.com/photos/2119713/pexels-photo-2119713.jpeg',
    monthlyRevenue: 48000,
    occupancyRate: 0.92,
  },
  {
    id: '2',
    name: 'Highland Towers',
    address: '456 Oak Ave, Somewhere, NY 10001',
    units: 48,
    imageUrl: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
    monthlyRevenue: 96000,
    occupancyRate: 0.88,
  },
  {
    id: '3',
    name: 'Riverside Commons',
    address: '789 River Rd, Elsewhere, TX 75001',
    units: 36,
    imageUrl: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
    monthlyRevenue: 72000,
    occupancyRate: 0.95,
  },
];

const MOCK_UNITS: Unit[] = [
  {
    id: '101',
    propertyId: '1',
    unitNumber: '101',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    rent: 2000,
    status: 'occupied',
    tenantId: '3',
  },
  {
    id: '102',
    propertyId: '1',
    unitNumber: '102',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 850,
    rent: 1500,
    status: 'vacant',
  },
  {
    id: '201',
    propertyId: '2',
    unitNumber: '201',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1500,
    rent: 2500,
    status: 'occupied',
    tenantId: '5',
  },
  {
    id: '301',
    propertyId: '3',
    unitNumber: '301',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1100,
    rent: 1800,
    status: 'maintenance',
  },
];

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        setProperties(MOCK_PROPERTIES);
        setUnits(MOCK_UNITS);
      } catch (e) {
        setError('Failed to fetch properties');
        console.error('Error fetching properties:', e);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const getPropertyById = (id: string) => {
    return properties.find(property => property.id === id);
  };

  const getUnitsByPropertyId = (propertyId: string) => {
    return units.filter(unit => unit.propertyId === propertyId);
  };

  const getUnitById = (id: string) => {
    return units.find(unit => unit.id === id);
  };

  return {
    properties,
    units,
    isLoading,
    error,
    getPropertyById,
    getUnitsByPropertyId,
    getUnitById,
  };
}