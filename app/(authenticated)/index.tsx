import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';

export default function DashboardScreen() {
  const { user } = useAuthStore();

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-6">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</Text>
            <Text className="text-gray-600">Here's your shop overview</Text>
          </View>
          <TouchableOpacity className="w-10 h-10 bg-blue-600 rounded-full items-center justify-center">
            <Ionicons name="notifications-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Stats */}
      <View className="px-6 py-4">
        <Text className="text-lg font-semibold text-gray-900 mb-4">Today's Overview</Text>
        <View className="flex-row space-x-4">
          <View className="flex-1 bg-white p-4 rounded-xl">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-gray-600 text-sm">Sales</Text>
                <Text className="text-2xl font-bold text-green-600">$1,234</Text>
              </View>
              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                <Ionicons name="trending-up" size={20} color="#16A34A" />
              </View>
            </View>
          </View>
          
          <View className="flex-1 bg-white p-4 rounded-xl">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-gray-600 text-sm">Expenses</Text>
                <Text className="text-2xl font-bold text-red-600">$456</Text>
              </View>
              <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center">
                <Ionicons name="trending-down" size={20} color="#DC2626" />
              </View>
            </View>
          </View>
        </View>
        
        <View className="mt-4 bg-white p-4 rounded-xl">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-gray-600 text-sm">Net Profit</Text>
              <Text className="text-2xl font-bold text-blue-600">$778</Text>
              <Text className="text-green-600 text-sm">+12% from yesterday</Text>
            </View>
            <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
              <Ionicons name="cash" size={24} color="#3B82F6" />
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="px-6 py-4">
        <Text className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</Text>
        <View className="flex-row flex-wrap">
          <TouchableOpacity className="w-1/2 p-2">
            <View className="bg-white p-4 rounded-xl items-center">
              <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-2">
                <Ionicons name="add" size={24} color="#3B82F6" />
              </View>
              <Text className="text-gray-900 font-medium">New Sale</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity className="w-1/2 p-2">
            <View className="bg-white p-4 rounded-xl items-center">
              <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-2">
                <Ionicons name="cube" size={24} color="#16A34A" />
              </View>
              <Text className="text-gray-900 font-medium">Add Product</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity className="w-1/2 p-2">
            <View className="bg-white p-4 rounded-xl items-center">
              <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center mb-2">
                <Ionicons name="card" size={24} color="#DC2626" />
              </View>
              <Text className="text-gray-900 font-medium">Add Expense</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity className="w-1/2 p-2">
            <View className="bg-white p-4 rounded-xl items-center">
              <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mb-2">
                <Ionicons name="bar-chart" size={24} color="#7C3AED" />
              </View>
              <Text className="text-gray-900 font-medium">Analytics</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Premium Upgrade Banner */}
      {!user?.isPremium && (
        <View className="mx-6 my-4 bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-white font-bold text-lg mb-1">Upgrade to Premium</Text>
              <Text className="text-blue-100 text-sm">Unlock cloud sync, multi-shop support, and advanced analytics</Text>
            </View>
            <TouchableOpacity className="bg-white px-4 py-2 rounded-lg">
              <Text className="text-blue-600 font-semibold">Upgrade</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}