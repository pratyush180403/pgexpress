import { useCallback, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Define user roles
export type UserRole = 'admin' | 'manager' | 'tenant';

// Define user type
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  verified: boolean;
  kyc_status: 'pending' | 'approved' | 'rejected';
  policeVerification: 'pending' | 'approved' | 'rejected';
}

// Define auth context values
export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

// Hardcoded users for demo
const DEMO_USERS = {
  'admin@example.com': {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin' as UserRole,
    verified: true,
    kyc_status: 'approved',
    policeVerification: 'approved',
    password: 'admin123'
  },
  'manager@example.com': {
    id: '2',
    email: 'manager@example.com',
    name: 'Manager User',
    role: 'manager' as UserRole,
    verified: true,
    kyc_status: 'approved',
    policeVerification: 'approved',
    password: 'manager123'
  },
  'tenant@example.com': {
    id: '3',
    email: 'tenant@example.com',
    name: 'Tenant User',
    role: 'tenant' as UserRole,
    verified: true,
    kyc_status: 'approved',
    policeVerification: 'approved',
    password: 'tenant123'
  }
};

// Define storage key
const AUTH_KEY = 'auth_user';

// Web fallback for SecureStore
const secureStorage = {
  async getItemAsync(key: string) {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  async setItemAsync(key: string, value: string) {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    return SecureStore.setItemAsync(key, value);
  },
  async deleteItemAsync(key: string) {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    return SecureStore.deleteItemAsync(key);
  },
};

export function useAuth(): AuthContextValue {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user on mount
  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await secureStorage.getItemAsync(AUTH_KEY);
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (e) {
        console.error('Failed to load authentication state', e);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  // Sign in function
  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Check demo users first
      const demoUser = DEMO_USERS[email.toLowerCase()];
      
      if (demoUser && demoUser.password === password) {
        const userData = {
          id: demoUser.id,
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role,
          verified: demoUser.verified,
          kyc_status: demoUser.kyc_status,
          policeVerification: demoUser.policeVerification
        };

        await secureStorage.setItemAsync(AUTH_KEY, JSON.stringify(userData));
        setUser(userData);
        return;
      }

      throw new Error('Invalid email or password');
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An error occurred during sign in';
      setError(errorMessage);
      console.error('Sign in error:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sign out function
  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await secureStorage.deleteItemAsync(AUTH_KEY);
      setUser(null);
    } catch (e) {
      console.error('Sign out error:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isLoading,
    signIn,
    signOut,
    error,
  };
}