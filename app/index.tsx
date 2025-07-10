import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';

export default function IndexPage() {
  const router = useRouter();
  const { 
    isLoading, 
    isAuthenticated, 
    isLocalAuthSetup 
  } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (!isLocalAuthSetup) {
        // First time user - setup authentication
        router.replace('/auth/setup');
      } else if (!isAuthenticated) {
        // Returning user - authenticate
        router.replace('/auth/login');
      } else {
        // Already authenticated - go to main app
        router.replace('/(authenticated)');
      }
    }
  }, [isLoading, isAuthenticated, isLocalAuthSetup, router]);

  // Show loading screen while checking auth status
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text className="mt-4 text-gray-600">Loading Shop Manager...</Text>
    </View>
  );
}