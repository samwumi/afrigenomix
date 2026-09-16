'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui';
import { SEO } from '@/components/SEO';
import Link from 'next/link';
import { 
  ArrowRight, 
  Shield, 
  Clock, 
  Globe,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

interface FeaturedArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  publishedAt: string;
}

export default function HomePage() {
  const [featuredArticles, setFeaturedArticles] = useState<FeaturedArticle[]>([]);

  useEffect(() => {
    fetchFeaturedContent();
  }, []);

  const fetchFeaturedContent = async () => {
    try {
      const articlesResponse = await fetch('/api/articles?limit=3');
      const articlesResult = await articlesResponse.json();
      if (articlesResult.success) {
        setFeaturedArticles(articlesResult.data.articles.slice(0, 3));
      }
    } catch (err) {
      console.error('Failed to fetch featured content:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO
        title="Afrigenomix - DNA Testing Platform for Africa"
        description="Connect with trusted laboratories for paternity, immigration, prenatal and other DNA tests in Nigeria and across Africa."
        canonical="https://afrigenomix.com"
      />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - Clean & Minimal */}
        <section className="py-20 md:py-32">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Text Content */}
              <div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-navy-900 mb-6 leading-tight">
                  Truth Through Science
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 mb-8">
                  Connect with trusted DNA testing laboratories across Africa for paternity, immigration, and legal testing
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/test-finder">
                    <Button size="lg" variant="primary" className="text-lg px-8 py-6 w-full sm:w-auto">
                      Find Your Test
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button size="lg" variant="outline" className="text-lg px-8 py-6 w-full sm:w-auto">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right: Hero Image */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&auto=format&fit=crop&q=80" 
                    alt="DNA Testing Laboratory"
                    className="w-full h-[500px] object-cover"
                  />
                  {/* Overlay gradient for better text readability if needed */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/20 to-transparent"></div>
                </div>
                
                {/* Floating trust badge */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-navy-900">99.99%</div>
                      <div className="text-sm text-gray-600">Accuracy Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Features Section - Minimal Cards */}
        <section className="py-20 bg-gray-50">
          <Container>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
                  Why Choose Afrigenomix
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  We connect you with accredited laboratories for accurate, confidential DNA testing
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="bg-white p-8 rounded-2xl hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                    <Shield className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 mb-3">
                    Accredited Labs
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Partner laboratories certified to international standards for reliable results
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-white p-8 rounded-2xl hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 mb-3">
                    Fast Results
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Get accurate DNA test results within 3-5 business days
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-white p-8 rounded-2xl hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                    <Globe className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 mb-3">
                    International Coverage
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Embassy-approved testing for UK, USA, and Canadian visa applications
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Services Section - Clean List */}
        <section className="py-20">
          <Container>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
                  Our Services
                </h2>
                <p className="text-lg text-gray-600">
                  Comprehensive DNA testing solutions for every need
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    title: 'Paternity Testing',
                    description: 'Legal and peace-of-mind paternity tests with 99.99% accuracy',
                    link: '/tests'
                  },
                  {
                    title: 'Immigration DNA Testing',
                    description: 'Embassy-approved testing for family reunion visas',
                    link: '/tests'
                  },
                  {
                    title: 'Legal DNA Testing',
                    description: 'Court-admissible results with proper chain of custody',
                    link: '/tests'
                  },
                  {
                    title: 'Prenatal Testing',
                    description: 'Non-invasive prenatal paternity testing from 7 weeks',
                    link: '/tests'
                  }
                ].map((service, index) => (
                  <Link key={index} href={service.link}>
                    <div className="bg-white border border-gray-200 p-6 rounded-xl hover:border-teal-500 hover:shadow-md transition-all group">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-navy-900 mb-2 group-hover:text-teal-600 transition-colors">
                            {service.title}
                          </h3>
                          <p className="text-gray-600">
                            {service.description}
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* How It Works - With Images */}
        <section className="py-20 bg-gray-50">
          <Container>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
                  How It Works
                </h2>
                <p className="text-lg text-gray-600">
                  Simple, fast, and confidential DNA testing in three easy steps
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="text-center">
                  <div className="mb-6 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&auto=format&fit=crop&q=80" 
                      alt="Choose your test"
                      className="w-full h-48 object-cover rounded-xl shadow-lg"
                    />
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                      1
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 mb-3">
                    Choose Your Test
                  </h3>
                  <p className="text-gray-600">
                    Select the DNA test that matches your needs from our comprehensive catalog
                  </p>
                </div>

                {/* Step 2 */}
                <div className="text-center">
                  <div className="mb-6 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&auto=format&fit=crop&q=80" 
                      alt="Sample collection"
                      className="w-full h-48 object-cover rounded-xl shadow-lg"
                    />
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                      2
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 mb-3">
                    Collect Sample
                  </h3>
                  <p className="text-gray-600">
                    Simple cheek swab collection at home or at our partner locations
                  </p>
                </div>

                {/* Step 3 */}
                <div className="text-center">
                  <div className="mb-6 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&auto=format&fit=crop&q=80" 
                      alt="Get results"
                      className="w-full h-48 object-cover rounded-xl shadow-lg"
                    />
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                      3
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 mb-3">
                    Get Results
                  </h3>
                  <p className="text-gray-600">
                    Receive accurate results in 3-5 days via secure online portal
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Stats Section - Minimal */}
        <section className="py-20 bg-navy-900 text-white">
          <Container>
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-teal-400 mb-2">99.99%</div>
                  <div className="text-gray-300">Accuracy Rate</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-teal-400 mb-2">3-5</div>
                  <div className="text-gray-300">Days for Results</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-teal-400 mb-2">24/7</div>
                  <div className="text-gray-300">Support Available</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-teal-400 mb-2">100+</div>
                  <div className="text-gray-300">Partner Labs</div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Trust Section - With Image */}
        <section className="py-20">
          <Container>
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Image */}
                <div className="order-2 lg:order-1">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=700&auto=format&fit=crop&q=80" 
                      alt="Accredited Laboratory"
                      className="w-full h-[400px] object-cover"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="order-1 lg:order-2">
                  <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-6">
                    Trusted by Families Across Africa
                  </h2>
                  <p className="text-lg text-gray-600 mb-8">
                    We partner with internationally accredited laboratories to ensure the highest standards of accuracy, confidentiality, and reliability in DNA testing.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-4">
                      <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-teal-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-navy-900 mb-1">AABB Accredited</h3>
                        <p className="text-gray-600">All partner labs meet international accreditation standards</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-teal-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-navy-900 mb-1">Confidential & Secure</h3>
                        <p className="text-gray-600">Your privacy is protected with bank-level encryption</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-teal-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-navy-900 mb-1">Expert Support</h3>
                        <p className="text-gray-600">Dedicated team to guide you through the process</p>
                      </div>
                    </div>
                  </div>

                  <Link href="/about">
                    <Button variant="outline" size="lg">
                      Learn About Our Standards
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Blog Section - Clean Cards */}
        {featuredArticles.length > 0 && (
          <section className="py-20">
            <Container>
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-2">
                      Latest Insights
                    </h2>
                    <p className="text-lg text-gray-600">
                      Expert guidance on DNA testing
                    </p>
                  </div>
                  <Link href="/blog">
                    <Button variant="outline">
                      View All
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {featuredArticles.map((article) => (
                    <Link key={article.id} href={`/blog/${article.slug}`}>
                      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-teal-500 transition-all group">
                        <div className="p-6">
                          <div className="text-sm text-teal-600 font-medium mb-3">
                            {article.category.replace('_', ' ')}
                          </div>
                          <h3 className="text-xl font-bold text-navy-900 mb-3 group-hover:text-teal-600 transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 line-clamp-2 mb-4">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <span>Read More</span>
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* CTA Section - Clean & Simple */}
        <section className="py-20 bg-gradient-to-br from-teal-600 to-teal-700 text-white">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-teal-100 mb-10">
                Find the right DNA test for your needs in minutes
              </p>
              <Link href="/test-finder">
                <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100 text-lg px-8 py-6">
                  Find Your Test
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
