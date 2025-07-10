import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const { 
    authenticateWithPassword, 
    authenticateWithBiometrics, 
    biometricAvailable 
  } = useAuthStore();
  
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordLogin = async () => {
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    try {
      setIsLoading(true);
      await authenticateWithPassword(password);
      router.replace('/(authenticated)');
    } catch (error) {
      Alert.alert('Login Failed', error instanceof Error ? error.message : 'Invalid password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      setIsLoading(true);
      await authenticateWithBiometrics();
      router.replace('/(authenticated)');
    } catch (error) {
      Alert.alert('Biometric Failed', error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <View className="mb-12 items-center">
        <View className="w-20 h-20 bg-blue-600 rounded-full items-center justify-center mb-6">
          <Ionicons name="storefront" size={32} color="white" />
        </View>
        <Text className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</Text>
        <Text className="text-gray-600 text-center">Enter your password to access your shop data</Text>
      </View>

      <View className="space-y-6">
        <View>
          <Text className="text-gray-700 text-sm font-medium mb-2">Password</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-4 text-gray-900 text-lg"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoFocus
          />
        </View>

        <TouchableOpacity
          className={`py-4 rounded-lg ${isLoading ? 'bg-gray-400' : 'bg-blue-600'}`}
          onPress={handlePasswordLogin}
          disabled={isLoading}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {isLoading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>

        {biometricAvailable && (
          <>
            <View className="flex-row items-center">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="px-4 text-gray-500">or</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            <TouchableOpacity
              className="py-4 border-2 border-blue-600 rounded-lg flex-row items-center justify-center"
              onPress={handleBiometricLogin}
              disabled={isLoading}
            >
              <Ionicons name="finger-print" size={24} color="#3B82F6" />
              <Text className="text-blue-600 font-semibold text-lg ml-2">
                Use Biometric
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity 
        className="mt-8 py-2"
        onPress={() => Alert.alert(
          'Reset Account', 
          'This will delete all your data. Are you sure?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Reset', style: 'destructive', onPress: () => router.replace('/auth/setup') }
          ]
        )}
      >
        <Text className="text-gray-500 text-center">Forgot password? Reset account</Text>
      </TouchableOpacity>
    </View>
  );
}