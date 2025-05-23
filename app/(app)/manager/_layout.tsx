import { Stack } from 'expo-router';
import { useAuthContext } from '@/components/AuthContext';

export default function ManagerLayout() {
  const { user } = useAuthContext();

  if (user?.role !== 'manager') {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Manager Dashboard' }} />
      <Stack.Screen name="tenants" options={{ title: 'Tenant Management' }} />
      <Stack.Screen name="maintenance" options={{ title: 'Maintenance' }} />
      <Stack.Screen name="meals" options={{ title: 'Meal Management' }} />
    </Stack>
  );
}