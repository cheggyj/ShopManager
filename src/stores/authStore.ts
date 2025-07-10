import { create } from 'zustand';
import { AppUser } from '@/types';
import { AuthService } from '@/services/AuthService';

interface AuthState {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLocalAuthSetup: boolean;
  biometricAvailable: boolean;
  
  // Actions
  setupLocalAuth: (name: string, password: string, enableBiometrics?: boolean) => Promise<void>;
  authenticateWithPassword: (password: string) => Promise<void>;
  authenticateWithBiometrics: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  enableBiometrics: () => Promise<void>;
  disableBiometrics: () => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isLocalAuthSetup: false,
  biometricAvailable: false,

  setupLocalAuth: async (name: string, password: string, enableBiometrics = false) => {
    try {
      set({ isLoading: true });
      const authService = AuthService.getInstance();
      const user = await authService.setupLocalAuth(name, password, enableBiometrics);
      
      set({
        user,
        isAuthenticated: true,
        isLocalAuthSetup: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  authenticateWithPassword: async (password: string) => {
    try {
      set({ isLoading: true });
      const authService = AuthService.getInstance();
      const user = await authService.authenticateWithPassword(password);
      
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  authenticateWithBiometrics: async () => {
    try {
      set({ isLoading: true });
      const authService = AuthService.getInstance();
      const user = await authService.authenticateWithBiometrics();
      
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  checkAuthStatus: async () => {
    try {
      set({ isLoading: true });
      const authService = AuthService.getInstance();
      
      const [isLocalAuthSetup, biometricAvailable, currentUser] = await Promise.all([
        authService.isLocalAuthSetup(),
        authService.isBiometricAvailable(),
        authService.getCurrentUser(),
      ]);

      set({
        isLocalAuthSetup,
        biometricAvailable,
        user: currentUser,
        isAuthenticated: currentUser !== null,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLocalAuthSetup: false,
        biometricAvailable: false,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  enableBiometrics: async () => {
    try {
      const authService = AuthService.getInstance();
      await authService.enableBiometrics();
      
      // Update the current user's auth preferences
      // This could trigger a re-check of auth status
      await get().checkAuthStatus();
    } catch (error) {
      throw error;
    }
  },

  disableBiometrics: async () => {
    try {
      const authService = AuthService.getInstance();
      await authService.disableBiometrics();
      
      // Update the current user's auth preferences
      await get().checkAuthStatus();
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const authService = AuthService.getInstance();
      await authService.logout();
      
      set({
        user: null,
        isAuthenticated: false,
      });
    } catch (error) {
      throw error;
    }
  },

  deleteAccount: async () => {
    try {
      set({ isLoading: true });
      const authService = AuthService.getInstance();
      await authService.deleteLocalAuth();
      
      set({
        user: null,
        isAuthenticated: false,
        isLocalAuthSetup: false,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));