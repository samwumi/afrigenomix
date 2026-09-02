'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Card, Badge, Button, Spinner } from '@/components/ui';
import { 
  ArrowRight,
  FileText,
  Calendar,
  Beaker,
  CheckCircle,
  Clock,
  AlertCircle,
  Package,
  ShieldCheck,
  User,
  Plus,
  Search
} from 'lucide-react';

interface DashboardData {
  customer: {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
    country: string;
    city: string | null;
  };
  summary: {
    totalCases: number;
    activeCases: number;
    pendingDocuments: number;
    upcomingAppointments: number;
    resultsAvailable: number;
  };
  cases: Array<{
    id: string;
    caseNumber: string;
    status: string;
    testType: {
      id: string;
      name: string;
      category: string;
      slug: string;
      isLegal: boolean;
      chainOfCustody: boolean;
    };
    laboratory: {
      id: string;
      name: string;
      country: string;
      city: string | null;
    } | null;
    purpose: string | null;
    country: string;
    participants: Array<{
      id: string;
      fullName: string;
      relationship: string;
    }>;
    documentCount: number;
    nextAppointment: {
      id: string;
      scheduledDate: string;
      status: string;
    } | null;
    hasResult: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setError('Please log in to access your dashboard');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to load dashboard');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Dashboard error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string; icon: any }> = {
      PENDING: { label: 'Pending', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: Clock },
      DOCUMENTS_SUBMITTED: { label: 'Documents Submitted', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: FileText },
      DOCUMENTS_VERIFIED: { label: 'Documents Verified', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
      AWAITING_COLLECTION: { label: 'Awaiting Collection', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Calendar },
      COLLECTION_SCHEDULED: { label: 'Collection Scheduled', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Calendar },
      COLLECTION_COMPLETED: { label: 'Collection Complete', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
      SAMPLE_IN_TRANSIT: { label: 'Sample in Transit', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Package },
      SAMPLE_RECEIVED: { label: 'Sample Received', color: 'bg-teal-100 text-teal-700 border-teal-200', icon: CheckCircle },
      TESTING_IN_PROGRESS: { label: 'Testing in Progress', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Beaker },
      QUALITY_REVIEW: { label: 'Quality Review', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: ShieldCheck },
      RESULT_READY: { label: 'Result Ready', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
      RESULT_RELEASED: { label: 'Result Available', color: 'bg-teal-100 text-teal-700 border-teal-200', icon: CheckCircle },
      COMPLETED: { label: 'Completed', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
      CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200', icon: AlertCircle },
    };
    return configs[status] || configs.PENDING;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-navy-900 mb-2">Unable to Load Dashboard</h2>
              <p className="text-gray-600 mb-6">{error || 'Please try again later'}</p>
              <Button onClick={fetchDashboard} variant="primary">
                Try Again
              </Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const { customer, summary, cases } = data;
  const firstName = customer.fullName.split(' ')[0];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="flex-1 py-8 md:py-12">
        <Container>
          {/* Welcome Section */}
          <div className="mb-8 md:mb-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-navy-900 mb-2">
                  {getGreeting()}, {firstName}
                </h1>
                <p className="text-lg text-gray-600">
                  Welcome to your DNA testing dashboard
                </p>
              </div>
              <Link href="/test-finder">
                <Button size="lg" variant="primary" className="shadow-lg hover:shadow-xl group w-full md:w-auto">
                  <Plus className="w-5 h-5 mr-2" />
                  New Test Request
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-8 md:mb-12">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-navy-900 mb-1">{summary.totalCases}</div>
                <div className="text-sm text-gray-700 font-medium">Total Tests</div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-navy-900 mb-1">{summary.activeCases}</div>
                <div className="text-sm text-gray-700 font-medium">Active Cases</div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-navy-900 mb-1">{summary.pendingDocuments}</div>
                <div className="text-sm text-gray-700 font-medium">Pending Docs</div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-navy-900 mb-1">{summary.upcomingAppointments}</div>
                <div className="text-sm text-gray-700 font-medium">Appointments</div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-navy-900 mb-1">{summary.resultsAvailable}</div>
                <div className="text-sm text-gray-700 font-medium">Results Ready</div>
              </div>
            </Card>
          </div>

          {/* Cases Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-navy-900">Your DNA Tests</h2>
              {cases.length > 0 && (
                <Link href="/dashboard/cases">
                  <Button variant="outline" size="sm" className="group">
                    View All
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
            </div>

            {cases.length === 0 ? (
              <Card className="border-2 border-dashed border-gray-300">
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 mb-2">No Tests Yet</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Start your DNA testing journey. Use our Test Finder to get personalized recommendations.
                  </p>
                  <Link href="/test-finder">
                    <Button variant="primary" size="lg" className="group">
                      Find Your Test
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <div className="grid gap-6">
                {cases.map((caseItem) => {
                  const statusConfig = getStatusConfig(caseItem.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <Link key={caseItem.id} href={`/dashboard/cases/${caseItem.id}`}>
                      <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-teal-500 cursor-pointer">
                        <div className="p-6 md:p-8">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                            {/* Left Section */}
                            <div className="flex-1">
                              <div className="flex items-start gap-4 mb-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                  <Beaker className="w-7 h-7 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                                    <h3 className="text-xl font-bold text-navy-900 group-hover:text-teal-600 transition-colors">
                                      {caseItem.testType.name}
                                    </h3>
                                    {caseItem.testType.isLegal && (
                                      <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                                        Legal
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                    <span className="font-mono font-semibold text-navy-900">{caseItem.caseNumber}</span>
                                    <span>•</span>
                                    <span>{caseItem.country}</span>
                                  </div>
                                  
                                  {/* Status Badge */}
                                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${statusConfig.color}`}>
                                    <StatusIcon className="w-4 h-4" />
                                    <span className="font-semibold text-sm">{statusConfig.label}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Participants */}
                              {caseItem.participants.length > 0 && (
                                <div className="flex items-center gap-2 mb-4">
                                  <User className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-600">
                                    {caseItem.participants.map(p => p.fullName).join(', ')}
                                  </span>
                                </div>
                              )}

                              {/* Laboratory */}
                              {caseItem.laboratory && (
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                  <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                                    <span className="text-sm font-medium text-gray-700">
                                      Laboratory: <span className="text-navy-900">{caseItem.laboratory.name}</span>
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Right Section - Quick Info */}
                            <div className="lg:w-64 flex-shrink-0">
                              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                {caseItem.nextAppointment && (
                                  <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                      <div className="text-xs text-gray-500 font-medium uppercase mb-1">Next Appointment</div>
                                      <div className="text-sm font-semibold text-navy-900">
                                        {new Date(caseItem.nextAppointment.scheduledDate).toLocaleDateString('en-US', {
                                          month: 'short',
                                          day: 'numeric',
                                          year: 'numeric',
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-start gap-3">
                                  <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <div className="text-xs text-gray-500 font-medium uppercase mb-1">Documents</div>
                                    <div className="text-sm font-semibold text-navy-900">
                                      {caseItem.documentCount} uploaded
                                    </div>
                                  </div>
                                </div>

                                {caseItem.hasResult && (
                                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2">
                                      <CheckCircle className="w-5 h-5 text-green-600" />
                                      <span className="text-sm font-semibold text-green-900">Result Available</span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full mt-4 group-hover:bg-teal-50 group-hover:border-teal-500 group-hover:text-teal-700 transition-colors"
                              >
                                View Details
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {cases.length > 0 && (
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/test-finder">
                <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-teal-500 cursor-pointer h-full">
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Plus className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-navy-900 mb-2 group-hover:text-teal-600 transition-colors">
                      Request Another Test
                    </h3>
                    <p className="text-sm text-gray-600">
                      Use our Test Finder for personalized recommendations
                    </p>
                  </div>
                </Card>
              </Link>

              <Link href="/dashboard/documents">
                <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-blue-500 cursor-pointer h-full">
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-navy-900 mb-2 group-hover:text-blue-600 transition-colors">
                      Upload Documents
                    </h3>
                    <p className="text-sm text-gray-600">
                      Submit required identification and supporting documents
                    </p>
                  </div>
                </Card>
              </Link>

              <Link href="/contact">
                <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-purple-500 cursor-pointer h-full">
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-navy-900 mb-2 group-hover:text-purple-600 transition-colors">
                      Contact Support
                    </h3>
                    <p className="text-sm text-gray-600">
                      Get help from our DNA testing specialists
                    </p>
                  </div>
                </Card>
              </Link>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
