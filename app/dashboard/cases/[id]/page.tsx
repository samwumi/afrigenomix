'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Card, Badge, Button, Spinner } from '@/components/ui';
import { 
  ArrowLeft,
  FileText,
  Calendar,
  Users,
  Building,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  Download,
  Droplet,
  Beaker,
  ShieldCheck,
  Package,
  ExternalLink,
  ChevronRight,
  Info,
  DollarSign
} from 'lucide-react';

interface CaseDetail {
  id: string;
  caseNumber: string;
  status: string;
  purpose: string | null;
  country: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  testType: any;
  laboratory: any;
  customer: any;
  participants: any[];
  documents: any[];
  appointments: any[];
  samples: any[];
  quotes: any[];
  payments: any[];
  results: any[];
  timeline: any[];
  statusTimeline: {
    steps: Array<{ key: string; label: string; icon: string }>;
    currentStep: number;
    progress: number;
  };
}

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'documents'>('overview');

  useEffect(() => {
    if (params.id) {
      fetchCaseDetail(params.id as string);
    }
  }, [params.id]);

  const fetchCaseDetail = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setError('Please log in to view case details');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`/api/cases/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (result.success) {
        setCaseData(result.data);
      } else {
        setError(result.error || 'Failed to load case details');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Case detail error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string; bgColor: string }> = {
      PENDING: { label: 'Pending', color: 'text-gray-700', bgColor: 'bg-gray-100 border-gray-200' },
      DOCUMENTS_SUBMITTED: { label: 'Documents Submitted', color: 'text-blue-700', bgColor: 'bg-blue-100 border-blue-200' },
      DOCUMENTS_VERIFIED: { label: 'Documents Verified', color: 'text-green-700', bgColor: 'bg-green-100 border-green-200' },
      AWAITING_COLLECTION: { label: 'Awaiting Collection', color: 'text-yellow-700', bgColor: 'bg-yellow-100 border-yellow-200' },
      COLLECTION_SCHEDULED: { label: 'Collection Scheduled', color: 'text-purple-700', bgColor: 'bg-purple-100 border-purple-200' },
      COLLECTION_COMPLETED: { label: 'Collection Complete', color: 'text-green-700', bgColor: 'bg-green-100 border-green-200' },
      SAMPLE_IN_TRANSIT: { label: 'Sample in Transit', color: 'text-blue-700', bgColor: 'bg-blue-100 border-blue-200' },
      SAMPLE_RECEIVED: { label: 'Sample Received', color: 'text-teal-700', bgColor: 'bg-teal-100 border-teal-200' },
      TESTING_IN_PROGRESS: { label: 'Testing in Progress', color: 'text-purple-700', bgColor: 'bg-purple-100 border-purple-200' },
      QUALITY_REVIEW: { label: 'Quality Review', color: 'text-indigo-700', bgColor: 'bg-indigo-100 border-indigo-200' },
      RESULT_READY: { label: 'Result Ready', color: 'text-green-700', bgColor: 'bg-green-100 border-green-200' },
      RESULT_RELEASED: { label: 'Result Available', color: 'text-teal-700', bgColor: 'bg-teal-100 border-teal-200' },
      COMPLETED: { label: 'Completed', color: 'text-green-700', bgColor: 'bg-green-100 border-green-200' },
      CANCELLED: { label: 'Cancelled', color: 'text-red-700', bgColor: 'bg-red-100 border-red-200' },
    };
    return configs[status] || configs.PENDING;
  };

  const getTimelineIcon = (icon: string) => {
    const icons: Record<string, any> = {
      'file': FileText,
      'upload': Upload,
      'check': CheckCircle,
      'calendar': Calendar,
      'droplet': Droplet,
      'building': Building,
      'beaker': Beaker,
      'shield': ShieldCheck,
      'check-circle': CheckCircle,
    };
    return icons[icon] || FileText;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600">Loading case details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-navy-900 mb-2">Unable to Load Case</h2>
              <p className="text-gray-600 mb-6">{error || 'Case not found'}</p>
              <Button onClick={() => router.push('/dashboard')} variant="primary">
                Back to Dashboard
              </Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const statusConfig = getStatusConfig(caseData.status);
  const nextAppointment = caseData.appointments.find(a => a.status === 'CONFIRMED' || a.status === 'REQUESTED');
  const hasResult = caseData.results.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="flex-1 py-8 md:py-12">
        <Container>
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center">
                    <Beaker className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-navy-900">
                      {caseData.testType.name}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <span className="font-mono font-semibold text-lg text-navy-900">{caseData.caseNumber}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${statusConfig.bgColor}`}>
                    <CheckCircle className={`w-5 h-5 ${statusConfig.color}`} />
                    <span className={`font-semibold ${statusConfig.color}`}>{statusConfig.label}</span>
                  </div>
                  
                  {caseData.testType.isLegal && (
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200 px-4 py-2">
                      <ShieldCheck className="w-4 h-4 mr-1" />
                      Legal Testing
                    </Badge>
                  )}
                  
                  {caseData.testType.chainOfCustody && (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-2">
                      Chain of Custody
                    </Badge>
                  )}
                </div>
              </div>

              {hasResult && (
                <Link href={`/dashboard/cases/${caseData.id}/result`}>
                  <Button size="lg" variant="primary" className="shadow-xl hover:shadow-2xl group w-full lg:w-auto">
                    <Download className="w-5 h-5 mr-2" />
                    View Result
                    <ArrowLeft className="w-5 h-5 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
            </div>

            {/* Info Banner */}
            <div className="bg-white border border-teal-300 rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-navy-900 mb-1">
                    Testing coordinated by Afrigenomix
                  </p>
                  <p className="text-sm text-gray-700">
                    {caseData.laboratory 
                      ? `Laboratory testing conducted by ${caseData.laboratory.name}`
                      : 'We will connect you with an appropriate verified laboratory partner'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Timeline */}
          <Card className="mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-navy-900 to-teal-900 p-6 text-white">
              <h2 className="text-xl font-bold mb-2 !text-white">Testing Progress</h2>
              <p className="text-gray-200">Track your DNA test journey from start to finish</p>
            </div>
            <div className="p-6 md:p-8">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full transition-all duration-1000 shadow-sm"
                    style={{ width: `${caseData.statusTimeline.progress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-3">
                  <span className="text-sm font-medium text-gray-600">
                    Step {caseData.statusTimeline.currentStep} of {caseData.statusTimeline.steps.length}
                  </span>
                  <span className="text-sm font-bold text-teal-600">
                    {Math.round(caseData.statusTimeline.progress)}% Complete
                  </span>
                </div>
              </div>

              {/* Timeline Steps */}
              <div className="space-y-4">
                {caseData.statusTimeline.steps.map((step, index) => {
                  const Icon = getTimelineIcon(step.icon);
                  const isCompleted = index < caseData.statusTimeline.currentStep;
                  const isCurrent = index === caseData.statusTimeline.currentStep - 1;
                  
                  return (
                    <div key={step.key} className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                        isCompleted 
                          ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg' 
                          : isCurrent
                          ? 'bg-teal-100 text-teal-700 border-2 border-teal-500'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <Icon className="w-6 h-6" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold mb-1 ${
                          isCompleted || isCurrent ? 'text-navy-900' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </h3>
                        {isCurrent && (
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                            Current Step
                          </Badge>
                        )}
                      </div>
                      {index < caseData.statusTimeline.steps.length - 1 && (
                        <div className={`hidden md:block w-px h-12 -mt-8 ml-6 ${
                          isCompleted ? 'bg-teal-500' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-4 px-2 font-semibold transition-colors relative ${
                    activeTab === 'overview'
                      ? 'text-teal-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Overview
                  {activeTab === 'overview' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`pb-4 px-2 font-semibold transition-colors relative ${
                    activeTab === 'timeline'
                      ? 'text-teal-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Activity Timeline
                  {activeTab === 'timeline' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`pb-4 px-2 font-semibold transition-colors relative ${
                    activeTab === 'documents'
                      ? 'text-teal-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Documents ({caseData.documents.length})
                  {activeTab === 'documents' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Test Information */}
                <Card>
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
                      <FileText className="w-6 h-6 text-teal-600" />
                      Test Information
                    </h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500 font-medium mb-1">Test Type</div>
                        <div className="text-base font-semibold text-navy-900">{caseData.testType.name}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 font-medium mb-1">Category</div>
                        <div className="text-base font-semibold text-navy-900">{caseData.testType.category}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 font-medium mb-1">Purpose</div>
                        <div className="text-base font-semibold text-navy-900">{caseData.purpose || 'Not specified'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 font-medium mb-1">Country</div>
                        <div className="text-base font-semibold text-navy-900">{caseData.country}</div>
                      </div>
                      {caseData.testType.turnaroundDays && (
                        <div>
                          <div className="text-sm text-gray-500 font-medium mb-1">Turnaround Time</div>
                          <div className="text-base font-semibold text-navy-900">{caseData.testType.turnaroundDays} business days</div>
                        </div>
                      )}
                      {caseData.testType.sampleType && (
                        <div>
                          <div className="text-sm text-gray-500 font-medium mb-1">Sample Type</div>
                          <div className="text-base font-semibold text-navy-900">{caseData.testType.sampleType}</div>
                        </div>
                      )}
                    </div>
                    {caseData.testType.description && (
                      <div className="pt-4 border-t border-gray-100">
                        <div className="text-sm text-gray-500 font-medium mb-2">Description</div>
                        <p className="text-sm text-gray-700 leading-relaxed">{caseData.testType.description}</p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Participants */}
                {caseData.participants.length > 0 && (
                  <Card>
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
                        <Users className="w-6 h-6 text-teal-600" />
                        Participants ({caseData.participants.length})
                      </h2>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {caseData.participants.map((participant) => (
                          <div key={participant.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="font-semibold text-navy-900 mb-1">{participant.fullName}</h3>
                                <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-2">
                                  {participant.relationship}
                                </Badge>
                                <div className="space-y-1 text-sm text-gray-600">
                                  {participant.country && (
                                    <div className="flex items-center gap-2">
                                      <MapPin className="w-4 h-4" />
                                      {participant.city}, {participant.country}
                                    </div>
                                  )}
                                  {participant.phone && (
                                    <div className="flex items-center gap-2">
                                      <Phone className="w-4 h-4" />
                                      {participant.phone}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                )}

                {/* Laboratory */}
                {caseData.laboratory && (
                  <Card>
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
                        <Building className="w-6 h-6 text-teal-600" />
                        Laboratory Partner
                      </h2>
                    </div>
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Building className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-navy-900">{caseData.laboratory.name}</h3>
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {caseData.laboratory.city}, {caseData.laboratory.country}
                            </div>
                            {caseData.laboratory.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                {caseData.laboratory.phone}
                              </div>
                            )}
                            {caseData.laboratory.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {caseData.laboratory.email}
                              </div>
                            )}
                            {caseData.laboratory.website && (
                              <a 
                                href={caseData.laboratory.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-teal-600 hover:text-teal-700"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Visit Website
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              {/* Right Column - Quick Info */}
              <div className="space-y-6">
                {/* Next Appointment */}
                {nextAppointment && (
                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-navy-900">Upcoming Appointment</h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Date & Time</div>
                          <div className="text-base font-bold text-navy-900">
                            {new Date(nextAppointment.scheduledDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(nextAppointment.scheduledDate).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                        {nextAppointment.collectionLocation && (
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Location</div>
                            <div className="text-sm font-semibold text-navy-900">
                              {nextAppointment.collectionLocation.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {nextAppointment.collectionLocation.address}
                            </div>
                          </div>
                        )}
                        <Link href={`/dashboard/appointments/${nextAppointment.id}`}>
                          <Button variant="outline" size="sm" className="w-full mt-2">
                            View Details
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Payment Info */}
                {caseData.quotes.length > 0 && (
                  <Card>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-bold text-navy-900">Payment</h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Amount</div>
                          <div className="text-2xl font-bold text-navy-900">
                            {caseData.quotes[0].currency} {Number(caseData.quotes[0].amount).toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Status</div>
                          <Badge className={
                            caseData.payments.length > 0 && caseData.payments[0].status === 'SUCCESSFUL'
                              ? 'bg-green-100 text-green-700 border-green-200'
                              : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                          }>
                            {caseData.payments.length > 0 && caseData.payments[0].status === 'SUCCESSFUL'
                              ? 'Paid'
                              : 'Pending Payment'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Quick Actions */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-navy-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <Link href={`/dashboard/cases/${caseData.id}/documents`}>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Documents
                        </Button>
                      </Link>
                      <Link href="/contact">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Mail className="w-4 h-4 mr-2" />
                          Contact Support
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <Card>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-navy-900">Activity Timeline</h2>
                <p className="text-sm text-gray-600 mt-1">Complete history of all case activities</p>
              </div>
              <div className="p-6">
                {caseData.timeline.length > 0 ? (
                  <div className="space-y-4">
                    {caseData.timeline.map((event, index) => (
                      <div key={event.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-5 h-5 text-teal-600" />
                          </div>
                          {index < caseData.timeline.length - 1 && (
                            <div className="w-px h-full bg-gray-200 flex-1 mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <h3 className="font-semibold text-navy-900 mb-1">{event.event}</h3>
                          {event.description && (
                            <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                          )}
                          <div className="text-xs text-gray-500">
                            {new Date(event.createdAt).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No activity recorded yet</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {activeTab === 'documents' && (
            <Card>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-navy-900">Documents</h2>
                  <Link href={`/dashboard/cases/${caseData.id}/documents`}>
                    <Button variant="primary" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Document
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {caseData.documents.length > 0 ? (
                  <div className="space-y-3">
                    {caseData.documents.map((doc) => (
                      <div key={doc.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-navy-900 truncate">{doc.fileName}</h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>{doc.type}</span>
                                <span>•</span>
                                <span>{(doc.fileSize / 1024).toFixed(0)} KB</span>
                              </div>
                            </div>
                          </div>
                          <Badge className={
                            doc.status === 'VERIFIED'
                              ? 'bg-green-100 text-green-700 border-green-200'
                              : doc.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                              : 'bg-gray-100 text-gray-700 border-gray-200'
                          }>
                            {doc.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">No documents uploaded yet</p>
                    <Link href={`/dashboard/cases/${caseData.id}/documents`}>
                      <Button variant="primary">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Your First Document
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </Card>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
