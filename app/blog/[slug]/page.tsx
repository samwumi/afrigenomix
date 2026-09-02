'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Card, Badge, Button, Spinner } from '@/components/ui';
import { SEO } from '@/components/SEO';
import { 
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Eye,
  Share2,
  Mail,
  BookOpen,
  TrendingUp
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  author: {
    name: string;
    title: string;
    bio: string;
    avatar: string | null;
  } | null;
  featuredImage: string | null;
  viewCount: number;
  publishedAt: string;
  readTime: number;
  metaTitle: string | null;
  metaDescription: string | null;
}

interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  publishedAt: string;
}

const CATEGORIES: Record<string, { label: string; color: string }> = {
  DNA_EDUCATION: { label: 'DNA Education', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  PATERNITY_TESTING: { label: 'Paternity Testing', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  IMMIGRATION_DNA: { label: 'Immigration DNA', color: 'bg-teal-100 text-teal-700 border-teal-200' },
  LEGAL_DNA: { label: 'Legal DNA', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  PATERNITY_FRAUD: { label: 'Paternity Fraud', color: 'bg-red-100 text-red-700 border-red-200' },
  ADVOCACY: { label: 'Advocacy', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  LEGISLATION: { label: 'Legislation', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
};

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    if (params.slug) {
      fetchArticle(params.slug as string);
    }
  }, [params.slug]);

  const fetchArticle = async (slug: string) => {
    try {
      const response = await fetch(`/api/articles/${slug}`);
      const result = await response.json();

      if (result.success) {
        setArticle(result.data.article);
        setRelatedArticles(result.data.related);
      } else {
        setError(result.error || 'Article not found');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Article fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const shareArticle = (platform: string) => {
    const url = window.location.href;
    const title = article?.title || '';
    
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    
    setShowShareMenu(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600">Loading article...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-navy-900 mb-2">Article Not Found</h2>
              <p className="text-gray-600 mb-6">{error || 'The article you\'re looking for doesn\'t exist'}</p>
              <Button onClick={() => router.push('/blog')} variant="primary">
                Back to Blog
              </Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryInfo = CATEGORIES[article.category] || { label: article.category, color: 'bg-gray-100 text-gray-700 border-gray-200' };

  // Prepare SEO data
  const seoTitle = article.metaTitle || article.title;
  const seoDescription = article.metaDescription || article.excerpt || `Read ${article.title} on Afrigenomix`;
  const keywords = [
    'DNA testing',
    'Africa',
    'Nigeria',
    categoryInfo.label.toLowerCase(),
    ...(article.category === 'PATERNITY_FRAUD' ? ['paternity fraud', 'legislation'] : []),
    ...(article.category === 'IMMIGRATION_DNA' ? ['immigration DNA', 'visa DNA test'] : []),
  ];

  // Structured data for article
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || article.title,
    image: article.featuredImage || 'https://afrigenomix.com/og-image.jpg',
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: article.author ? {
      '@type': 'Person',
      name: article.author.name,
      jobTitle: article.author.title,
    } : {
      '@type': 'Organization',
      name: 'Afrigenomix',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Afrigenomix',
      logo: {
        '@type': 'ImageObject',
        url: 'https://afrigenomix.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://afrigenomix.com/blog/${article.slug}`,
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={`https://afrigenomix.com/blog/${article.slug}`}
        ogImage={article.featuredImage || undefined}
        ogType="article"
        articleData={{
          publishedTime: article.publishedAt,
          author: article.author?.name,
          section: categoryInfo.label,
        }}
        keywords={keywords}
        structuredData={structuredData}
      />
      <Header />
      
      <main className="flex-1 py-8 md:py-12">
        <Container>
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/blog">
              <Button variant="outline" size="sm" className="group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Blog
              </Button>
            </Link>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Article Header */}
            <div className="mb-8">
              <Badge className={`${categoryInfo.color} mb-4`}>
                {categoryInfo.label}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-6">
                {article.title}
              </h1>

              {article.excerpt && (
                <p className="text-xl text-gray-700 mb-6">
                  {article.excerpt}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 pb-6 border-b border-gray-200">
                {article.author && (
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <div>
                      <div className="font-semibold text-navy-900">{article.author.name}</div>
                      {article.author.title && (
                        <div className="text-sm">{article.author.title}</div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{article.readTime} min read</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  <span>{article.viewCount} views</span>
                </div>

                {/* Share Button */}
                <div className="ml-auto relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors font-medium"
                  >
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>

                  {showShareMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border-2 border-gray-100 z-10">
                      <div className="p-2">
                        <button
                          onClick={() => shareArticle('facebook')}
                          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                          <Share2 className="w-5 h-5 text-blue-600" />
                          <span>Facebook</span>
                        </button>
                        <button
                          onClick={() => shareArticle('twitter')}
                          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                          <Share2 className="w-5 h-5 text-sky-500" />
                          <span>Twitter</span>
                        </button>
                        <button
                          onClick={() => shareArticle('linkedin')}
                          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                          <Share2 className="w-5 h-5 text-blue-700" />
                          <span>LinkedIn</span>
                        </button>
                        <button
                          onClick={() => shareArticle('email')}
                          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                          <Mail className="w-5 h-5 text-gray-600" />
                          <span>Email</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Article Content */}
            <article className="prose prose-lg max-w-none mb-12">
              <div 
                className="article-content text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }}
              />
            </article>

            {/* Author Bio */}
            {article.author && article.author.bio && (
              <Card className="mb-12 bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200">
                <div className="p-8">
                  <h3 className="text-xl font-bold text-navy-900 mb-4">About the Author</h3>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-navy-900 text-lg">{article.author.name}</div>
                      {article.author.title && (
                        <div className="text-teal-700 font-medium mb-2">{article.author.title}</div>
                      )}
                      <p className="text-gray-700">{article.author.bio}</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Call to Action */}
            <Card className="mb-12 bg-gradient-to-br from-navy-900 to-teal-900 text-white">
              <div className="p-8 md:p-12 text-center">
                <h3 className="text-3xl font-bold mb-4 !text-white">
                  Need DNA Testing Services?
                </h3>
                <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                  Get expert guidance and access to trusted laboratories for paternity, immigration, and legal DNA testing
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link href="/test-finder">
                    <Button size="lg" className="bg-white text-navy-900 hover:bg-gray-100">
                      Find Your Test
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      Contact a Specialist
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-6 h-6 text-teal-600" />
                  <h2 className="text-2xl font-bold text-navy-900">Related Articles</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedArticles.map((related) => (
                    <Link key={related.id} href={`/blog/${related.slug}`}>
                      <Card className="group h-full hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-teal-500 cursor-pointer">
                        <div className="p-6">
                          <Badge className={`${CATEGORIES[related.category]?.color || 'bg-gray-100 text-gray-700'} mb-3`}>
                            {CATEGORIES[related.category]?.label || related.category}
                          </Badge>
                          
                          <h3 className="text-xl font-bold text-navy-900 mb-3 group-hover:text-teal-600 transition-colors line-clamp-2">
                            {related.title}
                          </h3>
                          
                          <p className="text-gray-700 line-clamp-2 mb-4">
                            {related.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(related.publishedAt)}</span>
                            </div>
                            <span className="text-teal-600 font-medium group-hover:gap-2 flex items-center gap-1 transition-all">
                              Read More
                              <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
