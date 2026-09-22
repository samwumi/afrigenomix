'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SEO } from '@/components/SEO';
import { Card } from '@/components/ui';
import { 
  Search, 
  FileText, 
  Calendar, 
  FlaskConical,
  FileCheck,
  Shield,
  Building2,
  Lock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <SEO
        title="How Afrigenomix Works - DNA Testing Process Explained"
        description="Understand how Afrigenomix connects you with accredited laboratories, coordinates sample collection, and delivers secure DNA test results across Africa."
        canonical="https://afrigenomix.com/how-it-works"
      />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-teal-900 text-white py-20 md:py-28">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 !text-white">
                How Afrigenomix Works
              </h1>
              <p className="text-xl md:text-2xl text-gray-200">
                Your trusted coordinator for DNA testing across Africa
              </p>
            </div>
          </Container>
        </div>

        {/* What We Are Section */}
        <Container className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 md:p-12 bg-gradient-to-br from-teal-50 to-blue-50 border-2 border-teal-100 mb-16">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-navy-900 mb-4">Afrigenomix is NOT a Laboratory</h2>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    We are a <strong>DNA testing coordination platform</strong>. We connect individuals with accredited, certified laboratories across Africa and handle the logistics of sample collection, test coordination, and result delivery.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Your samples are processed by <strong>ISO 17025 accredited laboratories</strong> with proven track records, embassy approvals, and court admissibility.
                  </p>
                </div>
              </div>
            </Card>

            {/* Process Steps */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-navy-900 mb-8 text-center">Your Testing Journey</h2>
              
              <div className="space-y-6">
                {/* Step 1 */}
                <Card className="p-8 border-l-4 border-teal-500">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-teal-600">1</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Search className="w-6 h-6 text-teal-600" />
                        <h3 className="text-2xl font-bold text-navy-900">Select Your Test</h3>
                      </div>
                      <p className="text-gray-700 mb-4">
                        Browse our test catalog and select the DNA test you need (paternity, immigration, legal, prenatal, etc.). Each test listing shows:
                      </p>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                          <span>Which accredited laboratory will process your test</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                          <span>Laboratory location and accreditations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                          <span>Pricing, turnaround time, and requirements</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card>

                {/* Step 2 */}
                <Card className="p-8 border-l-4 border-blue-500">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-blue-600">2</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <FileText className="w-6 h-6 text-blue-600" />
                        <h3 className="text-2xl font-bold text-navy-900">Submit Your Information</h3>
                      </div>
                      <p className="text-gray-700 mb-4">
                        Complete our secure online form with participant details and upload required documents (ID, passport, consent forms). We verify your information and create your case file.
                      </p>
                      <p className="text-sm text-gray-600 italic">
                        Note: Afrigenomix handles coordination only. The testing laboratory maintains your genetic data.
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Step 3 */}
                <Card className="p-8 border-l-4 border-purple-500">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-purple-600">3</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Calendar className="w-6 h-6 text-purple-600" />
                        <h3 className="text-2xl font-bold text-navy-900">Sample Collection</h3>
                      </div>
                      <p className="text-gray-700 mb-4">
                        We coordinate sample collection through verified partners or the laboratory's own collection centers:
                      </p>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                          <span><strong>Legal/Immigration tests:</strong> Witnessed collection with photo ID verification</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                          <span><strong>Peace-of-mind tests:</strong> Home collection kits or walk-in appointments</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                          <span>Chain of custody maintained for court-admissible results</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card>

                {/* Step 4 */}
                <Card className="p-8 border-l-4 border-orange-500">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-orange-600">4</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <FlaskConical className="w-6 h-6 text-orange-600" />
                        <h3 className="text-2xl font-bold text-navy-900">Laboratory Testing</h3>
                      </div>
                      <p className="text-gray-700 mb-4">
                        Your samples are transported to the accredited laboratory for analysis:
                      </p>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <span>DNA extraction and analysis using certified equipment</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <span>Quality control and independent verification</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <span>Results typically ready in 3-5 business days</span>
                        </li>
                      </ul>
                      <p className="text-sm text-gray-600 italic mt-4">
                        Your genetic data remains with the laboratory. Afrigenomix never accesses or stores your DNA information.
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Step 5 */}
                <Card className="p-8 border-l-4 border-green-500">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-green-600">5</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <FileCheck className="w-6 h-6 text-green-600" />
                        <h3 className="text-2xl font-bold text-navy-900">Receive Your Results</h3>
                      </div>
                      <p className="text-gray-700 mb-4">
                        Results are delivered securely from the laboratory:
                      </p>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Digital copy via secure portal</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Printed certificate with laboratory seal</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Court-admissible documents for legal cases</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* FAQs */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-navy-900 mb-8 text-center">Common Questions</h2>

              <Card className="p-6 bg-gray-50">
                <h3 className="text-lg font-bold text-navy-900 mb-2 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-teal-600" />
                  Which laboratories do you work with?
                </h3>
                <p className="text-gray-700">
                  We partner with ISO 17025 accredited laboratories in Nigeria, Ghana, Kenya, and South Africa. Each test listing specifies which laboratory will process your sample, including their location, certifications, and specializations.
                </p>
              </Card>

              <Card className="p-6 bg-gray-50">
                <h3 className="text-lg font-bold text-navy-900 mb-2 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-teal-600" />
                  Who has access to my genetic data?
                </h3>
                <p className="text-gray-700">
                  Only the accredited laboratory performing your test has access to your genetic data. Afrigenomix coordinates logistics but does not receive, process, or store DNA samples or genetic information. All laboratories follow strict data protection regulations.
                </p>
              </Card>

              <Card className="p-6 bg-gray-50">
                <h3 className="text-lg font-bold text-navy-900 mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-teal-600" />
                  Are results court-admissible?
                </h3>
                <p className="text-gray-700">
                  Yes. For legal DNA tests, we coordinate witnessed sample collection with proper chain of custody documentation. The laboratory issues court-admissible certificates that meet judicial requirements in Nigeria and internationally.
                </p>
              </Card>

              <Card className="p-6 bg-gray-50">
                <h3 className="text-lg font-bold text-navy-900 mb-2">
                  Why use Afrigenomix instead of contacting a lab directly?
                </h3>
                <p className="text-gray-700 mb-3">
                  Afrigenomix simplifies the process:
                </p>
                <ul className="space-y-2 text-gray-600 ml-4">
                  <li>• We guide you to the right test and laboratory for your needs</li>
                  <li>• We coordinate sample collection through verified partners nationwide</li>
                  <li>• We handle logistics between collection points and laboratories</li>
                  <li>• We provide ongoing case support and result delivery</li>
                  <li>• One platform for multiple accredited laboratories across Africa</li>
                </ul>
              </Card>
            </div>

            {/* CTA */}
            <div className="mt-16 text-center">
              <Card className="p-12 bg-gradient-to-br from-navy-900 to-teal-900 text-white">
                <h2 className="text-3xl font-bold mb-4 !text-white">Ready to Get Started?</h2>
                <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                  Find your test and connect with an accredited laboratory today
                </p>
                <a
                  href="/test-finder"
                  className="inline-block bg-white text-navy-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg"
                >
                  Browse DNA Tests
                </a>
              </Card>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
