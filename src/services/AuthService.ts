import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Crypto from 'expo-crypto';
import bcrypt from 'bcryptjs';
import { database } from '@/database';
import { User } from '@/database/models';
import { LocalAuth, CloudAuth, AppUser } from '@/types';

export class AuthService {
  private static instance: AuthService;
  private currentUser: AppUser | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Local Authentication
  async setupLocalAuth(name: string, password: string, enableBiometrics: boolean = false): Promise<AppUser> {
    try {
      // Generate salt and hash password
      const salt = await Crypto.getRandomBytesAsync(16);
      const saltString = salt.reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '');
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user in database
      const user = await database.write(async () => {
        return await database.get<User>('users').create(user => {
          user.name = name;
          user.isPremium = false;
        });
      });

      // Store auth info securely
      const localAuth: LocalAuth = {
        userId: user.id,
        passwordHash,
        salt: saltString,
        biometricEnabled: enableBiometrics,
        lastLogin: Date.now(),
      };

      await SecureStore.setItemAsync('local_auth', JSON.stringify(localAuth));
      
      this.currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isPremium: user.isPremium,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return this.currentUser;
    } catch (error) {
      throw new Error(`Failed to setup local authentication: ${error}`);
    }
  }

  async authenticateWithPassword(password: string): Promise<AppUser> {
    try {
      const localAuthData = await SecureStore.getItemAsync('local_auth');
      if (!localAuthData) {
        throw new Error('No local authentication found');
      }

      const localAuth: LocalAuth = JSON.parse(localAuthData);
      const isValidPassword = await bcrypt.compare(password, localAuth.passwordHash);

      if (!isValidPassword) {
        throw new Error('Invalid password');
      }

      // Update last login
      localAuth.lastLogin = Date.now();
      await SecureStore.setItemAsync('local_auth', JSON.stringify(localAuth));

      // Load user from database
      const user = await database.get<User>('users').find(localAuth.userId);
      
      this.currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isPremium: user.isPremium,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return this.currentUser;
    } catch (error) {
      throw new Error(`Authentication failed: ${error}`);
    }
  }

  async authenticateWithBiometrics(): Promise<AppUser> {
    try {
      const localAuthData = await SecureStore.getItemAsync('local_auth');
      if (!localAuthData) {
        throw new Error('No local authentication found');
      }

      const localAuth: LocalAuth = JSON.parse(localAuthData);
      if (!localAuth.biometricEnabled) {
        throw new Error('Biometric authentication not enabled');
      }

      const biometricResult = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your shop data',
        fallbackLabel: 'Use password instead',
      });

      if (!biometricResult.success) {
        throw new Error('Biometric authentication failed');
      }

      // Update last login
      localAuth.lastLogin = Date.now();
      await SecureStore.setItemAsync('local_auth', JSON.stringify(localAuth));

      // Load user from database
      const user = await database.get<User>('users').find(localAuth.userId);
      
      this.currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isPremium: user.isPremium,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return this.currentUser;
    } catch (error) {
      throw new Error(`Biometric authentication failed: ${error}`);
    }
  }

  async isBiometricAvailable(): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && isEnrolled;
  }

  async enableBiometrics(): Promise<void> {
    const localAuthData = await SecureStore.getItemAsync('local_auth');
    if (!localAuthData) {
      throw new Error('No local authentication found');
    }

    const localAuth: LocalAuth = JSON.parse(localAuthData);
    localAuth.biometricEnabled = true;
    await SecureStore.setItemAsync('local_auth', JSON.stringify(localAuth));
  }

  async disableBiometrics(): Promise<void> {
    const localAuthData = await SecureStore.getItemAsync('local_auth');
    if (!localAuthData) {
      throw new Error('No local authentication found');
    }

    const localAuth: LocalAuth = JSON.parse(localAuthData);
    localAuth.biometricEnabled = false;
    await SecureStore.setItemAsync('local_auth', JSON.stringify(localAuth));
  }

  async isLocalAuthSetup(): Promise<boolean> {
    const localAuthData = await SecureStore.getItemAsync('local_auth');
    return localAuthData !== null;
  }

  async getCurrentUser(): Promise<AppUser | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    try {
      const localAuthData = await SecureStore.getItemAsync('local_auth');
      if (!localAuthData) {
        return null;
      }

      const localAuth: LocalAuth = JSON.parse(localAuthData);
      const user = await database.get<User>('users').find(localAuth.userId);
      
      this.currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isPremium: user.isPremium,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return this.currentUser;
    } catch (error) {
      return null;
    }
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    // Note: We don't delete local auth data on logout, only clear current session
  }

  async deleteLocalAuth(): Promise<void> {
    await SecureStore.deleteItemAsync('local_auth');
    this.currentUser = null;
  }

  // Cloud Authentication (for premium features)
  async upgradeToCloudAuth(email: string, password: string): Promise<CloudAuth> {
    // This would integrate with Firebase or Supabase
    // For now, this is a placeholder implementation
    throw new Error('Cloud authentication not implemented yet');
  }

  async syncCloudAuth(): Promise<void> {
    // Sync cloud authentication status
    throw new Error('Cloud sync not implemented yet');
  }
}