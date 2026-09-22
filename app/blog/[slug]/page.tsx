'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Card, Badge, Button, Spinner } from '@/components/ui';
import { SEO } from '@/components/SEO';
import { MarkdownContent } from '@/components/MarkdownContent';
import { TableOfContents } from '@/components/TableOfContents';
import { ReadingProgress } from '@/components/ReadingProgress';
import { ScrollToTop } from '@/components/ScrollToTop';
import { 
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Eye,
  Share2,
  Mail,
  BookOpen,
  TrendingUp,
  Heart,
  MessageCircle
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
  featuredImage: string | null;
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
  const [copySuccess, setCopySuccess] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

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

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
        setShowShareMenu(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    // TODO: Save to database/local storage
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
    <div className="min-h-screen flex flex-col bg-white">
      <ReadingProgress />
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={`https://afrigenomix.com/blog/${article.slug}`}
        ogImage={article.featuredImage || 'https://afrigenomix.com/og-image.jpg'}
        ogImageWidth="1200"
        ogImageHeight="630"
        ogImageAlt={article.title}
        ogType="article"
        articleData={{
          publishedTime: article.publishedAt,
          author: article.author?.name,
          section: categoryInfo.label,
        }}
        keywords={keywords}
        structuredData={structuredData}
        twitterHandle="@afrigenomix"
      />
      <Header />
      
      <main className="flex-1">
        {/* Hero Image Section */}
        {article.featuredImage && (
          <div className="relative w-full">
            {/* Image Container */}
            <div className="relative w-full h-[50vh] md:h-[60vh] max-h-[500px] bg-navy-900">
              {article.featuredImage.startsWith('data:') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  priority
                  className="object-cover"
                  unoptimized={article.featuredImage.startsWith('data:')}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
              
              {/* Back Button - Top Left */}
              <div className="absolute top-4 left-4 z-10">
                <Link href="/blog">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-white/90 backdrop-blur-sm border-white text-navy-900 hover:bg-white shadow-lg"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Back to Blog</span>
                    <span className="sm:hidden">Back</span>
                  </Button>
                </Link>
              </div>
              
              {/* Category Badge - Bottom Left */}
              <div className="absolute bottom-4 left-4">
                <Badge className="bg-teal-500 text-white border-0 shadow-lg text-sm px-4 py-2">
                  {categoryInfo.label}
                </Badge>
              </div>
            </div>
            
            {/* Title Section - Below Image */}
            <Container className="py-8 md:py-12">
              <div className="max-w-4xl">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 mb-4 leading-tight">
                  {article.title}
                </h1>
                {article.excerpt && (
                  <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                    {article.excerpt}
                  </p>
                )}
              </div>
            </Container>
          </div>
        )}

        {/* Article Content */}
        <Container className="py-8 md:py-12">
          {/* No featured image - show traditional header */}
          {!article.featuredImage && (
            <div className="mb-8">
              <div className="mb-6">
                <Link href="/blog">
                  <Button variant="outline" size="sm" className="group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Blog
                  </Button>
                </Link>
              </div>

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
            </div>
          )}

          <div className="max-w-7xl mx-auto">
            {/* Meta Info Bar */}
            <div className="flex flex-wrap items-center gap-3 md:gap-6 py-6 mb-8 border-y border-gray-200">
              {article.author && (
                <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-teal-500 to-navy-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-navy-900 text-sm md:text-base truncate">{article.author.name}</div>
                    {article.author.title && (
                      <div className="text-xs md:text-sm text-gray-600 truncate">{article.author.title}</div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-600">
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{formatDate(article.publishedAt)}</span>
                  <span className="sm:hidden">{new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                  <span>{article.readTime} min</span>
                </div>
                
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <Eye className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                  <span>{article.viewCount.toLocaleString()}</span>
                </div>
              </div>

              {/* Share Button */}
              <div className="ml-auto relative flex-shrink-0">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors font-semibold text-xs md:text-sm whitespace-nowrap"
                >
                  <Share2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>

                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 z-20 overflow-hidden">
                    <div className="p-2">
                      <button
                        onClick={() => shareArticle('facebook')}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-lg transition-colors text-left group"
                      >
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <Share2 className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-gray-900 group-hover:text-blue-600">Facebook</span>
                      </button>
                      <button
                        onClick={() => shareArticle('twitter')}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-sky-50 rounded-lg transition-colors text-left group"
                      >
                        <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                          <Share2 className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-gray-900 group-hover:text-sky-500">Twitter</span>
                      </button>
                      <button
                        onClick={() => shareArticle('linkedin')}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-lg transition-colors text-left group"
                      >
                        <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                          <Share2 className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-gray-900 group-hover:text-blue-700">LinkedIn</span>
                      </button>
                      <button
                        onClick={() => shareArticle('email')}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors text-left group"
                      >
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                          <Mail className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-gray-900 group-hover:text-gray-600">Email</span>
                      </button>
                      <div className="border-t border-gray-200 my-2"></div>
                      <button
                        onClick={copyLink}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors text-left ${
                          copySuccess ? 'bg-green-50' : ''
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          copySuccess ? 'bg-green-500' : 'bg-gray-400'
                        }`}>
                          <Share2 className="w-4 h-4 text-white" />
                        </div>
                        <span className={`font-medium ${copySuccess ? 'text-green-600' : 'text-gray-900'}`}>
                          {copySuccess ? '✓ Link Copied!' : 'Copy Link'}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Two Column Layout: Content + TOC */}
            <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">
              {/* Main Content */}
              <div>
                {/* Article Content */}
                <article className="prose prose-lg max-w-none mb-8">
                  <MarkdownContent content={article.content} />
                </article>

                {/* Engagement Actions */}
                <Card className="mb-12 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={toggleLike}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                            isLiked
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-300'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-700' : ''}`} />
                          <span>{isLiked ? 'Liked!' : 'Like this article'}</span>
                        </button>

                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-300 transition-all">
                          <MessageCircle className="w-5 h-5" />
                          <span className="hidden sm:inline">Share your thoughts</span>
                          <span className="sm:hidden">Comment</span>
                        </button>
                      </div>

                      <div className="text-sm text-gray-600">
                        Was this helpful?
                      </div>
                    </div>
                  </div>
                </Card>

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
              </div>

              {/* Table of Contents Sidebar */}
              <aside className="hidden lg:block">
                <TableOfContents content={article.content} />
              </aside>
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-16">
                <div className="flex items-center gap-2 mb-8">
                  <TrendingUp className="w-6 h-6 text-teal-600" />
                  <h2 className="text-3xl font-bold text-navy-900">Related Articles</h2>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedArticles.map((related) => (
                    <Link key={related.id} href={`/blog/${related.slug}`}>
                      <Card className="group h-full hover:shadow-2xl transition-all duration-300 border-0 cursor-pointer overflow-hidden">
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden">
                          {related.featuredImage ? (
                            <>
                              {related.featuredImage.startsWith('data:') ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={related.featuredImage}
                                  alt={related.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              ) : (
                                <Image
                                  src={related.featuredImage}
                                  alt={related.title}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </>
                          ) : (
                            <div className="h-full bg-gradient-to-br from-teal-500 via-navy-700 to-navy-900 flex items-center justify-center">
                              <BookOpen className="w-12 h-12 text-white/40" />
                            </div>
                          )}
                          <div className="absolute top-3 right-3">
                            <Badge className={`${CATEGORIES[related.category]?.color || 'bg-gray-100 text-gray-700'} backdrop-blur-sm shadow-lg text-xs`}>
                              {CATEGORIES[related.category]?.label || related.category}
                            </Badge>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <h3 className="text-lg font-bold text-navy-900 mb-2 group-hover:text-teal-600 transition-colors line-clamp-2 leading-tight">
                            {related.title}
                          </h3>
                          
                          <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                            {related.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{formatDate(related.publishedAt)}</span>
                            </div>
                            <span className="text-teal-600 font-semibold group-hover:gap-1.5 flex items-center gap-1 transition-all">
                              Read
                              <ArrowLeft className="w-3.5 h-3.5 rotate-180 group-hover:translate-x-0.5 transition-transform" />
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

      <ScrollToTop />
      <Footer />
    </div>
  );
}
