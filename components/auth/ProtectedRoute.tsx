'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingScreen } from '@/components/ui';
import { Role } from '@/lib/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles,
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        router.push(redirectTo);
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        localStorage.removeItem('auth_token');
        router.push(redirectTo);
        return;
      }

      const data = await response.json();
      
      if (!data.success) {
        localStorage.removeItem('auth_token');
        router.push(redirectTo);
        return;
      }

      // Check role authorization
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(data.data.role as Role)) {
          // Redirect to appropriate dashboard based on role
          const role = data.data.role;
          if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
            router.push('/admin');
          } else if (role === 'LAB_PARTNER') {
            router.push('/partner/lab');
          } else if (role === 'COLLECTION_PARTNER') {
            router.push('/partner/collection');
          } else {
            router.push('/dashboard');
          }
          return;
        }
      }

      setIsAuthorized(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push(redirectTo);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Verifying access..." />;
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
