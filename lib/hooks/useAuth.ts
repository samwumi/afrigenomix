'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/types';

interface AuthState {
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
    token: null,
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setAuthState({
          user: null,
          profile: null,
          isLoading: false,
          isAuthenticated: false,
          token: null,
        });
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAuthState({
            user: data.data,
            profile: data.data.profile,
            isLoading: false,
            isAuthenticated: true,
            token,
          });
          return;
        }
      }

      // If we get here, auth failed
      localStorage.removeItem('auth_token');
      setAuthState({
        user: null,
        profile: null,
        isLoading: false,
        isAuthenticated: false,
        token: null,
      });
    } catch (error) {
      console.error('Failed to load user:', error);
      localStorage.removeItem('auth_token');
      setAuthState({
        user: null,
        profile: null,
        isLoading: false,
        isAuthenticated: false,
        token: null,
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setAuthState({
      user: null,
      profile: null,
      isLoading: false,
      isAuthenticated: false,
      token: null,
    });
    window.location.href = '/';
  };

  const refreshUser = () => {
    loadUser();
  };

  return {
    ...authState,
    logout,
    refreshUser,
  };
}
