'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Card, Button, Spinner } from '@/components/ui';
import { ArrowLeft, Save, Eye, Upload, X } from 'lucide-react';

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
    featuredImage: '',
    authorName: '',
    authorTitle: '',
    authorBio: '',
    authorEmail: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'upload'>('upload');

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

  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, featuredImage: url });
    setImagePreview(url);
  };

  const removeImage = () => {
    setFormData({ ...formData, featuredImage: '' });
    setImagePreview(null);
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setIsUploadingImage(true);

    try {
      console.log('Uploading image via server API...');
      
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await response.json();
      console.log('Upload response:', result);

      if (result.success && result.url) {
        setFormData(prev => ({ ...prev, featuredImage: result.url }));
        setImagePreview(result.url);
        console.log(`✅ Image uploaded successfully via ${result.service}:`, result.url);
        
        if (result.warning) {
          alert(`⚠️ ${result.warning}`);
        }
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again or use "🔗 Use URL" option.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
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

      // Auto-generate email if author name provided but email is not
      let finalFormData = { ...formData };
      if (formData.authorName && !formData.authorEmail) {
        // Generate email from name: "Dr Samuel Wumi" -> "dr.samuel.wumi@afrigenomix.com"
        const emailName = formData.authorName
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '.')
          .substring(0, 50);
        finalFormData.authorEmail = `${emailName}@afrigenomix.com`;
      }

      const response = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...finalFormData,
          status,
          publishedAt: status === 'PUBLISHED' ? new Date().toISOString() : null,
        }),
      });

      const result = await response.json();

      console.log('Article creation response:', result); // Debug log

      if (result.success) {
        const articleId = result.data?.article?.id;
        const articleSlug = result.data?.article?.slug;
        console.log('Created article:', { id: articleId, slug: articleSlug }); // Debug log
        
        alert(`Article ${status === 'PUBLISHED' ? 'published' : 'saved as draft'} successfully!\n\nSlug: ${articleSlug}\nView at: /blog/${articleSlug}`);
        router.push('/admin/content?refresh=true');
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

                {/* Featured Image */}
                <Card>
                  <div className="p-6">
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-navy-900 mb-1">
                        Featured Image
                      </label>
                      <p className="text-xs text-gray-500">
                        Add an image that will appear in blog listings and social media shares
                      </p>
                    </div>

                    {/* Toggle between Upload and URL */}
                    <div className="flex gap-2 mb-4">
                      <button
                        type="button"
                        onClick={() => setUploadMethod('upload')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          uploadMethod === 'upload'
                            ? 'bg-teal-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        📤 Upload Image
                      </button>
                      <button
                        type="button"
                        onClick={() => setUploadMethod('url')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          uploadMethod === 'url'
                            ? 'bg-teal-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        🔗 Use URL
                      </button>
                    </div>
                    
                    {imagePreview ? (
                      <div className="relative">
                        <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200">
                          <Image
                            src={imagePreview}
                            alt="Featured image preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : uploadMethod === 'upload' ? (
                      <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-500 transition-colors cursor-pointer"
                      >
                        <input
                          type="file"
                          id="image-upload"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file);
                          }}
                          className="hidden"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                          {isUploadingImage ? (
                            <>
                              <Spinner size="md" className="mx-auto mb-4" />
                              <p className="text-sm text-gray-600">Uploading...</p>
                            </>
                          ) : (
                            <>
                              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                              <p className="text-sm font-semibold text-gray-700 mb-2">
                                Drop image here or click to browse
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, GIF up to 5MB
                              </p>
                            </>
                          )}
                        </label>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-500 transition-colors">
                        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-sm text-gray-600 mb-4">
                          Paste an image URL from Unsplash, Pexels, or your CDN
                        </p>
                      </div>
                    )}
                    
                    {uploadMethod === 'url' && (
                      <>
                        <input
                          type="url"
                          value={formData.featuredImage}
                          onChange={(e) => handleImageUrlChange(e.target.value)}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent mt-4"
                        />
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm font-semibold text-blue-900 mb-1">Free Image Sources:</p>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• <a href="https://unsplash.com" target="_blank" rel="noopener" className="underline hover:text-blue-600">Unsplash.com</a> - High-quality, free photos</li>
                            <li>• <a href="https://pexels.com" target="_blank" rel="noopener" className="underline hover:text-blue-600">Pexels.com</a> - Free stock photos</li>
                            <li>• Right-click image → "Copy image address"</li>
                          </ul>
                        </div>
                      </>
                    )}
                    
                    <p className="text-sm text-gray-600 mt-4">
                      📏 Recommended: 1200x630px for best social sharing results
                    </p>
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
                        Author Email (Optional)
                      </label>
                      <input
                        type="email"
                        value={formData.authorEmail}
                        onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
                        placeholder="Auto-generated from name if left blank"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        Will be auto-generated from author name (e.g., "Dr Samuel Wumi" → "dr.samuel.wumi@afrigenomix.com")
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
