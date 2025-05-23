import { useCallback, useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/components/AuthContext';
import { NotificationsProvider } from '@/components/NotificationsContext';
import { ThemeProvider } from '@/components/ThemeContext';
import { ChatProvider } from '@/components/ChatContext';
import { MealProvider } from '@/components/MealContext';
import { RoomBookingProvider } from '@/components/RoomBookingContext';

// Keep the splash screen visible while fonts are loaded
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-Bold': Inter_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    onLayoutRootView();
  }, [onLayoutRootView]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationsProvider>
          <ChatProvider>
            <MealProvider>
              <RoomBookingProvider>
                <StatusBar style="auto" />
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
                  <Stack.Screen name="(app)" options={{ animation: 'fade' }} />
                  <Stack.Screen name="+not-found" options={{ presentation: 'modal' }} />
                </Stack>
              </RoomBookingProvider>
            </MealProvider>
          </ChatProvider>
        </NotificationsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}