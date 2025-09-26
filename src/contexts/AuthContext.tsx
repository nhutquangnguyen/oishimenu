'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createUserProfile } from '@/lib/userManagement';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isDisabled: boolean;
  disabledUserEmail: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearDisabledState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [disabledUserEmail, setDisabledUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Create user profile in Firestore when user signs in
        try {
          console.log('🔄 Creating/updating user profile:', user.email, user.uid);
          const createdProfile = await createUserProfile(user.uid, user.email || '', user.displayName || undefined);

          // Check if user is disabled - use the profile returned from createUserProfile
          console.log('🔍 Checking if user is disabled:', user.email, user.uid);
          console.log('📋 User profile from createUserProfile:', JSON.stringify(createdProfile, null, 2));

          const userProfile = createdProfile;

          if (!userProfile) {
            console.warn('⚠️ No user profile found for:', user.email);
            // Continue login if no profile found (will be created)
            setIsDisabled(false);
          } else if (userProfile.disabled === true) {
            console.log('🚫 USER IS DISABLED:', user.email);
            console.log('🚫 Disabled field value:', userProfile.disabled);
            setIsDisabled(true);
            setDisabledUserEmail(user.email);

            // Sign out disabled user immediately
            console.log('🚪 Signing out disabled user...');
            await signOut(auth);
            console.log('🚪 User signed out successfully');

            // Redirect to beautiful disabled user page
            console.log('🔄 Redirecting to disabled user page...');
            // Use setTimeout to ensure signOut completes before redirect
            setTimeout(() => {
              window.location.href = `/account-disabled?email=${encodeURIComponent(user.email || '')}`;
            }, 100);
            return;
          } else {
            console.log('✅ User is active:', user.email, '(disabled:', userProfile.disabled, ')');
            setIsDisabled(false);
          }
        } catch (error) {
          console.error('Error checking user profile:', error);
        }
      } else {
        setIsDisabled(false);
        setDisabledUserEmail(null);
      }
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const clearDisabledState = () => {
    setIsDisabled(false);
    setDisabledUserEmail(null);
  };

  const value = {
    user,
    loading,
    isDisabled,
    disabledUserEmail,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    clearDisabledState,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
