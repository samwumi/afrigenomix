'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Card, Badge, Button, Spinner } from '@/components/ui';
import { 
  Building,
  Plus,
  Search,
  Filter,
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Eye,
  ShieldCheck,
  Users,
  Beaker
} from 'lucide-react';

interface Laboratory {
  id: string;
  name: string;
  country: string;
  city: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  status: string;
  capabilities: string | null;
  description: string | null;
  accreditations: Array<{
    id: string;
    accreditationType: string;
    accreditationBody: string;
    verified: boolean;
  }>;
  _count: {
    cases: number;
    labPartners: number;
  };
  createdAt: string;
}

interface Stats {
  total: number;
  active: number;
  pending: number;
  inactive: number;
}

export default function LaboratoriesPage() {
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchLaboratories();
  }, [statusFilter]);

  const fetchLaboratories = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/admin/laboratories?${params}`);
      const result = await response.json();

      if (result.success) {
        setLaboratories(result.data.laboratories);
        setStats(result.data.stats);
      } else {
        setError(result.error || 'Failed to load laboratories');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Laboratories fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchLaboratories();
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string; icon: any }> = {
      ACTIVE: { label: 'Active', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
      INACTIVE: { label: 'Inactive', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: AlertCircle },
      PENDING_VERIFICATION: { label: 'Pending Verification', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
    };
    return configs[status] || configs.PENDING_VERIFICATION;
  };

  const parseCapabilities = (capabilities: string | null): string[] => {
    if (!capabilities) return [];
    try {
      return JSON.parse(capabilities);
    } catch {
      return [];
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600">Loading laboratories...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="flex-1 py-8 md:py-12">
        <Container>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-navy-900 mb-2">
                Laboratory Network
              </h1>
              <p className="text-gray-600">
                Manage verified laboratory partners
              </p>
            </div>
            <Link href="/admin/laboratories/new">
              <Button size="lg" variant="primary" className="shadow-lg hover:shadow-xl group w-full md:w-auto">
                <Plus className="w-5 h-5 mr-2" />
                Add Laboratory
              </Button>
            </Link>
          </div>

          {/* Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-navy-900 mb-1">{stats.total}</div>
                  <div className="text-sm text-gray-700 font-medium">Total Labs</div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-navy-900 mb-1">{stats.active}</div>
                  <div className="text-sm text-gray-700 font-medium">Active</div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-navy-900 mb-1">{stats.pending}</div>
                  <div className="text-sm text-gray-700 font-medium">Pending</div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-gray-500 rounded-xl flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-navy-900 mb-1">{stats.inactive}</div>
                  <div className="text-sm text-gray-700 font-medium">Inactive</div>
                </div>
              </Card>
            </div>
          )}

          {/* Filters */}
          <Card className="mb-6">
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search laboratories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING_VERIFICATION">Pending</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>

                <Button onClick={handleSearch} variant="primary">
                  Search
                </Button>
              </div>
            </div>
          </Card>

          {/* Laboratories List */}
          <Card>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-navy-900">
                Laboratories ({laboratories.length})
              </h2>
            </div>
            <div className="p-6">
              {laboratories.length > 0 ? (
                <div className="space-y-4">
                  {laboratories.map((lab) => {
                    const statusConfig = getStatusConfig(lab.status);
                    const StatusIcon = statusConfig.icon;
                    const capabilities = parseCapabilities(lab.capabilities);

                    return (
                      <div key={lab.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all group">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                          {/* Lab Info */}
                          <div className="flex-1">
                            <div className="flex items-start gap-4 mb-4">
                              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Building className="w-7 h-7 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                  <h3 className="text-xl font-bold text-navy-900 group-hover:text-teal-600 transition-colors">
                                    {lab.name}
                                  </h3>
                                  <Badge className={statusConfig.color}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {statusConfig.label}
                                  </Badge>
                                  {lab.accreditations.length > 0 && (
                                    <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                                      <ShieldCheck className="w-3 h-3 mr-1" />
                                      {lab.accreditations.length} Accreditation{lab.accreditations.length > 1 ? 's' : ''}
                                    </Badge>
                                  )}
                                </div>

                                <div className="space-y-2 text-sm text-gray-600 mb-4">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{lab.city ? `${lab.city}, ` : ''}{lab.country}</span>
                                  </div>
                                  {lab.phone && (
                                    <div className="flex items-center gap-2">
                                      <Phone className="w-4 h-4" />
                                      <span>{lab.phone}</span>
                                    </div>
                                  )}
                                  {lab.email && (
                                    <div className="flex items-center gap-2">
                                      <Mail className="w-4 h-4" />
                                      <span>{lab.email}</span>
                                    </div>
                                  )}
                                  {lab.website && (
                                    <div className="flex items-center gap-2">
                                      <Globe className="w-4 h-4" />
                                      <a 
                                        href={lab.website} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-teal-600 hover:text-teal-700"
                                      >
                                        {lab.website}
                                      </a>
                                    </div>
                                  )}
                                </div>

                                {/* Capabilities */}
                                {capabilities.length > 0 && (
                                  <div className="mb-4">
                                    <div className="text-xs text-gray-500 font-medium mb-2 uppercase">Capabilities</div>
                                    <div className="flex flex-wrap gap-2">
                                      {capabilities.slice(0, 5).map((cap, index) => (
                                        <Badge key={index} className="bg-white text-blue-700 border-2 border-blue-300">
                                          {cap}
                                        </Badge>
                                      ))}
                                      {capabilities.length > 5 && (
                                        <Badge className="bg-gray-50 text-gray-700 border-gray-200">
                                          +{capabilities.length - 5} more
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Accreditations */}
                                {lab.accreditations.length > 0 && (
                                  <div>
                                    <div className="text-xs text-gray-500 font-medium mb-2 uppercase">Accreditations</div>
                                    <div className="space-y-2">
                                      {lab.accreditations.slice(0, 2).map((accred) => (
                                        <div key={accred.id} className="flex items-center gap-2 text-sm">
                                          <ShieldCheck className={`w-4 h-4 ${accred.verified ? 'text-green-600' : 'text-gray-400'}`} />
                                          <span className="text-gray-700">
                                            {accred.accreditationType} - {accred.accreditationBody}
                                          </span>
                                          {accred.verified && (
                                            <Badge className="bg-green-100 text-green-700 border-green-200">
                                              Verified
                                            </Badge>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Stats & Actions */}
                          <div className="lg:w-64 flex-shrink-0">
                            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                              <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                  <div className="text-2xl font-bold text-navy-900 mb-1">{lab._count.cases}</div>
                                  <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                                    <Beaker className="w-3 h-3" />
                                    Cases
                                  </div>
                                </div>
                                <div>
                                  <div className="text-2xl font-bold text-navy-900 mb-1">{lab._count.labPartners}</div>
                                  <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                                    <Users className="w-3 h-3" />
                                    Partners
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Link href={`/admin/laboratories/${lab.id}`} className="flex-1">
                                <Button variant="outline" size="sm" className="w-full">
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </Button>
                              </Link>
                              <Link href={`/admin/laboratories/${lab.id}/edit`} className="flex-1">
                                <Button variant="outline" size="sm" className="w-full">
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 mb-2">No Laboratories Found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your filters'
                      : 'Get started by adding your first laboratory'
                    }
                  </p>
                  <Link href="/admin/laboratories/new">
                    <Button variant="primary">
                      <Plus className="w-5 h-5 mr-2" />
                      Add Laboratory
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
