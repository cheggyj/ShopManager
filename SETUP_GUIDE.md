# 🚀 Local Development Setup Guide

## Prerequisites

Before you start, make sure you have the following installed:

### Required Software
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Expo CLI** - Install with: `npm install -g @expo/cli`

### Mobile Development Environment
Choose one or both:

#### For iOS Development (Mac only):
- **Xcode 14+** - Install from App Store
- **iOS Simulator** - Comes with Xcode
- **CocoaPods** - Install with: `sudo gem install cocoapods`

#### For Android Development:
- **Android Studio** - [Download here](https://developer.android.com/studio)
- **Android SDK** - Install via Android Studio
- **Android Emulator** - Set up via Android Studio

## 🏃‍♂️ Quick Start (5 minutes)

### Step 1: Clone and Install
```bash
# Clone the repository
git clone <your-repo-url>
cd shop-manager

# Install dependencies
npm install

# Install Expo dependencies
npx expo install
```

### Step 2: Environment Setup
The `.env` file is already configured for local development. No changes needed for basic functionality.

### Step 3: Start Development Server
```bash
# Start Expo development server
npx expo start

# Or start with specific platform
npx expo start --ios     # For iOS simulator
npx expo start --android # For Android emulator
npx expo start --web     # For web browser
```

### Step 4: Open the App
- **iOS**: Press `i` in terminal or scan QR with Expo Go app
- **Android**: Press `a` in terminal or scan QR with Expo Go app
- **Web**: Press `w` in terminal or visit `http://localhost:19006`

## 📱 Testing the App

### First Launch Flow:
1. **Welcome Screen** - App loads and checks authentication
2. **Setup Account** - Create your name and password
3. **Biometric Setup** - Enable fingerprint/face recognition (optional)
4. **Dashboard** - View the main app interface

### Features to Test:
- ✅ Create local account with password
- ✅ Login with password/biometrics
- ✅ View dashboard with sample data
- ✅ Navigate between tabs
- ✅ Premium upgrade banner (free tier)

## 🔧 Detailed Setup Instructions

### Environment Variables Explained

The `.env` file contains all configuration. Key settings for local development:

```bash
# Basic app configuration
EXPO_PUBLIC_APP_ENV=development          # Development mode
EXPO_PUBLIC_ENABLE_BIOMETRICS=true       # Enable biometric auth
EXPO_PUBLIC_ENABLE_PREMIUM_FEATURES=true # Show premium features
EXPO_PUBLIC_ENABLE_CLOUD_SYNC=false      # Disable cloud features
```

### Database Setup (WatermelonDB)
No additional setup required! WatermelonDB creates the SQLite database automatically on first run.

### Authentication Setup
Local authentication works out of the box with:
- **Password protection** using bcrypt hashing
- **Biometric authentication** (if device supports it)
- **Secure storage** using Expo SecureStore

## 🔧 Development Tools

### Useful Commands
```bash
# Start development server
npx expo start

# Clear Metro cache (if you encounter issues)
npx expo start --clear

# Run on specific device/simulator
npx expo start --ios --device "iPhone 14 Pro"
npx expo start --android --device "Pixel_6_API_33"

# Type checking
npm run type-check

# Linting
npm run lint

# Run tests
npm test
```

### Metro Bundler Options
```bash
# Start with tunnel connection (for physical devices)
npx expo start --tunnel

# Start in production mode
npx expo start --no-dev

# Start with web support
npx expo start --web
```

## 🛠 Platform-Specific Setup

### iOS Setup (Mac only)
```bash
# Install iOS dependencies
cd ios && pod install && cd ..

# Run on iOS simulator
npx expo run:ios

# Run on specific simulator
npx expo run:ios --simulator "iPhone 14 Pro"
```

### Android Setup
```bash
# Start Android emulator first (via Android Studio)
# Then run:
npx expo run:android

# Run on specific device
npx expo run:android --device DEVICE_ID
```

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 1. Metro Bundler Issues
```bash
# Clear cache and restart
npx expo start --clear
rm -rf node_modules && npm install
```

#### 2. iOS Build Issues
```bash
# Update CocoaPods
cd ios && pod update && cd ..

# Clear iOS build cache
rm -rf ios/build
```

#### 3. Android Build Issues
```bash
# Clean Android build
cd android && ./gradlew clean && cd ..

# Reset Android cache
rm -rf android/.gradle
```

#### 4. TypeScript Errors
```bash
# Check TypeScript configuration
npm run type-check

# Restart TypeScript service in VS Code
# Cmd+Shift+P -> "TypeScript: Restart TS Server"
```

#### 5. WatermelonDB Issues
```bash
# Clear app data (will reset database)
# iOS: Reset simulator
# Android: Clear app data in emulator
```

### Environment Issues

#### Missing Dependencies
```bash
# Install missing Expo dependencies
npx expo install --fix

# Install specific packages
npx expo install react-native-reanimated react-native-gesture-handler
```

#### Node.js Version Issues
```bash
# Check Node version (should be 18+)
node --version

# Use Node Version Manager if needed
nvm install 18
nvm use 18
```

## 📊 Development Features

### Debug Menu
- **Shake device** or **Cmd+D** (iOS) / **Cmd+M** (Android) to open debug menu
- **Reload** - Refresh the app
- **Debug** - Open Chrome DevTools
- **Performance Monitor** - Check app performance

### Hot Reloading
The app supports hot reloading. Save any file to see changes instantly.

### Network Debugging
View network requests in Chrome DevTools when debug mode is enabled.

## 🧪 Testing Setup

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test AuthService.test.ts
```

### Writing Tests
Tests are located in `__tests__` directories. Example:
```typescript
// src/services/__tests__/AuthService.test.ts
import { AuthService } from '../AuthService';

describe('AuthService', () => {
  it('should create user account', async () => {
    const authService = AuthService.getInstance();
    const user = await authService.setupLocalAuth('Test User', 'password123');
    expect(user.name).toBe('Test User');
  });
});
```

## 🔒 Security Notes

### Development Security
- **Biometric authentication** only works on physical devices
- **SecureStore** is automatically encrypted
- **Database** is SQLite, stored locally

### Production Security
Before deploying to production:
1. Generate new encryption keys
2. Set up proper Firebase/Supabase credentials
3. Configure proper API endpoints
4. Enable crash reporting and analytics

## 📱 Device Testing

### iOS Devices
```bash
# List available simulators
xcrun simctl list devices

# Boot specific simulator
xcrun simctl boot "iPhone 14 Pro"
```

### Android Devices
```bash
# List available devices
adb devices

# List available emulators
emulator -list-avds
```

## 🚀 Next Steps

After getting the app running locally:

1. **Explore the codebase**:
   - Check `src/database/models/` for data models
   - Review `src/services/` for business logic
   - Look at `src/components/` for UI components

2. **Add premium features**:
   - Set up Firebase/Supabase for cloud sync
   - Configure RevenueCat for payments
   - Implement cloud sync logic

3. **Customize the app**:
   - Update colors in `tailwind.config.js`
   - Modify app name in `app.json`
   - Add your own branding

4. **Deploy to devices**:
   - Use EAS Build for app store builds
   - Test on real devices via Expo Go

## 📞 Getting Help

If you encounter issues:

1. **Check this guide** - Most issues are covered here
2. **Review error messages** - They often contain solution hints
3. **Check Expo documentation** - [docs.expo.dev](https://docs.expo.dev)
4. **Search GitHub issues** - For WatermelonDB and other dependencies

Happy coding! 🎉