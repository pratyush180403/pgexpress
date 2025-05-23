import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { useAuthContext } from '@/components/AuthContext';

export default function Root() {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return <View />;
  }

  return user ? <Redirect href="/(app)" /> : <Redirect href="/(auth)/login" />;
}