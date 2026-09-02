'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { useAuth } from '@/lib/hooks/useAuth';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-navy-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-xl font-bold text-navy-900">Afrigenomix</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/tests" className="text-gray-700 hover:text-navy-700 transition-colors">
              Tests
            </Link>
            <Link href="/test-finder" className="text-gray-700 hover:text-navy-700 transition-colors">
              Test Finder
            </Link>
            <Link href="/immigration" className="text-gray-700 hover:text-navy-700 transition-colors">
              Immigration
            </Link>
            <Link href="/laboratories" className="text-gray-700 hover:text-navy-700 transition-colors">
              Laboratories
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-navy-700 transition-colors">
              Blog
            </Link>
            <Link href="/advocacy" className="text-gray-700 hover:text-navy-700 transition-colors">
              Advocacy
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <>
                    <Link href={getDashboardLink()}>
                      <Button variant="ghost" size="sm">
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="ghost" size="sm">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/test-finder">
                      <Button variant="primary" size="sm">
                        Find a Test
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link href="/tests" className="text-gray-700 hover:text-navy-700">
                Tests
              </Link>
              <Link href="/test-finder" className="text-gray-700 hover:text-navy-700">
                Test Finder
              </Link>
              <Link href="/immigration" className="text-gray-700 hover:text-navy-700">
                Immigration
              </Link>
              <Link href="/laboratories" className="text-gray-700 hover:text-navy-700">
                Laboratories
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-navy-700">
                Blog
              </Link>
              <Link href="/advocacy" className="text-gray-700 hover:text-navy-700">
                Advocacy
              </Link>
              <div className="pt-4 border-t border-gray-200 space-y-2">
                {!isLoading && (
                  <>
                    {isAuthenticated ? (
                      <>
                        <Link href={getDashboardLink()} className="block">
                          <Button variant="ghost" size="sm" className="w-full">
                            Dashboard
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" className="block">
                          <Button variant="ghost" size="sm" className="w-full">
                            Sign In
                          </Button>
                        </Link>
                        <Link href="/test-finder" className="block">
                          <Button variant="primary" size="sm" className="w-full">
                            Find a Test
                          </Button>
                        </Link>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
