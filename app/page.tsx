'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Button, Badge } from '@/components/ui';
import { SEO } from '@/components/SEO';
import Link from 'next/link';
import { 
  ArrowRight, 
  Phone, 
  Shield, 
  Lock, 
  Globe, 
  CheckCircle,
  Clock,
  Users,
  MapPin,
  BookOpen,
  Calendar,
  Eye,
  Scale,
  TrendingUp,
  Heart
} from 'lucide-react';

interface FeaturedArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  viewCount: number;
}

interface Campaign {
  id: string;
  title: string;
  description: string;
  currentSignatures: number;
  signatureGoal: number;
}

export default function HomePage() {
  const [featuredArticles, setFeaturedArticles] = useState<FeaturedArticle[]>([]);
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    fetchFeaturedContent();
  }, []);

  const fetchFeaturedContent = async () => {
    try {
      // Fetch featured articles
      const articlesResponse = await fetch('/api/articles?limit=3');
      const articlesResult = await articlesResponse.json();
      if (articlesResult.success) {
        setFeaturedArticles(articlesResult.data.articles.slice(0, 3));
      }

      // Fetch active campaign
      const campaignResponse = await fetch('/api/advocacy/campaigns/active');
      const campaignResult = await campaignResponse.json();
      if (campaignResult.success) {
        setCampaign(campaignResult.data);
      }
    } catch (err) {
      console.error('Failed to fetch featured content:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateProgress = (current: number, goal: number) => {
    return Math.min(Math.round((current / goal) * 100), 100);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Afrigenomix - DNA Testing Platform for Africa"
        description="Connect with trusted laboratories for paternity, immigration, prenatal and other DNA and genetic tests in Nigeria and internationally. Truth. Science. Identity."
        canonical="https://afrigenomix.com"
        keywords={[
          'DNA testing Nigeria',
          'paternity test Africa',
          'immigration DNA test',
          'legal DNA testing',
          'prenatal paternity test',
          'DNA laboratory Nigeria',
          'genetic testing Africa',
          'UK immigration DNA',
          'USA immigration DNA',
          'chain of custody DNA test',
        ]}
      />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-teal-900">
          {/* Subtle DNA Pattern Background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <Container className="relative z-10">
            <div className="py-20 md:py-28 lg:py-36">
              <div className="max-w-5xl mx-auto">
                {/* Trust Badge */}
                <div className="flex justify-center mb-8 animate-fade-in">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2.5 border border-white/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                    </span>
                    <span className="text-sm font-medium text-white">Connecting Africa to trusted DNA testing</span>
                  </div>
                </div>

                {/* Main Heading */}
                <div className="text-center mb-8 animate-slide-up">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
                    DNA answers.<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-teal-400">
                      Trusted science.
                    </span>
                    <br />
                    Global access.
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-4">
                    We connect you with ISO-accredited laboratories for paternity, immigration, and genetic testing across Nigeria and internationally.
                  </p>
                  
                  <p className="text-base md:text-lg text-teal-200 font-medium">
                    Your trusted platform for DNA test coordination and laboratory access
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up">
                  <Link href="/test-finder">
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                    >
                      Find Your DNA Test
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-navy-900 transition-all duration-300"
                    >
                      <Phone className="mr-2 w-5 h-5" />
                      Speak to a Specialist
                    </Button>
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap justify-center items-center gap-8 text-white/90 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold">ISO Certified Labs</div>
                      <div className="text-xs text-gray-300">Verified partners</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold">100% Confidential</div>
                      <div className="text-xs text-gray-300">Secure process</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-teal-400" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold">Global Network</div>
                      <div className="text-xs text-gray-300">International labs</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>

          {/* Bottom Wave Separator */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg className="w-full h-12 md:h-16 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
            </svg>
          </div>
        </section>

        {/* How Afrigenomix Works - Platform Model */}
        <section className="bg-white py-16 md:py-20">
          <Container>
            <div className="text-center mb-12">
              <span className="inline-block text-sm font-semibold text-teal-600 uppercase tracking-wider mb-3">
                How It Works
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
                Your trusted testing coordination platform
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Afrigenomix connects you with verified laboratories and coordinates every step of your DNA testing journey
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-lg font-semibold text-navy-900 mb-2">Choose Your Test</h3>
                <p className="text-sm text-gray-600">Browse our test catalogue or use our Test Finder to identify the right DNA test</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-lg font-semibold text-navy-900 mb-2">We Connect You</h3>
                <p className="text-sm text-gray-600">We match you with the appropriate verified laboratory partner based on your needs</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-lg font-semibold text-navy-900 mb-2">Coordinate Collection</h3>
                <p className="text-sm text-gray-600">We arrange sample collection at convenient locations with trained partners</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
                <h3 className="text-lg font-semibold text-navy-900 mb-2">Receive Results</h3>
                <p className="text-sm text-gray-600">Get your results securely through our platform once the laboratory completes testing</p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 bg-white border-2 border-teal-400 rounded-full px-6 py-3 shadow-sm">
                <CheckCircle className="w-5 h-5 text-teal-600" />
                <span className="text-sm font-semibold text-navy-900">
                  We handle coordination • You get peace of mind
                </span>
              </div>
            </div>
          </Container>
        </section>

        {/* Laboratory Network Showcase */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24 border-y border-gray-200">
          <Container>
            <div className="text-center mb-12">
              <span className="inline-block text-sm font-semibold text-teal-600 uppercase tracking-wider mb-3">
                Verified Laboratory Network
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
                Partnered with leading ISO-accredited laboratories
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Every test is processed by internationally certified laboratories following strict quality and chain-of-custody protocols. 
                <span className="block mt-2 text-navy-900 font-semibold">Afrigenomix coordinates access—our partners conduct the testing.</span>
              </p>
            </div>

            {/* Laboratory Partner Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {/* Nigeria Laboratory */}
              <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 group">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <Badge className="bg-green-100 text-green-700 border-green-200 mb-3">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified Partner
                    </Badge>
                    <h3 className="text-xl font-bold text-navy-900 mb-1">GeneTech Nigeria</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      Lagos, Nigeria
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">ISO 17025 Accredited</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">Paternity & Legal Testing</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">Immigration DNA Testing</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Accreditation: ISO 17025 • CAP
                  </div>
                </div>
              </div>

              {/* UK Laboratory */}
              <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 group">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <Badge className="bg-green-100 text-green-700 border-green-200 mb-3">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified Partner
                    </Badge>
                    <h3 className="text-xl font-bold text-navy-900 mb-1">AlphaBiolabs UK</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      Warrington, United Kingdom
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">ISO 17025 Accredited</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">UK Immigration Testing</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">Prenatal Paternity Testing</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Accreditation: ISO 17025 • UKAS
                  </div>
                </div>
              </div>

              {/* Why Our Network */}
              <div className="bg-gradient-to-br from-navy-900 to-teal-900 rounded-2xl p-8 shadow-xl text-white">
                <h3 className="text-2xl font-bold mb-4 !text-white">Why our laboratory network?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-teal-300 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-200">All partners undergo strict verification and maintain international accreditation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-teal-300 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-200">Chain of custody protocols for legal and immigration testing</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-teal-300 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-200">Continuous quality monitoring and compliance checks</span>
                  </li>
                </ul>

                <div className="mt-6 pt-6 border-t border-white/20">
                  <Link href="/laboratories">
                    <Button variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-navy-900 w-full">
                      View All Laboratory Partners
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Network Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-navy-900 mb-2">5+</div>
                <div className="text-sm text-gray-600">Verified Laboratory Partners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-navy-900 mb-2">8+</div>
                <div className="text-sm text-gray-600">Countries Covered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-navy-900 mb-2">15+</div>
                <div className="text-sm text-gray-600">Test Types Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-navy-900 mb-2">99.9%</div>
                <div className="text-sm text-gray-600">Testing Accuracy</div>
              </div>
            </div>
          </Container>
        </section>

        {/* Test Discovery Section */}
        <section className="py-20 md:py-28 bg-white">
          <Container>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-block text-sm font-semibold text-teal-600 uppercase tracking-wider mb-3">
                Find Your Test
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-navy-900 mb-6">
                What do you need to know?
              </h2>
              <p className="text-xl text-gray-600">
                Browse by category or use our intelligent Test Finder to get personalized recommendations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Paternity & Relationship */}
              <Link href="/tests?category=paternity">
                <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-teal-500 h-full cursor-pointer">
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 to-blue-600 overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Users className="w-20 h-20 text-white opacity-90" />
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/20 backdrop-blur-sm border-white/30 text-white">
                        5 tests
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-navy-900 mb-3 group-hover:text-teal-600 transition-colors">
                      Establish Relationship
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Paternity, maternity, sibling, and other biological relationship testing
                    </p>
                    
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        Legal and peace-of-mind options
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        Same-day collection available
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        Results in 3-5 business days
                      </li>
                    </ul>
                    
                    <div className="flex items-center text-teal-600 font-semibold group-hover:translate-x-2 transition-transform">
                      Explore Tests
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </div>
                  </div>
                </div>
              </Link>

              {/* Immigration & Visa */}
              <Link href="/tests?category=immigration">
                <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-teal-500 h-full cursor-pointer">
                  <div className="relative h-48 bg-gradient-to-br from-purple-500 to-purple-600 overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Globe className="w-20 h-20 text-white opacity-90" />
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/20 backdrop-blur-sm border-white/30 text-white">
                        4 tests
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-navy-900 mb-3 group-hover:text-teal-600 transition-colors">
                      Immigration & Visa
                    </h3>
                    <p className="text-gray-600 mb-4">
                      DNA testing for UK, USA, Canada, and international immigration applications
                    </p>
                    
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        Chain of custody included
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        Embassy-approved laboratories
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        International coordination
                      </li>
                    </ul>
                    
                    <div className="flex items-center text-teal-600 font-semibold group-hover:translate-x-2 transition-transform">
                      Explore Tests
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </div>
                  </div>
                </div>
              </Link>

              {/* Prenatal Testing */}
              <Link href="/tests/prenatal-paternity-dna-test">
                <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-teal-500 h-full cursor-pointer">
                  <div className="relative h-48 bg-gradient-to-br from-pink-500 to-pink-600 overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-20 h-20 text-white opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/20 backdrop-blur-sm border-white/30 text-white">
                        1 test
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-navy-900 mb-3 group-hover:text-teal-600 transition-colors">
                      Prenatal Testing
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Non-invasive prenatal paternity testing during pregnancy
                    </p>
                    
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        Safe for mother and baby
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        From 7 weeks of pregnancy
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        99.9% accuracy
                      </li>
                    </ul>
                    
                    <div className="flex items-center text-teal-600 font-semibold group-hover:translate-x-2 transition-transform">
                      Learn More
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </div>
                  </div>
                </div>
              </Link>

              {/* Legal Testing */}
              <Link href="/tests?category=legal">
                <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-teal-500 h-full cursor-pointer">
                  <div className="relative h-48 bg-gradient-to-br from-amber-500 to-amber-600 overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-20 h-20 text-white opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/20 backdrop-blur-sm border-white/30 text-white">
                        3 tests
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-navy-900 mb-3 group-hover:text-teal-600 transition-colors">
                      Legal DNA Testing
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Court-admissible DNA testing with full chain of custody documentation
                    </p>
                    
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        Court-admissible results
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        Identity verification included
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        Witnessed sample collection
                      </li>
                    </ul>
                    
                    <div className="flex items-center text-teal-600 font-semibold group-hover:translate-x-2 transition-transform">
                      Explore Tests
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </div>
                  </div>
                </div>
              </Link>

              {/* Genetic Testing */}
              <Link href="/tests?category=genetic">
                <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-teal-500 h-full cursor-pointer">
                  <div className="relative h-48 bg-gradient-to-br from-teal-500 to-teal-600 overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-20 h-20 text-white opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/20 backdrop-blur-sm border-white/30 text-white">
                        2 tests
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-navy-900 mb-3 group-hover:text-teal-600 transition-colors">
                      Genetic Testing
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Ancestry testing and other genetic analysis services
                    </p>
                    
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        Ancestry composition
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        Comprehensive reports
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        Secure data handling
                      </li>
                    </ul>
                    
                    <div className="flex items-center text-teal-600 font-semibold group-hover:translate-x-2 transition-transform">
                      Explore Tests
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </div>
                  </div>
                </div>
              </Link>

              {/* Test Finder CTA */}
              <div className="group bg-gradient-to-br from-navy-900 via-navy-800 to-teal-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-teal-400 h-full cursor-pointer">
                <Link href="/test-finder">
                  <div className="p-8 h-full flex flex-col justify-center items-center text-center text-white">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <svg className="w-10 h-10 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3 !text-white">
                      Not sure which test?
                    </h3>
                    <p className="text-gray-200 mb-6">
                      Use our intelligent Test Finder to get personalized recommendations based on your specific needs
                    </p>
                    
                    <Button 
                      variant="secondary" 
                      size="lg" 
                      className="w-full group-hover:scale-105 transition-transform"
                    >
                      Use Test Finder
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </Link>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/tests">
                <Button variant="outline" size="lg" className="group">
                  View All Tests
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </Container>
        </section>

        {/* Featured Blog Articles Section */}
        <section className="bg-white py-16 md:py-20">
          <Container>
            <div className="text-center mb-12">
              <span className="inline-block text-sm font-semibold text-teal-600 uppercase tracking-wider mb-3">
                Knowledge & Insights
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
                DNA Education & Advocacy
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Expert articles on DNA testing, paternity fraud awareness, and our mission to protect families through legislation
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {featuredArticles.map((article) => (
                <Link key={article.id} href={`/blog/${article.slug}`}>
                  <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-teal-500 h-full cursor-pointer">
                    {/* Image Placeholder */}
                    <div className="relative h-48 bg-gradient-to-br from-teal-500 to-navy-900 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-white/50 group-hover:scale-110 transition-transform" />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/20 backdrop-blur-sm border-white/30 text-white">
                          {article.category.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-navy-900 mb-3 group-hover:text-teal-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-700 mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(article.publishedAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          <span>{article.viewCount}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-teal-600 font-semibold group-hover:gap-2 transition-all">
                        Read Article
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link href="/blog">
                <Button variant="outline" size="lg" className="group">
                  <BookOpen className="w-5 h-5 mr-2" />
                  View All Articles
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </Container>
        </section>

        {/* Advocacy Campaign Spotlight */}
        {campaign && (
          <section className="bg-gradient-to-br from-red-900 via-red-800 to-orange-900 py-16 md:py-20 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>
            
            <Container className="relative z-10">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-4">
                    <Scale className="w-5 h-5" />
                    <span className="font-semibold">Our Advocacy</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 !text-white">
                    {campaign.title}
                  </h2>
                  
                  <p className="text-xl text-gray-100 max-w-3xl mx-auto">
                    {campaign.description}
                  </p>
                </div>

                {/* Progress Card */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-semibold text-white">Campaign Progress</div>
                    <Badge className="bg-green-500 text-white border-green-400">
                      ACTIVE
                    </Badge>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="relative w-full bg-white/20 rounded-full h-6 overflow-hidden mb-4">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-1000 flex items-center justify-center text-white font-bold text-sm"
                      style={{ width: `${calculateProgress(campaign.currentSignatures, campaign.signatureGoal)}%` }}
                    >
                      {calculateProgress(campaign.currentSignatures, campaign.signatureGoal)}%
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-200">
                    <span className="font-semibold">{campaign.currentSignatures.toLocaleString()} signatures</span>
                    <span>Goal: {campaign.signatureGoal.toLocaleString()}</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <Link href="/advocacy">
                    <Button size="lg" className="w-full sm:w-auto bg-white text-red-900 hover:bg-gray-100 shadow-xl group">
                      <Heart className="w-5 h-5 mr-2" />
                      Support the Campaign
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  
                  <Link href="/blog?category=PATERNITY_FRAUD">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-red-900">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Learn About the Issue
                    </Button>
                  </Link>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1 !text-white">{campaign.currentSignatures.toLocaleString()}</div>
                    <div className="text-sm text-gray-200">Supporters</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1 !text-white">{calculateProgress(campaign.currentSignatures, campaign.signatureGoal)}%</div>
                    <div className="text-sm text-gray-200">Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1 !text-white">1</div>
                    <div className="text-sm text-gray-200">Active Campaign</div>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* CTA Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-teal-900 py-20 md:py-28">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <Container className="relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 !text-white">
                Ready to connect with trusted laboratories?
              </h2>
              <p className="text-xl md:text-2xl text-gray-200 mb-4 max-w-3xl mx-auto leading-relaxed">
                Let Afrigenomix coordinate your DNA testing journey from start to finish
              </p>
              <p className="text-base text-teal-200 mb-10">
                We handle the complexity • You get the answers
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link href="/test-finder">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    Find Your Test
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-navy-900"
                  >
                    <Phone className="mr-2 w-5 h-5" />
                    Contact a Specialist
                  </Button>
                </Link>
              </div>

              {/* Quick Links */}
              <div className="grid md:grid-cols-3 gap-6 pt-8 border-t border-white/20">
                <div className="text-center">
                  <Clock className="w-8 h-8 text-teal-300 mx-auto mb-3" />
                  <h3 className="font-semibold mb-1 !text-white">Quick Turnaround</h3>
                  <p className="text-sm text-gray-300">Results in 3-10 business days</p>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 text-teal-300 mx-auto mb-3" />
                  <h3 className="font-semibold mb-1 !text-white">Secure & Private</h3>
                  <p className="text-sm text-gray-300">100% confidential handling</p>
                </div>
                <div className="text-center">
                  <Users className="w-8 h-8 text-teal-300 mx-auto mb-3" />
                  <h3 className="font-semibold mb-1 !text-white">Expert Support</h3>
                  <p className="text-sm text-gray-300">Guidance every step</p>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
