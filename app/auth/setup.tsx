import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';

export default function AuthSetupScreen() {
  const router = useRouter();
  const { setupLocalAuth, biometricAvailable } = useAuthStore();
  
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [enableBiometrics, setEnableBiometrics] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSetup = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      await setupLocalAuth(name.trim(), password, enableBiometrics);
      router.replace('/(authenticated)');
    } catch (error) {
      Alert.alert('Setup Failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 pt-20">
      <View className="mb-12">
        <Text className="text-3xl font-bold text-gray-900 mb-2">Welcome to Shop Manager</Text>
        <Text className="text-gray-600">Set up your local account to get started</Text>
      </View>

      <View className="space-y-4">
        <View>
          <Text className="text-gray-700 text-sm font-medium mb-2">Your Name</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>

        <View>
          <Text className="text-gray-700 text-sm font-medium mb-2">Password</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <View>
          <Text className="text-gray-700 text-sm font-medium mb-2">Confirm Password</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        {biometricAvailable && (
          <View className="flex-row items-center justify-between py-4">
            <View className="flex-1">
              <Text className="text-gray-700 font-medium">Enable Biometric Login</Text>
              <Text className="text-gray-500 text-sm">Use fingerprint or face recognition</Text>
            </View>
            <Switch
              value={enableBiometrics}
              onValueChange={setEnableBiometrics}
              trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
              thumbColor={enableBiometrics ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        )}
      </View>

      <TouchableOpacity
        className={`mt-8 py-4 rounded-lg ${isLoading ? 'bg-gray-400' : 'bg-blue-600'}`}
        onPress={handleSetup}
        disabled={isLoading}
      >
        <Text className="text-white text-center font-semibold text-lg">
          {isLoading ? 'Setting up...' : 'Create Account'}
        </Text>
      </TouchableOpacity>

      <View className="mt-8 p-4 bg-blue-50 rounded-lg">
        <Text className="text-blue-800 text-sm">
          🔒 Your data is stored locally on your device. You can upgrade to Premium later to sync across devices.
        </Text>
      </View>
    </View>
  );
}