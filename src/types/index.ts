// Global app types
export interface AppUser {
  id: string;
  email?: string;
  name: string;
  avatar?: string;
  isPremium: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocalAuth {
  userId: string;
  passwordHash: string;
  salt: string;
  biometricEnabled: boolean;
  lastLogin: number;
}

export interface CloudAuth {
  uid: string;
  email: string;
  emailVerified: boolean;
  subscriptionStatus: 'active' | 'canceled' | 'past_due';
  subscriptionId?: string;
  trialEndsAt?: number;
  createdAt: number;
}

export type PaymentMethod = 'cash' | 'card' | 'mobile' | 'credit';

export interface SubscriptionPlan {
  id: 'premium_monthly' | 'premium_yearly';
  name: string;
  price: number;
  currency: string;
  period: 'month' | 'year';
  features: string[];
  savings?: string;
}

export interface DashboardKPIs {
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

export interface SyncConflict {
  table: string;
  recordId: string;
  localVersion: any;
  remoteVersion: any;
  conflictType: 'update_update' | 'update_delete' | 'delete_update';
}

export interface FeatureGate {
  MULTI_SHOP: 'premium';
  CLOUD_SYNC: 'premium';
  ADVANCED_ANALYTICS: 'premium';
  TEAM_COLLABORATION: 'premium';
  EXPORT_UNLIMITED: 'premium';
  AUTOMATED_BACKUP: 'premium';
  PRIORITY_SUPPORT: 'premium';
}

export interface Theme {
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

// Navigation types for Expo Router
export interface RootStackParamList {
  index: undefined;
  login: undefined;
  setup: undefined;
  'auth/password': undefined;
  'auth/biometric': undefined;
  '(authenticated)': undefined;
  'premium/paywall': undefined;
  'premium/plans': undefined;
}

export interface AuthenticatedTabParamList {
  dashboard: undefined;
  sales: undefined;
  inventory: undefined;
  expenses: undefined;
  settings: undefined;
}