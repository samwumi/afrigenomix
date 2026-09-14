'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Card, Button, Spinner } from '@/components/ui';
import { ArrowLeft, Save, Eye } from 'lucide-react';

const CATEGORIES = [
  { value: 'DNA_EDUCATION', label: 'DNA Education' },
  { value: 'PATERNITY_TESTING', label: 'Paternity Testing' },
  { value: 'IMMIGRATION_DNA', label: 'Immigration DNA' },
  { value: 'LEGAL_DNA', label: 'Legal DNA' },
  { value: 'PATERNITY_FRAUD', label: 'Paternity Fraud' },
  { value: 'ADVOCACY', label: 'Advocacy' },
  { value: 'LEGISLATION', label: 'Legislation' },
];

export default function NewArticlePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'DNA_EDUCATION',
    metaTitle: '',
    metaDescription: '',
    status: 'DRAFT',
    isFeatured: false,
    authorName: '',
    authorTitle: '',
    authorBio: '',
    authorEmail: '',
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleSubmit = async (e: React.FormEvent, status: 'DRAFT' | 'PUBLISHED') => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          status,
          publishedAt: status === 'PUBLISHED' ? new Date().toISOString() : null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`Article ${status === 'PUBLISHED' ? 'published' : 'saved as draft'} successfully!`);
        router.push('/admin/content');
      } else {
        alert(result.error || 'Failed to create article');
      }
    } catch (error) {
      console.error('Create article error:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="flex-1 py-8 md:py-12">
        <Container>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link href="/admin/content">
                <Button variant="outline" size="sm" className="mb-4 group">
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Back to Content
                </Button>
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-navy-900">
                Create New Article
              </h1>
              <p className="text-gray-600 mt-2">
                Write your article using Markdown formatting
              </p>
            </div>
          </div>

          <form onSubmit={(e) => handleSubmit(e, 'PUBLISHED')}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title */}
                <Card>
                  <div className="p-6">
                    <label className="block text-sm font-semibold text-navy-900 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Enter article title..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg font-semibold"
                    />
                  </div>
                </Card>

                {/* Slug */}
                <Card>
                  <div className="p-6">
                    <label className="block text-sm font-semibold text-navy-900 mb-2">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="article-url-slug"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono text-sm"
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      Preview: <span className="font-mono text-teal-600">afrigenomix.com/blog/{formData.slug || 'article-slug'}</span>
                    </p>
                  </div>
                </Card>

                {/* Excerpt */}
                <Card>
                  <div className="p-6">
                    <label className="block text-sm font-semibold text-navy-900 mb-2">
                      Excerpt
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Brief description of the article (shown in article listings)"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    />
                  </div>
                </Card>

                {/* Content */}
                <Card>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-navy-900">
                        Content * (Markdown)
                      </label>
                      <a
                        href="https://www.markdownguide.org/basic-syntax/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                      >
                        Markdown Guide
                      </a>
                    </div>
                    <textarea
                      required
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="# Article Title

Write your article content here using Markdown...

## Section Heading

- Bullet points
- **Bold text**
- *Italic text*
- [Links](https://example.com)

```code
Code blocks
```

> Blockquotes

And much more!"
                      rows={20}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none font-mono text-sm"
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      Supports GitHub Flavored Markdown with tables, task lists, and code blocks
                    </p>
                  </div>
                </Card>

                {/* SEO Settings */}
                <Card>
                  <div className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-navy-900">SEO Settings</h3>
                    
                    <div>
                      <label className="block text-sm font-semibold text-navy-900 mb-2">
                        Meta Title
                      </label>
                      <input
                        type="text"
                        value={formData.metaTitle}
                        onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                        placeholder="SEO title (defaults to article title)"
                        maxLength={60}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        {formData.metaTitle.length}/60 characters
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-navy-900 mb-2">
                        Meta Description
                      </label>
                      <textarea
                        value={formData.metaDescription}
                        onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                        placeholder="SEO description (defaults to excerpt)"
                        maxLength={160}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        {formData.metaDescription.length}/160 characters
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Author Information */}
                <Card>
                  <div className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-navy-900">Author Information</h3>
                    
                    <div>
                      <label className="block text-sm font-semibold text-navy-900 mb-2">
                        Author Name
                      </label>
                      <input
                        type="text"
                        value={formData.authorName}
                        onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                        placeholder="e.g., Dr. Samuel Wumi"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        Leave blank to use default author
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-navy-900 mb-2">
                        Author Title/Role
                      </label>
                      <input
                        type="text"
                        value={formData.authorTitle}
                        onChange={(e) => setFormData({ ...formData, authorTitle: e.target.value })}
                        placeholder="e.g., Chief Genetics Counselor"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-navy-900 mb-2">
                        Author Bio
                      </label>
                      <textarea
                        value={formData.authorBio}
                        onChange={(e) => setFormData({ ...formData, authorBio: e.target.value })}
                        placeholder="Brief bio about the author..."
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-navy-900 mb-2">
                        Author Email
                      </label>
                      <input
                        type="email"
                        value={formData.authorEmail}
                        onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
                        placeholder="author@afrigenomix.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        For internal use only
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Publishing Actions */}
                <Card className="sticky top-24">
                  <div className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-navy-900">Publish</h3>
                    
                    <div className="space-y-3">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Spinner size="sm" className="mr-2" />
                            Publishing...
                          </>
                        ) : (
                          <>
                            <Eye className="w-5 h-5 mr-2" />
                            Publish Article
                          </>
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="w-full"
                        onClick={(e: any) => handleSubmit(e, 'DRAFT')}
                        disabled={isLoading}
                      >
                        <Save className="w-5 h-5 mr-2" />
                        Save as Draft
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Category */}
                <Card>
                  <div className="p-6">
                    <label className="block text-sm font-semibold text-navy-900 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </Card>

                {/* Featured */}
                <Card>
                  <div className="p-6">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                      />
                      <span className="ml-3">
                        <span className="text-sm font-semibold text-navy-900 block">
                          Featured Article
                        </span>
                        <span className="text-sm text-gray-600">
                          Display prominently on blog homepage
                        </span>
                      </span>
                    </label>
                  </div>
                </Card>

                {/* Help */}
                <Card className="bg-teal-50 border-teal-200">
                  <div className="p-6">
                    <h3 className="text-sm font-bold text-navy-900 mb-2">Markdown Tips</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• # H1, ## H2, ### H3 for headings</li>
                      <li>• **bold** for bold text</li>
                      <li>• *italic* for italic text</li>
                      <li>• [text](url) for links</li>
                      <li>• ![alt](url) for images</li>
                      <li>• ``` for code blocks</li>
                      <li>• &gt; for blockquotes</li>
                      <li>• - or * for bullet lists</li>
                      <li>• 1. for numbered lists</li>
                      <li>• | for tables</li>
                    </ul>
                  </div>
                </Card>
              </div>
            </div>
          </form>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
