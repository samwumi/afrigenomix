'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SEO } from '@/components/SEO';
import { Card } from '@/components/ui';
import { Users, Target, Eye, Heart, Award, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <SEO
        title="About Afrigenomix - DNA Testing Across Africa"
        description="Learn about Afrigenomix's mission to make DNA testing accessible, affordable, and reliable across Africa. We connect individuals with trusted laboratories and advocate for paternity fraud legislation."
        canonical="https://afrigenomix.com/about"
        keywords={[
          'about afrigenomix',
          'DNA testing Africa',
          'paternity testing Nigeria',
          'DNA test advocacy',
          'African genomics',
        ]}
      />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-teal-900 text-white py-20 md:py-32">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 !text-white">
                About Afrigenomix
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
                Making DNA testing accessible, affordable, and reliable across Africa
              </p>
            </div>
          </Container>
        </div>

        {/* Mission Section */}
        <Container className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="p-8 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-3">Our Mission</h3>
                <p className="text-gray-600">
                  To provide accessible, affordable, and reliable DNA testing services across Africa while advocating for legislative reform.
                </p>
              </Card>

              <Card className="p-8 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-3">Our Vision</h3>
                <p className="text-gray-600">
                  A future where every African has access to DNA testing services and where paternity fraud is recognized and addressed by law.
                </p>
              </Card>

              <Card className="p-8 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-3">Our Values</h3>
                <p className="text-gray-600">
                  Integrity, transparency, accuracy, compassion, and unwavering commitment to justice for paternity fraud victims.
                </p>
              </Card>
            </div>

            {/* Story Section */}
            <div className="prose prose-lg max-w-none mb-16">
              <h2 className="text-3xl font-bold text-navy-900 mb-6">Our Story</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Afrigenomix was founded with a clear purpose: to bridge the gap in DNA testing accessibility across Africa. We recognized that while DNA testing technology has advanced globally, many Africans face significant barriers in accessing these crucial services.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Beyond providing testing services, we are passionate advocates for legislative reform. Paternity fraud affects countless individuals and families, yet it remains largely unaddressed by legal systems across the continent. We are working to change that.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Through our network of trusted laboratories, educational resources, and advocacy campaigns, we are building a future where DNA testing is accessible to all and where legal protections exist for victims of paternity fraud.
              </p>
            </div>

            {/* What We Do */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-navy-900 mb-8 text-center">What We Do</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 border-l-4 border-teal-500">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-navy-900 mb-2">Connect People with Labs</h3>
                      <p className="text-gray-600">
                        We partner with accredited laboratories across Africa to provide accessible DNA testing services for paternity, immigration, legal, and other purposes.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-l-4 border-blue-500">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Globe className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-navy-900 mb-2">Educate & Inform</h3>
                      <p className="text-gray-600">
                        Through our blog and resources, we provide accurate, science-based information about DNA testing, helping people make informed decisions.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-l-4 border-purple-500">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-navy-900 mb-2">Advocate for Change</h3>
                      <p className="text-gray-600">
                        We campaign for legislation criminalizing paternity fraud across Africa, working with policymakers and raising public awareness.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-l-4 border-orange-500">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Heart className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-navy-900 mb-2">Support Victims</h3>
                      <p className="text-gray-600">
                        We provide resources and guidance for those affected by paternity fraud, helping them understand their options and seek justice.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* CTA Section */}
            <Card className="bg-gradient-to-br from-navy-900 to-teal-900 text-white p-12 text-center">
              <h2 className="text-3xl font-bold mb-4 !text-white">Ready to Get Started?</h2>
              <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                Whether you need DNA testing services or want to join our advocacy efforts, we're here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/test-finder"
                  className="inline-block bg-white text-navy-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Find Your Test
                </a>
                <a
                  href="/contact"
                  className="inline-block bg-teal-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-teal-600 transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </Card>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
