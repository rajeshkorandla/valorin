import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext({});

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const inactivityTimer = useRef(null);
  const lastActivityTime = useRef(Date.now());

  // Auto-logout function
  const autoLogout = useCallback(async () => {
    console.log('Auto-logout triggered due to inactivity');
    try {
      await supabase.auth.signOut();
      // User state will be updated by onAuthStateChange listener
      
      // Show platform-appropriate notification
      if (typeof window !== 'undefined' && window.alert) {
        window.alert('You have been logged out due to inactivity.');
      }
    } catch (error) {
      console.error('Auto-logout error:', error);
    }
  }, []);

  // Reset inactivity timer
  const resetInactivityTimer = useCallback(() => {
    lastActivityTime.current = Date.now();
    
    // Clear existing timer
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }

    // Only set timer if user is logged in
    if (user) {
      inactivityTimer.current = setTimeout(() => {
        autoLogout();
      }, INACTIVITY_TIMEOUT);
    }
  }, [user, autoLogout]);

  // Track user activity (web only)
  useEffect(() => {
    // Only enable auto-logout on web platform
    if (!user || typeof window === 'undefined' || !window.addEventListener) return;

    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      resetInactivityTimer();
    };

    // Add event listeners for user activity
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Start the inactivity timer
    resetInactivityTimer();

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, [user, resetInactivityTimer]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
