import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-xl font-bold">Afrigenomix</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Truth. Science. Identity.
            </p>
            <p className="text-gray-400 text-sm">
              Connecting Africa to trusted DNA science.
            </p>
          </div>

          {/* Tests */}
          <div>
            <h3 className="text-white font-semibold mb-4">Tests</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tests/paternity" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Paternity DNA Test
                </Link>
              </li>
              <li>
                <Link href="/tests/legal-paternity" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Legal Paternity Test
                </Link>
              </li>
              <li>
                <Link href="/tests/immigration" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Immigration DNA Test
                </Link>
              </li>
              <li>
                <Link href="/tests/prenatal" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Prenatal DNA Test
                </Link>
              </li>
              <li>
                <Link href="/test-finder" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Test Finder
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-400 hover:text-white text-sm transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/laboratories" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Laboratory Network
                </Link>
              </li>
              <li>
                <Link href="/knowledge" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Knowledge Centre
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white text-sm transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
            
            <div className="mt-6">
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <p className="text-gray-400 text-sm">
                support@afrigenomix.com
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} Afrigenomix. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
