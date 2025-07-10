import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen(): React.JSX.Element {
  const handleGetStarted = useCallback(() => {
    Alert.alert(
      'Welcome to Shop Manager! 🛍️', 
      'Ready to start managing your shop with local-first data and premium cloud features?',
      [
        { text: 'Learn More', style: 'default' },
        { text: 'Get Started', style: 'default' }
      ]
    );
  }, []);

  const handleLearnMore = useCallback(() => {
    Alert.alert(
      'About Shop Manager',
      '• Local-first: All data stored on your device\n• Offline-ready: Works without internet\n• Premium sync: Cloud backup & multi-device\n• Advanced analytics & reporting\n• Team collaboration features',
      [{ text: 'Got it!', style: 'default' }]
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          🛍️ Shop Manager
        </Text>
        <Text style={styles.headerSubtitle}>
          Smart. Local. Powerful.
        </Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View>
          <Text style={styles.title}>
            Manage Your Business
          </Text>
          <Text style={styles.subtitle}>
            Local-first shop management with premium cloud features. 
            Start free, upgrade when ready.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            onPress={handleGetStarted}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>
              🚀 Get Started Free
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleLearnMore}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>
              📚 Learn More
            </Text>
          </TouchableOpacity>
        </View>

        {/* Feature Highlights */}
        <View style={styles.featureContainer}>
          <FeatureItem 
            icon="💾" 
            title="Local-First" 
            description="Works offline, data stays on your device" 
          />
          <FeatureItem 
            icon="☁️" 
            title="Premium Sync" 
            description="Cloud backup & multi-device access" 
          />
          <FeatureItem 
            icon="📊" 
            title="Analytics" 
            description="Advanced insights & reporting" 
          />
        </View>
      </View>

      {/* Premium Banner */}
      <View style={styles.premiumBanner}>
        <Text style={styles.premiumText}>
          ✨ Premium features available with cloud sync
        </Text>
      </View>
    </SafeAreaView>
  );
}

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps): React.JSX.Element {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#dbeafe',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: 'white',
  },
  secondaryButtonText: {
    color: '#374151',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  featureContainer: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontWeight: '600',
    color: '#1f2937',
    fontSize: 16,
  },
  featureDescription: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 2,
  },
  premiumBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fffbeb',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  premiumText: {
    color: '#92400e',
    textAlign: 'center',
    fontWeight: '500',
  },
});