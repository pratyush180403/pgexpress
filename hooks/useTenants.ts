import { useState, useEffect } from 'react';

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  unitId: string;
  leaseStart: string;
  leaseEnd: string;
  rentAmount: number;
  balance: number;
  status: 'current' | 'past_due' | 'eviction';
  documents: Document[];
}

export interface Document {
  id: string;
  name: string;
  type: 'lease' | 'id' | 'income' | 'other';
  uploadDate: string;
  url: string;
}

const MOCK_TENANTS: Tenant[] = [
  {
    id: '3',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '555-123-4567',
    unitId: '101',
    leaseStart: '2023-01-01',
    leaseEnd: '2024-01-01',
    rentAmount: 2000,
    balance: 0,
    status: 'current',
    documents: [
      {
        id: 'd1',
        name: 'Lease Agreement',
        type: 'lease',
        uploadDate: '2022-12-15',
        url: 'https://example.com/docs/lease1.pdf',
      },
    ],
  },
  {
    id: '5',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '555-987-6543',
    unitId: '201',
    leaseStart: '2023-03-01',
    leaseEnd: '2024-03-01',
    rentAmount: 2500,
    balance: 500,
    status: 'past_due',
    documents: [
      {
        id: 'd2',
        name: 'Lease Agreement',
        type: 'lease',
        uploadDate: '2023-02-15',
        url: 'https://example.com/docs/lease2.pdf',
      },
    ],
  },
];

export function useTenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        setTenants(MOCK_TENANTS);
      } catch (e) {
        setError('Failed to fetch tenants');
        console.error('Error fetching tenants:', e);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const getTenantById = (id: string) => {
    return tenants.find(tenant => tenant.id === id);
  };

  const getTenantByUnitId = (unitId: string) => {
    return tenants.find(tenant => tenant.unitId === unitId);
  };

  return {
    tenants,
    isLoading,
    error,
    getTenantById,
    getTenantByUnitId,
  };
}