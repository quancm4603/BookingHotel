import app from '@/firebaseConfig';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isFirebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    if (app){
        setFirebaseReady(true);
        SplashScreen.hideAsync
    }
  }, []);

  if (!isFirebaseReady) {
    // Render loading khi Firebase chưa sẵn sàng
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <h1>Loading...</h1>
      </View>
    );
  }

  return (
      <Stack>
        <Stack.Screen name="+not-found" />
      </Stack>
  );
}
