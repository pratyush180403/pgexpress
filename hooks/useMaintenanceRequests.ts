import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/components/AuthContext';

export type MaintenanceStatus = 'open' | 'in_progress' | 'complete' | 'cancelled';
export type MaintenancePriority = 'low' | 'medium' | 'high' | 'urgent';

export interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  roomId: string;
  tenantId: string;
  assignedTo?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  tenant?: {
    id: string;
    name: string;
    email: string;
  };
  assignedStaff?: {
    id: string;
    name: string;
    email: string;
  };
}

interface UseMaintenanceRequestsOptions {
  status?: MaintenanceStatus;
  priority?: MaintenancePriority;
  page?: number;
  limit?: number;
}

export function useMaintenanceRequests(options: UseMaintenanceRequestsOptions = {}) {
  const { user } = useAuthContext();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [totalRequests, setTotalRequests] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.status) params.append('status', options.status);
      if (options.priority) params.append('priority', options.priority);
      if (options.page) params.append('page', options.page.toString());
      if (options.limit) params.append('limit', options.limit.toString());

      const response = await fetch(`/api/maintenance?${params}`);
      if (!response.ok) throw new Error('Failed to fetch maintenance requests');

      const data = await response.json();
      setRequests(data.requests);
      setTotalRequests(data.total);
    } catch (err) {
      console.error('Error fetching maintenance requests:', err);
      setError('Failed to load maintenance requests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('maintenance_requests')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'maintenance_requests',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setRequests(prev => [payload.new as MaintenanceRequest, ...prev]);
            setTotalRequests(prev => prev + 1);
          } else if (payload.eventType === 'UPDATE') {
            setRequests(prev =>
              prev.map(request =>
                request.id === payload.new.id
                  ? payload.new as MaintenanceRequest
                  : request
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setRequests(prev =>
              prev.filter(request => request.id !== payload.old.id)
            );
            setTotalRequests(prev => prev - 1);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [options.status, options.priority, options.page, options.limit]);

  const createRequest = async (data: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create maintenance request');

      const newRequest = await response.json();
      return newRequest;
    } catch (err) {
      console.error('Error creating maintenance request:', err);
      throw new Error('Failed to create maintenance request');
    }
  };

  const updateRequest = async (id: string, updates: Partial<MaintenanceRequest>) => {
    try {
      const response = await fetch(`/api/maintenance/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update maintenance request');

      const updatedRequest = await response.json();
      return updatedRequest;
    } catch (err) {
      console.error('Error updating maintenance request:', err);
      throw new Error('Failed to update maintenance request');
    }
  };

  const assignRequest = async (id: string, assignedTo: string) => {
    try {
      const response = await fetch(`/api/maintenance/${id}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedTo }),
      });

      if (!response.ok) throw new Error('Failed to assign maintenance request');

      const updatedRequest = await response.json();
      return updatedRequest;
    } catch (err) {
      console.error('Error assigning maintenance request:', err);
      throw new Error('Failed to assign maintenance request');
    }
  };

  return {
    requests,
    totalRequests,
    isLoading,
    error,
    createRequest,
    updateRequest,
    assignRequest,
    refresh: fetchRequests,
  };
}