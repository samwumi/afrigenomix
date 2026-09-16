import React from 'react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Services */}
          <div>
            <h3 className="text-navy-900 font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/tests" className="text-gray-600 hover:text-navy-900 text-sm transition-colors">
                  DNA Tests
                </Link>
              </li>
              <li>
                <Link href="/test-finder" className="text-gray-600 hover:text-navy-900 text-sm transition-colors">
                  Test Finder
                </Link>
              </li>
              <li>
                <Link href="/laboratories" className="text-gray-600 hover:text-navy-900 text-sm transition-colors">
                  Laboratories
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-navy-900 font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-navy-900 text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-navy-900 text-sm transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-navy-900 text-sm transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-navy-900 font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-navy-900 text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-navy-900 text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Advocacy */}
          <div>
            <h3 className="text-navy-900 font-semibold mb-4">Advocacy</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/advocacy" className="text-gray-600 hover:text-navy-900 text-sm transition-colors">
                  Our Campaign
                </Link>
              </li>
              <li>
                <Link href="/advocacy/petition" className="text-gray-600 hover:text-navy-900 text-sm transition-colors">
                  Sign Petition
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <img 
                src="/logo-horizontal.svg" 
                alt="Afrigenomix" 
                className="h-8 w-auto"
              />
            </div>
            <div className="text-sm text-gray-600">
              © {currentYear} Afrigenomix. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
