'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Card, Badge, Button, Spinner } from '@/components/ui';
import { 
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  TrendingUp,
  FileText,
  Calendar,
  User,
  Search,
  Filter,
  BarChart
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  isFeatured: boolean;
  viewCount: number;
  author: {
    name: string;
  } | null;
  publishedAt: string | null;
  createdAt: string;
}

const CATEGORIES = [
  { value: 'ALL', label: 'All Categories' },
  { value: 'DNA_EDUCATION', label: 'DNA Education' },
  { value: 'PATERNITY_TESTING', label: 'Paternity Testing' },
  { value: 'IMMIGRATION_DNA', label: 'Immigration DNA' },
  { value: 'LEGAL_DNA', label: 'Legal DNA' },
  { value: 'PATERNITY_FRAUD', label: 'Paternity Fraud' },
  { value: 'ADVOCACY', label: 'Advocacy' },
  { value: 'LEGISLATION', label: 'Legislation' },
];

const STATUS_FILTERS = [
  { value: 'ALL', label: 'All Status' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ARCHIVED', label: 'Archived' },
];

export default function AdminContentPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    totalViews: 0,
  });

  useEffect(() => {
    fetchArticles();
  }, [categoryFilter, statusFilter, searchQuery]);

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      const params = new URLSearchParams();
      if (categoryFilter !== 'ALL') {
        params.append('category', categoryFilter);
      }
      if (statusFilter !== 'ALL') {
        params.append('status', statusFilter);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/admin/articles?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (result.success) {
        setArticles(result.data.articles);
        setStats(result.data.stats);
      } else {
        setError(result.error || 'Failed to load articles');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Articles fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        fetchArticles();
      } else {
        alert(result.error || 'Failed to delete article');
      }
    } catch (err) {
      alert('Network error. Please try again.');
      console.error('Delete error:', err);
    }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`/api/admin/articles/${id}/featured`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isFeatured: !currentStatus }),
      });

      const result = await response.json();

      if (result.success) {
        fetchArticles();
      } else {
        alert(result.error || 'Failed to update article');
      }
    } catch (err) {
      alert('Network error. Please try again.');
      console.error('Update error:', err);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string }> = {
      PUBLISHED: { label: 'Published', color: 'bg-green-100 text-green-700 border-green-200' },
      DRAFT: { label: 'Draft', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      ARCHIVED: { label: 'Archived', color: 'bg-gray-100 text-gray-700 border-gray-200' },
    };
    return configs[status] || configs.DRAFT;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not published';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600">Loading content...</p>
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
                Content Management
              </h1>
              <p className="text-gray-600">
                Manage your blog articles and advocacy content
              </p>
            </div>
            <Link href="/admin/content/new">
              <Button size="lg" variant="primary" className="shadow-lg hover:shadow-xl group w-full md:w-auto">
                <Plus className="w-5 h-5 mr-2" />
                New Article
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-navy-900 mb-1">{stats.total}</div>
                <div className="text-sm text-gray-700 font-medium">Total Articles</div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-navy-900 mb-1">{stats.published}</div>
                <div className="text-sm text-gray-700 font-medium">Published</div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                    <Edit className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-navy-900 mb-1">{stats.drafts}</div>
                <div className="text-sm text-gray-700 font-medium">Drafts</div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <BarChart className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-navy-900 mb-1">{stats.totalViews.toLocaleString()}</div>
                <div className="text-sm text-gray-700 font-medium">Total Views</div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  {STATUS_FILTERS.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Articles Table */}
          {error ? (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-2">Failed to Load Articles</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={fetchArticles} variant="primary">
                Try Again
              </Button>
            </Card>
          ) : articles.length === 0 ? (
            <Card className="p-12 text-center border-2 border-dashed border-gray-300">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-2">No Articles Found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || categoryFilter !== 'ALL' || statusFilter !== 'ALL'
                  ? 'No articles match your filters. Try adjusting your search.'
                  : 'Get started by creating your first article.'}
              </p>
              <Link href="/admin/content/new">
                <Button variant="primary">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Article
                </Button>
              </Link>
            </Card>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Views
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Published
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {articles.map((article) => {
                      const statusConfig = getStatusConfig(article.status);
                      return (
                        <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {article.isFeatured && (
                                <TrendingUp className="w-5 h-5 text-teal-600 flex-shrink-0" />
                              )}
                              <div>
                                <div className="font-semibold text-navy-900 line-clamp-1">
                                  {article.title}
                                </div>
                                {article.author && (
                                  <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                    <User className="w-3 h-3" />
                                    {article.author.name}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                              {CATEGORIES.find(c => c.value === article.category)?.label || article.category}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={statusConfig.color}>
                              {statusConfig.label}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-gray-700">
                              <Eye className="w-4 h-4" />
                              <span className="font-medium">{article.viewCount}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(article.publishedAt)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => toggleFeatured(article.id, article.isFeatured)}
                                className={`p-2 rounded-lg transition-colors ${
                                  article.isFeatured
                                    ? 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                                title={article.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                              >
                                {article.isFeatured ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                              
                              <Link href={`/admin/content/${article.id}`}>
                                <button className="p-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors">
                                  <Edit className="w-4 h-4" />
                                </button>
                              </Link>
                              
                              {article.status === 'PUBLISHED' && (
                                <Link href={`/blog/${article.slug}`} target="_blank">
                                  <button className="p-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                </Link>
                              )}
                              
                              <button
                                onClick={() => handleDelete(article.id)}
                                className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
