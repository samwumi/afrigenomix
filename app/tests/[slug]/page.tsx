'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Card, Badge, Button, Alert, Spinner, LoadingScreen } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { TestType } from '@/lib/types';

export default function TestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [test, setTest] = useState<TestType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTest();
  }, [params.slug]);

  const fetchTest = async () => {
    try {
      const response = await fetch(`/api/tests/${params.slug}`);
      const data = await response.json();
      
      if (data.success) {
        setTest(data.data);
      } else {
        setError('Test not found');
      }
    } catch (error) {
      console.error('Failed to fetch test:', error);
      setError('Failed to load test details');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading test details..." />;
  }

  if (error || !test) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <Container>
            <Card className="max-w-lg mx-auto">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Not Found</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <Link href="/tests">
                  <Button variant="primary">View All Tests</Button>
                </Link>
              </div>
            </Card>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center text-sm text-gray-600">
              <Link href="/" className="hover:text-navy-700">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/tests" className="hover:text-navy-700">Tests</Link>
              <span className="mx-2">/</span>
              <span className="text-navy-900">{test.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h1 className="text-3xl font-bold text-navy-900 mb-2">
                          {test.name}
                        </h1>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="info">{test.category}</Badge>
                          {test.isLegal && <Badge variant="success">Legal</Badge>}
                          {test.chainOfCustody && <Badge variant="success">Chain of Custody</Badge>}
                        </div>
                      </div>
                    </div>

                    <div className="prose max-w-none">
                      <h2 className="text-xl font-semibold text-navy-900 mb-3">Overview</h2>
                      <p className="text-gray-700 leading-relaxed">
                        {test.description}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Test Details */}
                <Card>
                  <div className="p-8">
                    <h2 className="text-xl font-semibold text-navy-900 mb-6">Test Details</h2>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Sample Type</p>
                          <p className="font-medium text-gray-900">{test.sampleType || 'Buccal swab'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Turnaround Time</p>
                          <p className="font-medium text-gray-900">
                            {test.turnaroundDays ? `${test.turnaroundDays} business days` : 'Contact us'}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Test Type</p>
                          <p className="font-medium text-gray-900">
                            {test.isLegal ? 'Legal / Court Admissible' : 'Personal / Peace of Mind'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Chain of Custody</p>
                          <p className="font-medium text-gray-900">
                            {test.chainOfCustody ? 'Required' : 'Not Required'}
                          </p>
                        </div>
                      </div>

                      {test.requirements && (
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Requirements</p>
                          <p className="text-gray-700">{test.requirements}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                {/* How It Works */}
                <Card>
                  <div className="p-8">
                    <h2 className="text-xl font-semibold text-navy-900 mb-6">How It Works</h2>
                    
                    <div className="space-y-6">
                      {[
                        {
                          step: 1,
                          title: 'Request Your Test',
                          description: 'Complete the registration and provide basic information about your testing needs.',
                        },
                        {
                          step: 2,
                          title: 'Submit Documents',
                          description: test.isLegal 
                            ? 'Upload required identification documents for legal verification.'
                            : 'Provide necessary information for processing.',
                        },
                        {
                          step: 3,
                          title: 'Sample Collection',
                          description: test.isLegal
                            ? 'Visit an approved collection center for witnessed sample collection.'
                            : 'Receive home collection kit or visit a collection center.',
                        },
                        {
                          step: 4,
                          title: 'Laboratory Analysis',
                          description: 'Samples are processed at an accredited laboratory with strict quality controls.',
                        },
                        {
                          step: 5,
                          title: 'Receive Results',
                          description: 'Access your secure results online or receive by mail.',
                        },
                      ].map((item) => (
                        <div key={item.step} className="flex">
                          <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                            <span className="text-teal-700 font-bold">{item.step}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                            <p className="text-gray-600 text-sm">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Important Information */}
                {test.isLegal && (
                  <Alert variant="info">
                    <strong>Legal Testing Notice:</strong> This test includes identity verification and chain of custody documentation, making it suitable for legal proceedings, court cases, and immigration applications. All participants must present valid photo identification at the time of sample collection.
                  </Alert>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Pricing Card */}
                <Card>
                  <div className="p-6">
                    <div className="text-center mb-6">
                      {test.price ? (
                        <>
                          <div className="text-4xl font-bold text-navy-900 mb-2">
                            {formatCurrency(Number(test.price), test.currency || 'NGN')}
                          </div>
                          <p className="text-sm text-gray-600">One-time payment</p>
                        </>
                      ) : (
                        <>
                          <div className="text-2xl font-bold text-navy-900 mb-2">
                            Request a Quote
                          </div>
                          <p className="text-sm text-gray-600">Pricing varies by case</p>
                        </>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Link href="/register">
                        <Button variant="primary" size="lg" className="w-full">
                          Get Started
                        </Button>
                      </Link>
                      <Link href="/contact">
                        <Button variant="outline" size="lg" className="w-full">
                          Request Quote
                        </Button>
                      </Link>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm">
                      <div className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Accredited laboratories
                      </div>
                      <div className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Confidential results
                      </div>
                      <div className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Expert support
                      </div>
                      <div className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Secure online portal
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Help Card */}
                <Card>
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Our specialists are available to answer your questions and guide you through the testing process.
                    </p>
                    <Link href="/contact">
                      <Button variant="outline" className="w-full">
                        Contact a Specialist
                      </Button>
                    </Link>
                  </div>
                </Card>

                {/* Related Tests */}
                <Card>
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Explore More</h3>
                    <div className="space-y-2">
                      <Link href="/test-finder" className="block text-sm text-teal-600 hover:text-teal-700">
                        → Use Test Finder
                      </Link>
                      <Link href="/tests" className="block text-sm text-teal-600 hover:text-teal-700">
                        → View All Tests
                      </Link>
                      <Link href="/knowledge" className="block text-sm text-teal-600 hover:text-teal-700">
                        → Knowledge Centre
                      </Link>
                      <Link href="/faq" className="block text-sm text-teal-600 hover:text-teal-700">
                        → Frequently Asked Questions
                      </Link>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
