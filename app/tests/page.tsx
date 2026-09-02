'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Card, Badge, Button, Spinner } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { TestType } from '@/lib/types';
import { 
  ArrowRight, 
  Clock, 
  Shield, 
  CheckCircle,
  Droplet,
  Search,
  Filter,
  Scale
} from 'lucide-react';

export default function TestsPage() {
  const [tests, setTests] = useState<TestType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchTests();
  }, [selectedCategory]);

  const fetchTests = async () => {
    try {
      const url = selectedCategory === 'all' 
        ? '/api/tests'
        : `/api/tests?category=${selectedCategory}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setTests(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch tests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'All Tests' },
    { value: 'PATERNITY', label: 'Paternity' },
    { value: 'MATERNITY', label: 'Maternity' },
    { value: 'SIBLING', label: 'Sibling' },
    { value: 'IMMIGRATION', label: 'Immigration' },
    { value: 'LEGAL', label: 'Legal' },
    { value: 'PRENATAL', label: 'Prenatal' },
    { value: 'GENETIC', label: 'Genetic' },
  ];

  const groupedTests = tests.reduce((acc, test) => {
    const category = test.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(test);
    return acc;
  }, {} as Record<string, TestType[]>);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="flex-1">
        {/* Enhanced Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-teal-900 text-white py-20 md:py-24">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <Container className="relative z-10">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2.5 border border-white/20 mb-6">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">All tests coordinated with verified laboratories</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 !text-white">
                DNA Testing Services
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed max-w-3xl">
                Browse our comprehensive range of DNA tests. Afrigenomix connects you with accredited laboratories for secure, confidential testing.
              </p>
              <Link href="/test-finder">
                <Button 
                  size="lg" 
                  className="bg-teal-500 hover:bg-teal-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                >
                  <Search className="mr-2 w-5 h-5" />
                  Not sure which test? Use Test Finder
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </Container>
        </section>

        {/* Enhanced Category Filter */}
        <section className="bg-white border-b border-gray-200 py-8 sticky top-0 z-40 shadow-sm">
          <Container>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2 text-navy-900">
                <Filter className="w-5 h-5" />
                <span className="font-semibold">Filter by Category:</span>
              </div>
              <div className="flex-1 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                      selectedCategory === category.value
                        ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
            
            {selectedCategory !== 'all' && (
              <div className="text-sm text-gray-600">
                Showing {tests.length} test{tests.length !== 1 ? 's' : ''} in this category
              </div>
            )}
          </Container>
        </section>

        {/* Enhanced Tests Grid */}
        <section className="py-16 md:py-20">
          <Container>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Spinner size="lg" />
                <p className="mt-4 text-gray-600">Loading tests...</p>
              </div>
            ) : selectedCategory === 'all' ? (
              // Grouped by category with enhanced headers
              <div className="space-y-16">
                {Object.entries(groupedTests).map(([category, categoryTests]) => (
                  <div key={category} className="animate-fade-in">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="flex-1">
                        <h2 className="text-3xl md:text-4xl font-bold text-navy-900">
                          {category.charAt(0) + category.slice(1).toLowerCase()} Tests
                        </h2>
                        <p className="text-gray-600 mt-2">
                          {categoryTests.length} test{categoryTests.length !== 1 ? 's' : ''} available
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {categoryTests.map((test) => (
                        <TestCard key={test.id} test={test} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Single category view with animation
              <div className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {tests.map((test) => (
                    <TestCard key={test.id} test={test} />
                  ))}
                </div>
              </div>
            )}

            {!isLoading && tests.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-600 text-xl mb-2">No tests found in this category</p>
                <p className="text-gray-500 mb-6">Try selecting a different category or use our Test Finder</p>
                <Link href="/test-finder">
                  <Button variant="primary">
                    Use Test Finder
                  </Button>
                </Link>
              </div>
            )}
          </Container>
        </section>

        {/* Enhanced CTA Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-teal-900 text-white py-20 md:py-24">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <Container className="relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 !text-white">
                Need Help Choosing the Right Test?
              </h2>
              <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed">
                Our DNA testing specialists are available to guide you through the selection process and answer any questions
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/test-finder">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                  >
                    Use Test Finder
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-navy-900"
                  >
                    Contact a Specialist
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function TestCard({ test }: { test: TestType }) {
  return (
    <Link href={`/tests/${test.slug}`}>
      <Card className="group h-full cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border-2 border-gray-100 hover:border-teal-500">
        <div className="p-8 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-bold text-navy-900 flex-1 group-hover:text-teal-600 transition-colors">
              {test.name}
            </h3>
            {test.isLegal && (
              <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                <Scale className="w-3 h-3 mr-1" />
                Legal
              </Badge>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-6 flex-1 line-clamp-3 leading-relaxed">
            {test.description}
          </p>

          {/* Details Grid */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-2" />
                <span>Turnaround</span>
              </div>
              <span className="font-semibold text-gray-900">
                {test.turnaroundDays ? `${test.turnaroundDays} days` : 'Contact us'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <Droplet className="w-4 h-4 mr-2" />
                <span>Sample Type</span>
              </div>
              <span className="font-semibold text-gray-900">
                {test.sampleType || 'Buccal swab'}
              </span>
            </div>

            {test.chainOfCustody && (
              <div className="flex items-center gap-2 text-sm bg-white border-2 border-green-400 rounded-lg px-3 py-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="font-semibold text-navy-900">Chain of Custody Included</span>
              </div>
            )}

            {/* Price */}
            <div className="pt-4">
              {test.price ? (
                <div>
                  <div className="text-3xl font-bold text-navy-900">
                    {formatCurrency(Number(test.price), test.currency || 'NGN')}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Per test</div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                  <div className="text-lg font-semibold text-gray-700">
                    Request Quote
                  </div>
                  <div className="text-xs text-gray-500">
                    Price varies by location
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            variant="primary" 
            className="w-full mt-6 group-hover:shadow-lg transition-shadow"
          >
            View Full Details
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </Card>
    </Link>
  );
}
