'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LoadingScreen } from '@/components/ui';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Simple auth guard that redirects unauthenticated users to login
 * Use this for pages that require authentication but don't need role checking
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
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
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('auth_token');
          router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        }
      } else {
        localStorage.removeItem('auth_token');
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
