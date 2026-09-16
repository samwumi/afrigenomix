'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { useAuth } from '@/lib/hooks/useAuth';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getDashboardLink = () => {
    if (!user) return '/dashboard';
    
    const role = user.role;
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      return '/admin';
    } else if (role === 'LAB_PARTNER') {
      return '/partner/lab';
    } else if (role === 'COLLECTION_PARTNER') {
      return '/partner/collection';
    }
    return '/dashboard';
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img 
                src="/logo-horizontal.svg" 
                alt="Afrigenomix" 
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/tests" className="text-gray-700 hover:text-navy-900 transition-colors font-medium">
              Tests
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-navy-900 transition-colors font-medium">
              About
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-navy-900 transition-colors font-medium">
              Blog
            </Link>
            <Link href="/advocacy" className="text-gray-700 hover:text-navy-900 transition-colors font-medium">
              Advocacy
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-navy-900 transition-colors font-medium">
              Contact
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {isLoading ? (
              <div className="w-24 h-10 bg-gray-100 rounded-lg animate-pulse"></div>
            ) : isAuthenticated ? (
              <>
                <Link href={getDashboardLink()}>
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-navy-900 hover:bg-gray-100 transition-colors"
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100">
          <div className="px-4 py-6 space-y-4">
            <Link
              href="/tests"
              className="block px-4 py-2 text-gray-700 hover:text-navy-900 hover:bg-gray-50 rounded-lg transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tests
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-gray-700 hover:text-navy-900 hover:bg-gray-50 rounded-lg transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/blog"
              className="block px-4 py-2 text-gray-700 hover:text-navy-900 hover:bg-gray-50 rounded-lg transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/advocacy"
              className="block px-4 py-2 text-gray-700 hover:text-navy-900 hover:bg-gray-50 rounded-lg transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Advocacy
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-2 text-gray-700 hover:text-navy-900 hover:bg-gray-50 rounded-lg transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>

            <div className="pt-4 space-y-2 border-t border-gray-100">
              {isAuthenticated ? (
                <>
                  <Link href={getDashboardLink()} className="block w-full">
                    <Button variant="ghost" size="sm" className="w-full justify-center">
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block w-full">
                    <Button variant="ghost" size="sm" className="w-full justify-center">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" className="block w-full">
                    <Button variant="primary" size="sm" className="w-full justify-center">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
