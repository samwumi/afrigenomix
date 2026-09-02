'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Card, Badge, Button, Spinner } from '@/components/ui';
import { 
  FileText,
  TrendingUp,
  TrendingDown,
  Users,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  AlertCircle,
  ArrowRight,
  Beaker,
  Package,
  ShieldCheck
} from 'lucide-react';

interface DashboardData {
  summary: {
    totalCases: number;
    activeCases: number;
    pendingDocuments: number;
    upcomingAppointments: number;
    resultsReady: number;
    totalCustomers: number;
    totalLaboratories: number;
    activeLaboratories: number;
    totalRevenue: number;
    caseGrowth: number;
  };
  recentCases: Array<{
    id: string;
    caseNumber: string;
    status: string;
    createdAt: string;
    customer: {
      fullName: string;
      country: string;
    };
    testType: {
      name: string;
      category: string;
    };
    laboratory: {
      name: string;
    } | null;
  }>;
  statusDistribution: Record<string, number>;
  recentPayments: Array<{
    id: string;
    amount: number;
    currency: string;
    transactionDate: string;
    case: {
      caseNumber: string;
      customer: {
        fullName: string;
      };
    };
  }>;
  pendingActions: {
    documentsToVerify: number;
    appointmentsToConfirm: number;
    laboratoriesPending: number;
  };
}

export default function AdminDashboard() {
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
        setError('Please log in to access the admin dashboard');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/admin/dashboard', {
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
    const configs: Record<string, { label: string; color: string }> = {
      PENDING: { label: 'Pending', color: 'bg-gray-100 text-gray-700 border-gray-200' },
      DOCUMENTS_SUBMITTED: { label: 'Docs Submitted', color: 'bg-blue-100 text-blue-700 border-blue-200' },
      DOCUMENTS_VERIFIED: { label: 'Docs Verified', color: 'bg-green-100 text-green-700 border-green-200' },
      COLLECTION_SCHEDULED: { label: 'Collection Scheduled', color: 'bg-purple-100 text-purple-700 border-purple-200' },
      TESTING_IN_PROGRESS: { label: 'Testing', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
      RESULT_RELEASED: { label: 'Result Released', color: 'bg-teal-100 text-teal-700 border-teal-200' },
      COMPLETED: { label: 'Completed', color: 'bg-green-100 text-green-700 border-green-200' },
    };
    return configs[status] || { label: status, color: 'bg-gray-100 text-gray-700 border-gray-200' };
  };

  const formatCurrency = (amount: number, currency: string = 'NGN') => {
    const symbol = currency === 'NGN' ? '₦' : currency === 'USD' ? '$' : currency === 'GBP' ? '£' : currency;
    return `${symbol}${amount.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
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

  const { summary, recentCases, recentPayments, pendingActions } = data;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="flex-1 py-8 md:py-12">
        <Container>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-navy-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Overview of Afrigenomix platform operations
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {/* Total Cases */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  {summary.caseGrowth !== 0 && (
                    <div className={`flex items-center gap-1 text-sm font-semibold ${
                      summary.caseGrowth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {summary.caseGrowth > 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {Math.abs(summary.caseGrowth)}%
                    </div>
                  )}
                </div>
                <div className="text-3xl font-bold text-navy-900 mb-1">{summary.totalCases}</div>
                <div className="text-sm text-gray-700 font-medium">Total Cases</div>
                <div className="text-xs text-blue-600 mt-2">{summary.activeCases} active</div>
              </div>
            </Card>

            {/* Total Customers */}
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-navy-900 mb-1">{summary.totalCustomers}</div>
                <div className="text-sm text-gray-700 font-medium">Total Customers</div>
                <Link href="/admin/customers" className="text-xs text-purple-600 mt-2 inline-flex items-center hover:text-purple-700">
                  View all
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </Card>

            {/* Laboratories */}
            <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-navy-900 mb-1">{summary.totalLaboratories}</div>
                <div className="text-sm text-gray-700 font-medium">Laboratories</div>
                <div className="text-xs text-teal-600 mt-2">{summary.activeLaboratories} active</div>
              </div>
            </Card>

            {/* Revenue */}
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-navy-900 mb-1">
                  {formatCurrency(summary.totalRevenue)}
                </div>
                <div className="text-sm text-gray-700 font-medium">30-Day Revenue</div>
                <div className="text-xs text-green-600 mt-2">Successful payments</div>
              </div>
            </Card>
          </div>

          {/* Pending Actions */}
          {(pendingActions.documentsToVerify > 0 || 
            pendingActions.appointmentsToConfirm > 0 || 
            pendingActions.laboratoriesPending > 0) && (
            <Card className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-navy-900">Pending Actions</h3>
                    <p className="text-sm text-gray-600">Items requiring your attention</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {pendingActions.documentsToVerify > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-yellow-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-2xl font-bold text-navy-900">{pendingActions.documentsToVerify}</div>
                        <Package className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div className="text-sm text-gray-700 font-medium mb-2">Documents to Verify</div>
                      <Link href="/admin/documents">
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          Review Documents
                        </Button>
                      </Link>
                    </div>
                  )}

                  {pendingActions.appointmentsToConfirm > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-yellow-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-2xl font-bold text-navy-900">{pendingActions.appointmentsToConfirm}</div>
                        <Calendar className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div className="text-sm text-gray-700 font-medium mb-2">Appointments to Confirm</div>
                      <Link href="/admin/appointments">
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          Review Appointments
                        </Button>
                      </Link>
                    </div>
                  )}

                  {pendingActions.laboratoriesPending > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-yellow-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-2xl font-bold text-navy-900">{pendingActions.laboratoriesPending}</div>
                        <ShieldCheck className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div className="text-sm text-gray-700 font-medium mb-2">Labs to Verify</div>
                      <Link href="/admin/laboratories">
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          Review Laboratories
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Cases */}
            <div className="lg:col-span-2">
              <Card>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-navy-900">Recent Cases</h2>
                    <Link href="/admin/cases">
                      <Button variant="outline" size="sm">
                        View All
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  {recentCases.length > 0 ? (
                    <div className="space-y-4">
                      {recentCases.map((caseItem) => {
                        const statusConfig = getStatusConfig(caseItem.status);
                        return (
                          <Link key={caseItem.id} href={`/dashboard/cases/${caseItem.id}`}>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all group cursor-pointer">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-mono font-semibold text-navy-900">{caseItem.caseNumber}</span>
                                    <Badge className={statusConfig.color}>
                                      {statusConfig.label}
                                    </Badge>
                                  </div>
                                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-teal-600 transition-colors">
                                    {caseItem.testType.name}
                                  </h3>
                                  <div className="text-sm text-gray-600">
                                    <div>Customer: {caseItem.customer.fullName}</div>
                                    {caseItem.laboratory && (
                                      <div>Laboratory: {caseItem.laboratory.name}</div>
                                    )}
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(caseItem.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No recent cases
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Quick Stats & Recent Payments */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-navy-900">Quick Stats</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Pending Docs</div>
                        <div className="text-lg font-bold text-navy-900">{summary.pendingDocuments}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Appointments</div>
                        <div className="text-lg font-bold text-navy-900">{summary.upcomingAppointments}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Results Ready</div>
                        <div className="text-lg font-bold text-navy-900">{summary.resultsReady}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                        <Beaker className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Active Cases</div>
                        <div className="text-lg font-bold text-navy-900">{summary.activeCases}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Recent Payments */}
              <Card>
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-navy-900">Recent Payments</h3>
                </div>
                <div className="p-6">
                  {recentPayments.length > 0 ? (
                    <div className="space-y-3">
                      {recentPayments.slice(0, 5).map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-navy-900 truncate">
                              {payment.case.customer.fullName}
                            </div>
                            <div className="text-xs text-gray-500 font-mono">
                              {payment.case.caseNumber}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-green-600">
                              {formatCurrency(Number(payment.amount), payment.currency)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(payment.transactionDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      No recent payments
                    </div>
                  )}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card>
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-navy-900">Quick Actions</h3>
                </div>
                <div className="p-6 space-y-2">
                  <Link href="/admin/cases">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      Manage Cases
                    </Button>
                  </Link>
                  <Link href="/admin/laboratories">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Building className="w-4 h-4 mr-2" />
                      Manage Laboratories
                    </Button>
                  </Link>
                  <Link href="/admin/customers">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      Manage Customers
                    </Button>
                  </Link>
                  <Link href="/admin/reports">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <DollarSign className="w-4 h-4 mr-2" />
                      View Reports
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
