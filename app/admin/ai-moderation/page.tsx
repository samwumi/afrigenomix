'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Comment {
  id: string;
  content: string;
  name: string;
  email: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SPAM';
  createdAt: string;
  article: {
    title: string;
    slug: string;
  };
}

interface Article {
  id: string;
  title: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED';
  scheduledPublishAt: string | null;
  author: {
    name: string;
  };
  createdAt: string;
}

export default function AIModerationPage() {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'comments' | 'articles'>('comments');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Load pending comments
      const commentsRes = await fetch('/api/admin/comments?status=PENDING', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (commentsRes.ok) {
        const data = await commentsRes.json();
        setComments(data.data?.comments || []);
      }

      // Load scheduled articles
      const articlesRes = await fetch('/api/ai/schedule-publish', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (articlesRes.ok) {
        const data = await articlesRes.json();
        setArticles(data.data?.scheduled || []);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const moderateComment = async (commentId: string, action: 'approve' | 'reject' | 'spam') => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: action === 'approve' ? 'APPROVED' : action === 'reject' ? 'REJECTED' : 'SPAM',
        }),
      });

      if (res.ok) {
        setComments(comments.filter(c => c.id !== commentId));
      } else {
        alert('Failed to moderate comment');
      }
    } catch (error) {
      console.error('Moderation error:', error);
      alert('Failed to moderate comment');
    }
  };

  const publishNow = async (articleId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/articles/${articleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: 'PUBLISHED',
          publishedAt: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setArticles(articles.filter(a => a.id !== articleId));
      } else {
        alert('Failed to publish article');
      }
    } catch (error) {
      console.error('Publish error:', error);
      alert('Failed to publish article');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Moderation Dashboard</h1>
          <p className="mt-2 text-gray-600">Review AI-moderated comments and scheduled articles</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('comments')}
              className={`${
                activeTab === 'comments'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Pending Comments ({comments.length})
            </button>
            <button
              onClick={() => setActiveTab('articles')}
              className={`${
                activeTab === 'articles'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Scheduled Articles ({articles.length})
            </button>
          </nav>
        </div>

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                No pending comments to review
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{comment.name}</h3>
                      <p className="text-sm text-gray-500">{comment.email}</p>
                      <p className="text-sm text-gray-500">
                        On: <a href={`/blog/${comment.article.slug}`} className="text-blue-600 hover:underline">{comment.article.title}</a>
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{comment.content}</p>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => moderateComment(comment.id, 'approve')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => moderateComment(comment.id, 'reject')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => moderateComment(comment.id, 'spam')}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                    >
                      Mark as Spam
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div className="space-y-4">
            {articles.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                No scheduled articles
              </div>
            ) : (
              articles.map((article) => (
                <div key={article.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{article.title}</h3>
                      <p className="text-sm text-gray-500">By {article.author.name}</p>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(article.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                      {article.status}
                    </span>
                  </div>
                  
                  {article.scheduledPublishAt && (
                    <p className="text-sm text-gray-600 mb-4">
                      📅 Scheduled for: <strong>{new Date(article.scheduledPublishAt).toLocaleString()}</strong>
                    </p>
                  )}
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => publishNow(article.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Publish Now
                    </button>
                    <a
                      href={`/admin/content/${article.id}`}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                    >
                      Edit
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8">
          <a
            href="/admin"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            ← Back to Admin Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
