'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Card, Button, Spinner } from '@/components/ui';
import { ArrowLeft, Save, Eye, Trash2, Upload, X } from 'lucide-react';

const CATEGORIES = [
  { value: 'DNA_EDUCATION', label: 'DNA Education' },
  { value: 'PATERNITY_TESTING', label: 'Paternity Testing' },
  { value: 'IMMIGRATION_DNA', label: 'Immigration DNA' },
  { value: 'LEGAL_DNA', label: 'Legal DNA' },
  { value: 'PATERNITY_FRAUD', label: 'Paternity Fraud' },
  { value: 'ADVOCACY', label: 'Advocacy' },
  { value: 'LEGISLATION', label: 'Legislation' },
];

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'upload'>('upload');
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
  });

  useEffect(() => {
    if (params.id) {
      fetchArticle(params.id as string);
    }
  }, [params.id]);

  const fetchArticle = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/admin/articles/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        const article = result.data.article;
        setFormData({
          title: article.title || '',
          slug: article.slug || '',
          excerpt: article.excerpt || '',
          content: article.content || '',
          category: article.category || 'DNA_EDUCATION',
          metaTitle: article.metaTitle || '',
          metaDescription: article.metaDescription || '',
          status: article.status || 'DRAFT',
          isFeatured: article.isFeatured || false,
          featuredImage: article.featuredImage || '',
        });
        setImagePreview(article.featuredImage || null);
      } else {
        alert(result.error || 'Failed to load article');
        router.push('/admin/content');
      }
    } catch (error) {
      console.error('Fetch article error:', error);
      alert('Network error. Please try again.');
      router.push('/admin/content');
    } finally {
      setIsLoading(false);
    }
  };

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
      // Only auto-generate slug if it hasn't been manually changed
      slug: formData.slug === generateSlug(formData.title) || !formData.slug
        ? generateSlug(title)
        : formData.slug,
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

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setIsUploadingImage(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        const uploadFormData = new FormData();
        uploadFormData.append('image', base64String.split(',')[1]);
        
        const response = await fetch('https://api.imgbb.com/1/upload?key=d3c3f6421e6f4d0d5e0c5a8b4e5c3f2a', {
          method: 'POST',
          body: uploadFormData,
        });

        const result = await response.json();

        if (result.success) {
          const imageUrl = result.data.url;
          setFormData(prev => ({ ...prev, featuredImage: imageUrl }));
          setImagePreview(imageUrl);
        } else {
          setFormData(prev => ({ ...prev, featuredImage: base64String }));
          setImagePreview(base64String);
          alert('Image uploaded locally (base64). For best performance, consider using an image URL.');
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try using an image URL instead.');
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

  const handleSubmit = async (e: React.FormEvent, newStatus?: 'DRAFT' | 'PUBLISHED') => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      const status = newStatus || formData.status;

      const response = await fetch(`/api/admin/articles/${params.id}`, {
        method: 'PUT',
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
        alert(`Article ${status === 'PUBLISHED' ? 'published' : 'updated'} successfully!`);
        router.push('/admin/content');
      } else {
        alert(result.error || 'Failed to update article');
      }
    } catch (error) {
      console.error('Update article error:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`/api/admin/articles/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        alert('Article deleted successfully!');
        router.push('/admin/content');
      } else {
        alert(result.error || 'Failed to delete article');
      }
    } catch (error) {
      console.error('Delete article error:', error);
      alert('Network error. Please try again.');
    }
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
                Edit Article
              </h1>
              <p className="text-gray-600 mt-2">
                Make changes to your article
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
                      placeholder="Brief description of the article"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    />
                  </div>
                </Card>

                {/* Featured Image */}
                <Card>
                  <div className="p-6">
                    <label className="block text-sm font-semibold text-navy-900 mb-2">
                      Featured Image
                    </label>

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
                          id="image-upload-edit"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file);
                          }}
                          className="hidden"
                        />
                        <label htmlFor="image-upload-edit" className="cursor-pointer">
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
                            <li>• <a href="https://unsplash.com" target="_blank" rel="noopener" className="underline hover:text-blue-600">Unsplash.com</a></li>
                            <li>• <a href="https://pexels.com" target="_blank" rel="noopener" className="underline hover:text-blue-600">Pexels.com</a></li>
                          </ul>
                        </div>
                      </>
                    )}
                    
                    <p className="text-sm text-gray-600 mt-4">
                      📏 Recommended: 1200x630px for best social sharing
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
                      placeholder="Write your article content in Markdown..."
                      rows={20}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none font-mono text-sm"
                    />
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
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Publishing Actions */}
                <Card className="sticky top-24">
                  <div className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-navy-900">Actions</h3>
                    
                    <div className="space-y-3">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Spinner size="sm" className="mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            {formData.status === 'PUBLISHED' ? (
                              <>
                                <Save className="w-5 h-5 mr-2" />
                                Update Published
                              </>
                            ) : (
                              <>
                                <Eye className="w-5 h-5 mr-2" />
                                Publish Article
                              </>
                            )}
                          </>
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="w-full"
                        onClick={(e: any) => handleSubmit(e, 'DRAFT')}
                        disabled={isSaving}
                      >
                        <Save className="w-5 h-5 mr-2" />
                        Save as Draft
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="w-full text-red-600 border-red-300 hover:bg-red-50"
                        onClick={handleDelete}
                        disabled={isSaving}
                      >
                        <Trash2 className="w-5 h-5 mr-2" />
                        Delete Article
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
                          Display prominently on homepage
                        </span>
                      </span>
                    </label>
                  </div>
                </Card>

                {/* Current Status */}
                <Card className="bg-gray-50">
                  <div className="p-6">
                    <h3 className="text-sm font-bold text-navy-900 mb-3">Current Status</h3>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-semibold ${
                          formData.status === 'PUBLISHED' ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {formData.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Featured:</span>
                        <span className="font-semibold">
                          {formData.isFeatured ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
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
