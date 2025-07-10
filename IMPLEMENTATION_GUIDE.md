# Shop Manager Implementation Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (Mac) or Android Studio
- Git

### Installation Steps

1. **Clone and Setup Project**
```bash
# Install dependencies
npm install

# Start Expo development server
npx expo start
```

2. **Install Additional Dependencies**
```bash
# Install missing React Native dependencies
npx expo install react-native-reanimated react-native-gesture-handler

# Setup WatermelonDB for your platform
npx expo install @nozbe/watermelondb @nozbe/with-observables

# For iOS (if targeting iOS)
cd ios && pod install && cd ..
```

3. **Configure WatermelonDB**
After installation, you may need to add the following to your `metro.config.js`:
```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for WatermelonDB
config.resolver.alias = {
  '@': './src',
};

module.exports = config;
```

## 📱 Architecture Overview

### Local-First Design
The app is designed to work completely offline by default:
- **WatermelonDB**: Local SQLite database with reactive queries
- **Expo SecureStore**: Encrypted local authentication storage
- **Local Biometrics**: Fingerprint/Face ID authentication
- **File System**: Local image storage for product photos

### Premium Cloud Features
Premium users get additional capabilities:
- **Cloud Sync**: Multi-device synchronization
- **Multi-Shop**: Manage multiple shops
- **Advanced Analytics**: Detailed reports and insights
- **Team Collaboration**: Employee management with permissions

## 🔧 Key Implementation Details

### 1. Authentication Flow
```typescript
// Check if local auth is setup
const isSetup = await AuthService.getInstance().isLocalAuthSetup();

if (!isSetup) {
  // First time - setup local auth
  await authService.setupLocalAuth(name, password, enableBiometrics);
} else {
  // Returning user - authenticate
  await authService.authenticateWithPassword(password);
  // OR
  await authService.authenticateWithBiometrics();
}
```

### 2. Database Operations
```typescript
// Create a new product
const product = await database.write(async () => {
  return await database.get<Product>('products').create(product => {
    product.name = 'New Product';
    product.sellingPrice = 29.99;
    product.shopId = currentShop.id;
  });
});

// Query products with reactive updates
const products = useObservable(
  database.get<Product>('products').query(
    Q.where('shop_id', currentShop.id),
    Q.where('is_active', true)
  )
);
```

### 3. Feature Gating
```typescript
const FeatureGate = {
  MULTI_SHOP: 'premium',
  CLOUD_SYNC: 'premium',
  ADVANCED_ANALYTICS: 'premium',
} as const;

const useFeatureAccess = () => {
  const { user } = useAuth();
  
  const hasAccess = (feature: keyof typeof FeatureGate) => {
    if (FeatureGate[feature] === 'premium') {
      return user?.isPremium || false;
    }
    return true;
  };
  
  return { hasAccess };
};
```

## 🎨 UI Components & Styling

### NativeWind Setup
The project uses NativeWind (Tailwind for React Native):

```javascript
// tailwind.config.js
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { /* custom colors */ },
        // ... more colors
      },
    },
  },
  plugins: [],
}
```

### Responsive Design
- **Mobile First**: Primary focus on phone screens
- **Tablet Adaptive**: Larger screens get enhanced layouts
- **Accessibility**: WCAG 2.1 AA compliance

## 💰 Premium Features Implementation

### 1. Paywall Integration
```typescript
// Using RevenueCat (recommended) or Stripe
import Purchases from 'react-native-purchases';

const initializePurchases = async () => {
  await Purchases.configure({
    apiKey: 'your_revenuecat_key',
  });
};

const purchasePremium = async (productId: string) => {
  try {
    const { purchaserInfo } = await Purchases.purchaseProduct(productId);
    // Handle successful purchase
    updateUserPremiumStatus(purchaserInfo);
  } catch (error) {
    // Handle purchase error
  }
};
```

### 2. Cloud Sync Setup
```typescript
// Firebase/Supabase integration
const syncToCloud = async () => {
  const syncQueue = await database.get<SyncQueue>('sync_queue').query().fetch();
  
  for (const item of syncQueue) {
    try {
      await apiCall(item.tableName, item.action, item.recordData);
      await item.destroy(); // Remove from sync queue
    } catch (error) {
      // Increment retry count, implement exponential backoff
      await item.update(() => {
        item.retryCount += 1;
      });
    }
  }
};
```

## 📊 Database Schema Evolution

### Migration Strategy
```typescript
import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';

const migrations = schemaMigrations({
  migrations: [
    // Version 1 to 2: Add new fields
    {
      toVersion: 2,
      steps: [
        addColumns({
          table: 'products',
          columns: [
            { name: 'discount_price', type: 'number', isOptional: true },
          ],
        }),
      ],
    },
  ],
});
```

### Indexing for Performance
```typescript
// Add indexes for frequently queried fields
tableSchema({
  name: 'sales',
  columns: [
    { name: 'shop_id', type: 'string', isIndexed: true },
    { name: 'sale_date', type: 'number', isIndexed: true },
    // ... other columns
  ]
})
```

## 🔒 Security Best Practices

### 1. Local Data Protection
- **Encrypted Storage**: Use Expo SecureStore for sensitive data
- **Biometric Authentication**: Leverage device security features
- **Data Validation**: Sanitize all user inputs

### 2. Cloud Security
- **API Authentication**: JWT tokens with refresh mechanism
- **Data Encryption**: Encrypt sensitive data before cloud storage
- **Access Control**: Role-based permissions system

## 📱 Platform-Specific Features

### iOS Configuration
```json
// app.json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSFaceIDUsageDescription": "Use Face ID to securely access your shop data",
        "NSCameraUsageDescription": "Access camera to scan barcodes and take product photos"
      }
    }
  }
}
```

### Android Configuration
```json
// app.json
{
  "expo": {
    "android": {
      "permissions": [
        "CAMERA",
        "USE_FINGERPRINT",
        "USE_BIOMETRIC"
      ]
    }
  }
}
```

## 🧪 Testing Strategy

### Unit Tests
```typescript
// Example test for AuthService
describe('AuthService', () => {
  it('should hash password securely', async () => {
    const authService = AuthService.getInstance();
    const password = 'testpassword123';
    
    const user = await authService.setupLocalAuth('Test User', password);
    expect(user.name).toBe('Test User');
    expect(user.isPremium).toBe(false);
  });
});
```

### Integration Tests
- Database operations
- Authentication flows
- Sync mechanisms

## 🚀 Deployment

### EAS Build Setup
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure builds
eas build:configure

# Build for stores
eas build --platform all
```

### App Store Submission
1. **iOS**: Submit through App Store Connect
2. **Android**: Upload to Google Play Console
3. **Review Guidelines**: Ensure compliance with platform policies

## 📈 Performance Optimization

### Database Performance
- Use proper indexes
- Implement pagination for large datasets
- Optimize query patterns

### UI Performance
- Implement virtualized lists for large data
- Use React.memo for expensive components
- Optimize image loading and caching

### Bundle Size
- Use dynamic imports for premium features
- Implement code splitting
- Remove unused dependencies

## 🛠 Development Tools

### Useful Commands
```bash
# Start with specific platform
npx expo start --ios
npx expo start --android

# Reset cache if needed
npx expo start --clear

# Run tests
npm test

# Type checking
npm run type-check

# Linting
npm run lint
```

### Debugging
- **Flipper**: Database inspection and network monitoring
- **Reactotron**: State management debugging
- **Expo Dev Tools**: Runtime debugging and performance monitoring

## 📋 Checklist for Production

### Pre-Launch
- [ ] Complete authentication flow testing
- [ ] Database migration testing
- [ ] Payment integration testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Accessibility testing
- [ ] Platform compliance review

### Post-Launch
- [ ] Analytics integration
- [ ] Crash reporting (Sentry/Bugsnag)
- [ ] User feedback collection
- [ ] A/B testing framework
- [ ] Push notification setup

## 🆘 Troubleshooting

### Common Issues

1. **Metro bundler issues**
```bash
npx expo start --clear
```

2. **WatermelonDB Android build issues**
- Check Android Gradle Plugin version compatibility
- Verify ProGuard/R8 configuration

3. **iOS build issues**
- Update CocoaPods: `cd ios && pod update && cd ..`
- Check Xcode version compatibility

### Getting Help
- **Expo Documentation**: https://docs.expo.dev/
- **WatermelonDB Docs**: https://watermelondb.dev/
- **React Native Community**: https://reactnative.dev/community

This architecture provides a solid foundation for a scalable, offline-first shop management application with clear upgrade paths to premium features.