'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AutoContentInfo {
  totalTopics: number;
  availableTopics: number;
  usedTopics: number;
  categoryDistribution: Record<string, number>;
}

export default function AIAutomationPage() {
  const router = useRouter();
  const [info, setInfo] = useState<AutoContentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    count: 3,
    startDate: '',
    frequency: 'weekly',
  });
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    loadInfo();
  }, []);

  const loadInfo = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/ai/auto-content', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setInfo(data.data);
      }
    } catch (error) {
      console.error('Failed to load info:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateContent = async () => {
    if (!confirm(`Generate ${formData.count} articles automatically?\n\nThis will use your OpenAI credits (~$${(formData.count * 0.01).toFixed(2)})`)) {
      return;
    }

    setGenerating(true);
    setResult(null);

    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/ai/auto-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (data.success) {
        setResult(data.data);
        alert(`✅ Success!\n\nGenerated: ${data.data.totalGenerated} articles\nTotal Cost: ${data.data.totalCost}`);
        loadInfo(); // Refresh stats
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate content');
    } finally {
      setGenerating(false);
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🤖 AI Content Automation</h1>
          <p className="mt-2 text-gray-600">Automatically generate and schedule blog articles</p>
        </div>

        {/* Stats */}
        {info && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-blue-600">{info.totalTopics}</div>
              <div className="text-sm text-gray-600 mt-1">Total Topics in Pool</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-green-600">{info.availableTopics}</div>
              <div className="text-sm text-gray-600 mt-1">Available Topics</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-orange-600">{info.usedTopics}</div>
              <div className="text-sm text-gray-600 mt-1">Used Topics (Last 30 Days)</div>
            </div>
          </div>
        )}

        {/* Generation Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Generate Content</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Articles
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.count}
                onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Estimated cost: ${(formData.count * 0.01).toFixed(2)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Publishing Date
              </label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min={new Date().toISOString().slice(0, 16)}
              />
              <p className="text-sm text-gray-500 mt-1">
                Leave blank to start immediately
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publishing Frequency
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly (Every 7 days)</option>
                <option value="biweekly">Bi-weekly (Every 14 days)</option>
              </select>
            </div>

            <button
              onClick={generateContent}
              disabled={generating || formData.count < 1 || (info?.availableTopics || 0) < formData.count}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {generating ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Generating {formData.count} Articles...
                </>
              ) : (
                <>🤖 Generate {formData.count} Articles Automatically</>
              )}
            </button>

            {formData.count > (info?.availableTopics || 0) && (
              <p className="text-sm text-red-600">
                ⚠️ Not enough available topics. Only {info?.availableTopics} topics available.
              </p>
            )}
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">✅ Generation Results</h2>
            
            <div className="mb-4">
              <div className="text-lg">
                <strong>Generated:</strong> {result.totalGenerated} articles
              </div>
              <div className="text-lg">
                <strong>Total Cost:</strong> {result.totalCost}
              </div>
            </div>

            <div className="space-y-3">
              {result.articles.map((article: any, index: number) => (
                <div key={article.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{article.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Slug: /blog/{article.slug}
                      </p>
                      <p className="text-sm text-gray-600">
                        Status: <span className={article.status === 'PUBLISHED' ? 'text-green-600' : 'text-yellow-600'}>
                          {article.status}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        {article.status === 'PUBLISHED' ? 'Published' : 'Scheduled'}: {new Date(article.publishAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {article.cost}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <a
                href="/admin/content"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                → View All Articles
              </a>
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-3">📚 How It Works</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>AI automatically selects topics from a pre-defined pool</li>
            <li>Avoids topics used in the last 30 days (no duplicates)</li>
            <li>Generates full 1,200-1,500 word articles with SEO</li>
            <li>Schedules articles based on your frequency setting</li>
            <li>Articles auto-publish at scheduled times (cron job required)</li>
          </ol>
        </div>

        {/* Topic Categories */}
        {info && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">📊 Topic Categories</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(info.categoryDistribution).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    {category.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm font-bold text-blue-600">{count} topics</span>
                </div>
              ))}
            </div>
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
