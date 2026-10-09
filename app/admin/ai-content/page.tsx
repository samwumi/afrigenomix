'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Container } from '@/components/layout/Container';
import { Card, Button, Spinner } from '@/components/ui';
import { Sparkles, FileText, Zap, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';

export default function AIContentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    topic: '',
    category: 'DNA_EDUCATION',
    keywords: '',
    tone: 'professional',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { value: 'DNA_EDUCATION', label: 'DNA Education' },
    { value: 'PATERNITY_TESTING', label: 'Paternity Testing' },
    { value: 'IMMIGRATION_DNA', label: 'Immigration DNA' },
    { value: 'LEGAL_DNA', label: 'Legal DNA' },
    { value: 'ADVOCACY', label: 'Advocacy' },
    { value: 'PATERNITY_FRAUD', label: 'Paternity Fraud' },
    { value: 'LEGISLATION', label: 'Legislation' },
  ];

  const tones = [
    { value: 'professional', label: 'Professional & Informative' },
    { value: 'conversational', label: 'Conversational & Friendly' },
    { value: 'authoritative', label: 'Authoritative & Expert' },
    { value: 'compassionate', label: 'Compassionate & Supportive' },
  ];

  const topicSuggestions = [
    'Understanding DNA Paternity Testing Accuracy',
    'Immigration DNA Testing Requirements for UK Visas',
    'How to Choose a DNA Testing Laboratory in Nigeria',
    'Legal Rights in Paternity Fraud Cases',
    'DNA Testing Process: From Sample to Results',
    'Privacy and Security in Genetic Testing',
    'Cost of DNA Testing in Africa: Complete Guide',
    'What to Expect During DNA Sample Collection',
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/ai/generate-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'Failed to generate article');
      }
    } catch (err) {
      console.error('Generate error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTopicSuggestion = (topic: string) => {
    setFormData(prev => ({ ...prev, topic }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="flex-1 py-8">
        <Container>
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-navy-900">AI Content Generator</h1>
                  <p className="text-gray-600">Generate high-quality blog articles using AI</p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Generator Form */}
              <div className="lg:col-span-2">
                <Card className="p-8">
                  <form onSubmit={handleGenerate} className="space-y-6">
                    <div>
                      <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                        Article Topic *
                      </label>
                      <input
                        type="text"
                        id="topic"
                        name="topic"
                        required
                        value={formData.topic}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., Understanding DNA Paternity Testing in Nigeria"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Be specific for best results. AI will generate a comprehensive article.
                      </p>
                    </div>

                    {/* Topic Suggestions */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Quick Suggestions:</p>
                      <div className="flex flex-wrap gap-2">
                        {topicSuggestions.slice(0, 4).map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => handleTopicSuggestion(suggestion)}
                            className="text-xs px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-2">
                          Writing Tone
                        </label>
                        <select
                          id="tone"
                          name="tone"
                          value={formData.tone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          {tones.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
                        Keywords (optional)
                      </label>
                      <input
                        type="text"
                        id="keywords"
                        name="keywords"
                        value={formData.keywords}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="DNA testing, paternity, Africa, legal"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Comma-separated keywords to include in the article
                      </p>
                    </div>

                    {error && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Generation Failed</p>
                          <p className="text-sm">{error}</p>
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Spinner size="sm" />
                          <span className="ml-2">Generating Article...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Generate Article with AI
                        </>
                      )}
                    </Button>
                  </form>
                </Card>

                {/* Result */}
                {result && (
                  <Card className="mt-8 p-8 bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-navy-900 mb-2">Article Generated Successfully!</h3>
                        <p className="text-gray-700 mb-4">
                          Your article has been created and saved as a <strong>DRAFT</strong>. Review it and publish when ready.
                        </p>

                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                          <div className="bg-white p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Title</p>
                            <p className="font-semibold text-navy-900">{result.article.title}</p>
                          </div>
                          <div className="bg-white p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Category</p>
                            <p className="font-semibold text-navy-900">
                              {categories.find(c => c.value === result.article.category)?.label}
                            </p>
                          </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg mb-6">
                          <p className="text-sm text-gray-600 mb-2">Excerpt</p>
                          <p className="text-gray-700">{result.article.excerpt}</p>
                        </div>

                        {result.usage && (
                          <div className="bg-white p-4 rounded-lg mb-6">
                            <div className="flex items-center gap-2 mb-2">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <p className="text-sm font-medium text-gray-700">Generation Cost</p>
                            </div>
                            <p className="text-2xl font-bold text-green-600">${result.usage.estimatedCost}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              Tokens used: {result.usage.totalTokens.toLocaleString()}
                            </p>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-3">
                          <Button
                            variant="primary"
                            onClick={() => router.push(`/admin/content/${result.article.id}`)}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Review & Edit Article
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setResult(null)}
                          >
                            Generate Another
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              {/* Info Sidebar */}
              <div className="space-y-6">
                <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-6 h-6 text-purple-600" />
                    <h3 className="font-bold text-navy-900">How It Works</h3>
                  </div>
                  <ol className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-purple-600">1.</span>
                      <span>Enter your article topic and preferences</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-purple-600">2.</span>
                      <span>AI generates a complete 1,200-1,500 word article</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-purple-600">3.</span>
                      <span>Article saved as DRAFT for your review</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-purple-600">4.</span>
                      <span>Edit if needed, then publish!</span>
                    </li>
                  </ol>
                </Card>

                <Card className="p-6 bg-blue-50 border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                    <h3 className="font-bold text-navy-900">Cost Per Article</h3>
                  </div>
                  <p className="text-3xl font-bold text-blue-600 mb-2">~$0.01</p>
                  <p className="text-sm text-gray-700">
                    Generate hundreds of articles with your $5 free credit!
                  </p>
                </Card>

                <Card className="p-6">
                  <h3 className="font-bold text-navy-900 mb-3">💡 Tips for Best Results</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Be specific with your topic</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Include target audience in topic (e.g., "for Nigerians")</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Use keywords relevant to your SEO strategy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Always review and add your personal touch</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
