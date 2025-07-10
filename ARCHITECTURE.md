# Shop Manager App - Architecture Documentation

## 🏗️ System Architecture Overview

### Tech Stack
- **Frontend**: React Native with Expo (SDK 50+)
- **Routing**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Database**: WatermelonDB (SQLite-based, reactive)
- **Authentication**: 
  - Local: Expo SecureStore + Biometrics
  - Cloud: Firebase Auth or Supabase Auth
- **State Management**: Zustand + WatermelonDB observers
- **Payment**: Stripe or RevenueCat
- **Cloud Sync**: Custom sync engine with conflict resolution
- **Push Notifications**: Expo Notifications

## 🎯 Core Concepts

### 1. Local-First Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Local SQLite  │◄──►│  WatermelonDB    │◄──►│  React Components│
│   (Persistent)  │    │  (ORM + Sync)    │    │  (UI Layer)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         ▲                       ▲                       ▲
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Backup/Export │    │   Sync Queue     │    │   Zustand Store │
│   (Local Files) │    │   (Offline)      │    │   (App State)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 2. User Journey & Feature Tiers

#### Free Tier (Local-Only)
- ✅ Single shop management
- ✅ Basic sales tracking
- ✅ Simple inventory management
- ✅ Local authentication (password + biometrics)
- ✅ Basic reports (last 30 days)
- ✅ Data export to CSV/PDF
- ❌ Multi-shop support
- ❌ Cloud sync
- ❌ Advanced analytics
- ❌ Team collaboration

#### Premium Tier (Cloud-Enabled)
- ✅ Everything in Free tier
- ✅ Multi-shop support
- ✅ Cloud sync across devices
- ✅ Advanced analytics & insights
- ✅ Team collaboration & permissions
- ✅ Automated backups
- ✅ Advanced reporting
- ✅ Integration with accounting software
- ✅ Priority support

## 📱 App Structure

### Authentication Flow
```
App Start
    │
    ▼
┌─────────────────┐    No    ┌──────────────────┐
│ Local Auth Set? │─────────►│ Setup Local Auth │
└─────────────────┘          │ (Password + Bio) │
    │ Yes                    └──────────────────┘
    ▼                               │
┌─────────────────┐                │
│ Authenticate    │◄───────────────┘
│ (Pass + Bio)    │
└─────────────────┘
    │ Success
    ▼
┌─────────────────┐    Premium   ┌──────────────────┐
│ Main App        │─────────────►│ Cloud Login      │
│ (Local Mode)    │   Features   │ & Sync Setup    │
└─────────────────┘              └──────────────────┘
```

## 🗄️ Database Schema (WatermelonDB)

### Core Tables

```typescript
// Users (Local auth info)
interface User {
  id: string;
  email?: string; // Only for premium users
  name: string;
  avatar?: string;
  isPremium: boolean;
  createdAt: number;
  updatedAt: number;
}

// Shops
interface Shop {
  id: string;
  userId: string;
  name: string;
  description?: string;
  currency: string; // USD, EUR, etc.
  timezone: string;
  isActive: boolean;
  isPrimary: boolean; // For free users, only one primary shop
  createdAt: number;
  updatedAt: number;
  syncedAt?: number;
}

// Categories
interface Category {
  id: string;
  shopId: string;
  name: string;
  color: string;
  icon?: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

// Products
interface Product {
  id: string;
  shopId: string;
  categoryId?: string;
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  buyingPrice: number;
  sellingPrice: number;
  stock: number;
  minStock: number;
  unit: string; // piece, kg, liter, etc.
  image?: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

// Sales
interface Sale {
  id: string;
  shopId: string;
  customerId?: string;
  employeeId?: string;
  total: number;
  subtotal: number;
  tax: number;
  discount: number;
  paymentMethod: 'cash' | 'card' | 'mobile' | 'credit';
  notes?: string;
  saleDate: number;
  createdAt: number;
  updatedAt: number;
}

// Sale Items
interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  createdAt: number;
}

// Expenses
interface Expense {
  id: string;
  shopId: string;
  employeeId?: string; // For salary/wage expenses
  category: 'salary' | 'wage' | 'transport' | 'rent' | 'utility' | 'software' | 'tools' | 'marketing' | 'other';
  amount: number;
  description: string;
  expenseDate: number;
  receipt?: string; // Image path
  isRecurring: boolean;
  recurringPeriod?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  createdAt: number;
  updatedAt: number;
}

// Employees
interface Employee {
  id: string;
  shopId: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  salary?: number;
  salaryType: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  permissions: string[]; // JSON array of permission keys
  isActive: boolean;
  hiredDate: number;
  createdAt: number;
  updatedAt: number;
}

// Sync Queue (for premium users)
interface SyncQueue {
  id: string;
  tableName: string;
  recordId: string;
  action: 'create' | 'update' | 'delete';
  data: string; // JSON stringified record data
  retryCount: number;
  createdAt: number;
}
```

## 🔐 Authentication & Security

### Local Authentication
```typescript
// Store in Expo SecureStore
interface LocalAuth {
  userId: string;
  passwordHash: string; // bcrypt hashed
  salt: string;
  biometricEnabled: boolean;
  lastLogin: number;
}

// Biometric setup
const setupBiometrics = async () => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  
  if (hasHardware && isEnrolled) {
    // Enable biometric option
    return true;
  }
  return false;
};
```

### Premium Authentication
```typescript
// Firebase/Supabase integration
interface CloudAuth {
  uid: string;
  email: string;
  emailVerified: boolean;
  subscriptionStatus: 'active' | 'canceled' | 'past_due';
  subscriptionId?: string;
  trialEndsAt?: number;
  createdAt: number;
}
```

## 💰 Premium Features & Paywall

### Feature Gating
```typescript
interface FeatureGate {
  MULTI_SHOP: 'premium';
  CLOUD_SYNC: 'premium';
  ADVANCED_ANALYTICS: 'premium';
  TEAM_COLLABORATION: 'premium';
  EXPORT_UNLIMITED: 'premium';
  AUTOMATED_BACKUP: 'premium';
  PRIORITY_SUPPORT: 'premium';
}

const useFeatureAccess = () => {
  const { user } = useAuth();
  
  const hasAccess = (feature: keyof FeatureGate) => {
    if (FeatureGate[feature] === 'premium') {
      return user?.isPremium || false;
    }
    return true;
  };
  
  return { hasAccess };
};
```

### Paywall Implementation
```typescript
// Using RevenueCat or Stripe
interface SubscriptionPlan {
  id: 'premium_monthly' | 'premium_yearly';
  name: string;
  price: number;
  currency: string;
  period: 'month' | 'year';
  features: string[];
  savings?: string; // For yearly plans
}

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'premium_monthly',
    name: 'Premium Monthly',
    price: 9.99,
    currency: 'USD',
    period: 'month',
    features: [
      'Multi-shop management',
      'Cloud sync',
      'Advanced analytics',
      'Team collaboration',
      'Priority support'
    ]
  },
  {
    id: 'premium_yearly',
    name: 'Premium Yearly',
    price: 99.99,
    currency: 'USD',
    period: 'year',
    features: [
      'Everything in Monthly',
      '2 months free',
      'Advanced integrations'
    ],
    savings: 'Save 17%'
  }
];
```

## 🔄 Cloud Sync Architecture

### Sync Strategy
1. **Optimistic Updates**: Changes applied locally first
2. **Conflict Resolution**: Last-write-wins with user intervention option
3. **Incremental Sync**: Only sync changed records
4. **Batch Operations**: Group multiple changes together

```typescript
interface SyncEngine {
  // Push local changes to cloud
  pushChanges(): Promise<void>;
  
  // Pull remote changes from cloud
  pullChanges(): Promise<void>;
  
  // Handle conflicts
  resolveConflicts(conflicts: Conflict[]): Promise<void>;
  
  // Full sync (initial or after long offline period)
  fullSync(): Promise<void>;
}

interface Conflict {
  table: string;
  recordId: string;
  localVersion: any;
  remoteVersion: any;
  conflictType: 'update_update' | 'update_delete' | 'delete_update';
}
```

## 📊 Dashboard & Analytics

### KPI Calculations
```typescript
interface DashboardKPIs {
  // Today's metrics
  todaySales: number;
  todayExpenses: number;
  todayProfit: number;
  
  // Comparisons
  yesterdayComparison: {
    sales: number; // percentage change
    expenses: number;
    profit: number;
  };
  
  // Trends (last 7 days)
  salesTrend: Array<{ date: string; value: number }>;
  profitTrend: Array<{ date: string; value: number }>;
  
  // Expense breakdown
  expenseByCategory: Array<{ category: string; amount: number; percentage: number }>;
  
  // Inventory alerts
  lowStockItems: Array<{ productId: string; name: string; currentStock: number; minStock: number }>;
  
  // Credit readiness score (0-100)
  creditReadiness: number;
}
```

## 🎨 UI/UX Architecture

### Theme System (NativeWind + Dark Mode)
```typescript
interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    fontFamily: string;
    sizes: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
  };
}
```

### Responsive Layout
- **Mobile First**: Optimized for phones
- **Tablet Adaptive**: Side navigation on tablets
- **Accessibility**: WCAG 2.1 AA compliance
- **Gestures**: Swipe actions, pull-to-refresh

## 🚀 Performance Optimization

### Local Performance
- **Database Indexing**: Proper SQLite indexes for queries
- **Image Optimization**: Compressed images with lazy loading
- **List Virtualization**: For large product/sales lists
- **Debounced Search**: Prevent excessive queries

### Sync Performance
- **Background Sync**: Use Expo TaskManager for background sync
- **Compression**: Gzip API responses
- **Caching**: Cache API responses with TTL
- **Retry Logic**: Exponential backoff for failed syncs

## 📱 File Structure
```
src/
├── app/                    # Expo Router pages
├── components/             # Reusable UI components
├── hooks/                  # Custom React hooks
├── stores/                 # Zustand stores
├── database/               # WatermelonDB models and schema
├── services/               # API services and utilities
├── utils/                  # Helper functions
├── types/                  # TypeScript type definitions
├── constants/              # App constants
└── assets/                 # Images, icons, fonts
```

This architecture provides a solid foundation for a scalable, offline-first shop management app with clear upgrade paths to premium features.