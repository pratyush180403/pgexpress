import { Stack } from 'expo-router';
import { useAuthContext } from '@/components/AuthContext';

export default function TenantLayout() {
  const { user } = useAuthContext();

  if (user?.role !== 'tenant') {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'My Dashboard' }} />
      <Stack.Screen name="profile" options={{ title: 'My Profile' }} />
      <Stack.Screen name="payments" options={{ title: 'My Payments' }} />
      <Stack.Screen name="maintenance" options={{ title: 'Maintenance Requests' }} />
      <Stack.Screen name="meals" options={{ title: 'Meal Bookings' }} />
    </Stack>
  );
}