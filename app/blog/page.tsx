'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Card, Badge, Button, Spinner } from '@/components/ui';
import { SEO } from '@/components/SEO';
import { 
  Search,
  Calendar,
  User,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Filter,
  X
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: {
    name: string;
    title: string;
    avatar: string | null;
  } | null;
  featuredImage: string | null;
  viewCount: number;
  publishedAt: string;
  readTime: number;
}

const CATEGORIES = [
  { value: 'ALL', label: 'All Articles', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  { value: 'DNA_EDUCATION', label: 'DNA Education', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'PATERNITY_TESTING', label: 'Paternity Testing', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { value: 'IMMIGRATION_DNA', label: 'Immigration DNA', color: 'bg-teal-100 text-teal-700 border-teal-200' },
  { value: 'LEGAL_DNA', label: 'Legal DNA', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { value: 'PATERNITY_FRAUD', label: 'Paternity Fraud', color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'ADVOCACY', label: 'Advocacy', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { value: 'LEGISLATION', label: 'Legislation', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
];

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory, searchQuery]);

  const fetchArticles = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'ALL') {
        params.append('category', selectedCategory);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/articles?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setArticles(result.data.articles);
        setFeaturedArticle(result.data.featured);
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

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const getCategoryColor = (category: string) => {
    const cat = CATEGORIES.find(c => c.value === category);
    return cat?.color || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
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
            <p className="mt-4 text-gray-600">Loading articles...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <SEO
        title="DNA Testing Education & Advocacy Blog"
        description="Expert articles on DNA testing, paternity fraud awareness, immigration DNA, legal testing, and our advocacy for legislative reform across Africa and Nigeria."
        canonical="https://afrigenomix.com/blog"
        keywords={[
          'DNA testing blog',
          'paternity testing Africa',
          'DNA education',
          'paternity fraud Nigeria',
          'immigration DNA testing',
          'legal DNA test',
          'African DNA advocacy',
          'genetic testing information',
        ]}
      />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-teal-900 text-white py-16 md:py-24">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-6">
                <BookOpen className="w-5 h-5" />
                <span className="font-semibold">DNA Education & Advocacy</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 !text-white">
                Knowledge Hub
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                Expert articles on DNA testing, paternity fraud awareness, and our advocacy for legislative reform across Africa
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </Container>
        </div>

        <Container className="py-12 md:py-16">
          {/* Category Filters */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-navy-900">Browse by Category</h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 text-teal-600 font-medium"
              >
                <Filter className="w-5 h-5" />
                {showFilters ? 'Hide' : 'Show'} Filters
              </button>
            </div>

            <div className={`${showFilters ? 'block' : 'hidden'} lg:flex flex-wrap gap-3`}>
              {CATEGORIES.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-6 py-3 rounded-xl border-2 font-medium transition-all ${
                    selectedCategory === category.value
                      ? 'bg-teal-500 text-white border-teal-500 shadow-lg scale-105'
                      : category.color + ' hover:scale-105'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {(selectedCategory !== 'ALL' || searchQuery) && (
              <div className="mt-4 flex items-center gap-3">
                <span className="text-sm text-gray-600">Active filters:</span>
                {selectedCategory !== 'ALL' && (
                  <Badge className="bg-teal-100 text-teal-700 border-teal-200 flex items-center gap-2">
                    {CATEGORIES.find(c => c.value === selectedCategory)?.label}
                    <button onClick={() => setSelectedCategory('ALL')}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {searchQuery && (
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200 flex items-center gap-2">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Featured Article */}
          {featuredArticle && selectedCategory === 'ALL' && !searchQuery && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-teal-600" />
                <h2 className="text-2xl font-bold text-navy-900">Featured Article</h2>
              </div>
              
              <Link href={`/blog/${featuredArticle.slug}`}>
                <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-teal-500 overflow-hidden cursor-pointer">
                  <div className="grid md:grid-cols-2 gap-6">
                    {featuredArticle.featuredImage ? (
                      <div className="relative h-64 md:h-full bg-gradient-to-br from-teal-500 to-navy-900">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="w-20 h-20 text-white/20" />
                        </div>
                      </div>
                    ) : (
                      <div className="relative h-64 md:h-full bg-gradient-to-br from-teal-500 to-navy-900 flex items-center justify-center">
                        <BookOpen className="w-20 h-20 text-white/50" />
                      </div>
                    )}
                    
                    <div className="p-8 flex flex-col justify-center">
                      <Badge className={`${getCategoryColor(featuredArticle.category)} mb-4 w-fit`}>
                        {CATEGORIES.find(c => c.value === featuredArticle.category)?.label}
                      </Badge>
                      
                      <h3 className="text-3xl font-bold text-navy-900 mb-4 group-hover:text-teal-600 transition-colors">
                        {featuredArticle.title}
                      </h3>
                      
                      <p className="text-gray-700 mb-6 line-clamp-3">
                        {featuredArticle.excerpt}
                      </p>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                        {featuredArticle.author && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{featuredArticle.author.name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(featuredArticle.publishedAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          <span>{featuredArticle.readTime} min read</span>
                        </div>
                      </div>
                      
                      <Button variant="primary" className="group-hover:bg-teal-600 w-fit">
                        Read Article
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          )}

          {/* Articles Grid */}
          {error ? (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-600" />
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
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-2">No Articles Found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? `No articles match "${searchQuery}". Try a different search term.`
                  : 'No articles available in this category yet.'}
              </p>
              {(selectedCategory !== 'ALL' || searchQuery) && (
                <Button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSearchQuery('');
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              )}
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-navy-900">
                  {selectedCategory === 'ALL' ? 'Latest Articles' : `${CATEGORIES.find(c => c.value === selectedCategory)?.label} Articles`}
                </h2>
                <span className="text-gray-600">{articles.length} {articles.length === 1 ? 'article' : 'articles'}</span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <Link key={article.id} href={`/blog/${article.slug}`}>
                    <Card className="group h-full hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-teal-500 cursor-pointer flex flex-col">
                      {/* Featured Image */}
                      <div className="relative h-48 bg-gradient-to-br from-teal-500 to-navy-900 flex items-center justify-center overflow-hidden">
                        <BookOpen className="w-16 h-16 text-white/50 group-hover:scale-110 transition-transform" />
                        <div className="absolute top-4 right-4">
                          <Badge className={getCategoryColor(article.category)}>
                            {CATEGORIES.find(c => c.value === article.category)?.label}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-navy-900 mb-3 group-hover:text-teal-600 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        
                        <p className="text-gray-700 mb-4 line-clamp-3 flex-1">
                          {article.excerpt}
                        </p>
                        
                        <div className="space-y-3 pt-4 border-t border-gray-100">
                          {article.author && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <User className="w-4 h-4" />
                              <span className="font-medium">{article.author.name}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(article.publishedAt)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-4 h-4" />
                              <span>{article.readTime} min</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{article.viewCount} views</span>
                            <span className="text-teal-600 font-medium text-sm group-hover:gap-2 flex items-center gap-1 transition-all">
                              Read More
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Newsletter Signup */}
          <Card className="mt-16 bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200">
            <div className="p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-navy-900 mb-4">
                Stay Informed
              </h2>
              <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                Get the latest articles on DNA testing, advocacy updates, and campaign progress delivered to your inbox
              </p>
              <div className="max-w-md mx-auto flex gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <Button variant="primary" size="lg">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-gray-600 mt-4">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </Card>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
