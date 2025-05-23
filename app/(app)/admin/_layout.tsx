import { Stack } from 'expo-router';
import { useAuthContext } from '@/components/AuthContext';

export default function AdminLayout() {
  const { user } = useAuthContext();

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Admin Dashboard' }} />
      <Stack.Screen name="users" options={{ title: 'User Management' }} />
      <Stack.Screen name="rooms" options={{ title: 'Room Management' }} />
      <Stack.Screen name="maintenance" options={{ title: 'Maintenance' }} />
      <Stack.Screen name="reports" options={{ title: 'Reports' }} />
    </Stack>
  );
}