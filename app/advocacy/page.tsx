'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { Card, Badge, Button, Spinner } from '@/components/ui';
import { SEO } from '@/components/SEO';
import { 
  Scale,
  Users,
  Target,
  TrendingUp,
  CheckCircle,
  Clock,
  Share2,
  Heart,
  Megaphone,
  FileText,
  ArrowRight,
  MapPin,
  Calendar,
  AlertCircle,
  ExternalLink,
  Mail
} from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  goal: string;
  targetCountries: string[];
  signatureGoal: number;
  currentSignatures: number;
  status: string;
  launchDate: string;
  targetDate: string;
  milestones: Array<{
    id: string;
    title: string;
    description: string;
    isCompleted: boolean;
    completedAt: string | null;
    order: number;
  }>;
  updates: Array<{
    id: string;
    title: string;
    content: string;
    publishedAt: string;
  }>;
}

export default function AdvocacyPage() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    fetchCampaign();
  }, []);

  const fetchCampaign = async () => {
    try {
      const response = await fetch('/api/advocacy/campaigns/active');
      const result = await response.json();

      if (result.success) {
        setCampaign(result.data);
      } else {
        setError(result.error || 'Failed to load campaign');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Campaign fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignPetition = async () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    // In production, this would submit to the petition API
    alert('Thank you for your support! Petition signing coming soon.');
    setEmail('');
  };

  const shareOnSocial = (platform: string) => {
    const url = window.location.href;
    const title = 'Join the Fight: Criminalize Paternity Fraud in Nigeria';
    const hashtag = 'EndPaternityFraudNG';
    
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}&hashtags=${hashtag}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    
    setShowShareMenu(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateProgress = () => {
    if (!campaign) return 0;
    return Math.min(Math.round((campaign.currentSignatures / campaign.signatureGoal) * 100), 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600">Loading campaign...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-navy-900 mb-2">Campaign Not Available</h2>
              <p className="text-gray-600 mb-6">{error || 'Please try again later'}</p>
              <Button onClick={fetchCampaign} variant="primary">
                Try Again
              </Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const progress = calculateProgress();
  const completedMilestones = campaign.milestones.filter(m => m.isCompleted).length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <SEO
        title={campaign.title}
        description={campaign.description}
        canonical="https://afrigenomix.com/advocacy"
        ogType="website"
        keywords={[
          'paternity fraud',
          'Nigeria legislation',
          'criminalize paternity fraud',
          'DNA advocacy',
          'Africa legislative reform',
          'family law reform',
          'paternity rights',
          'genetic fraud',
        ]}
      />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-red-900 via-red-800 to-orange-900 text-white py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <Container className="relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-6">
                <Scale className="w-5 h-5" />
                <span className="font-semibold">Legislative Advocacy</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 !text-white">
                {campaign.title}
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto">
                {campaign.description}
              </p>

              <div className="flex flex-wrap gap-4 justify-center mb-12">
                <Link href="#sign-petition">
                  <Button size="lg" className="bg-white text-red-900 hover:bg-gray-100 shadow-xl">
                    <Heart className="w-5 h-5 mr-2" />
                    Sign the Petition
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => setShowShareMenu(!showShareMenu)}
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share Campaign
                </Button>
              </div>

              {/* Share Menu */}
              {showShareMenu && (
                <div className="inline-flex gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                  <button
                    onClick={() => shareOnSocial('facebook')}
                    className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                    title="Share on Facebook"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Facebook</span>
                  </button>
                  <button
                    onClick={() => shareOnSocial('twitter')}
                    className="p-3 bg-sky-500 hover:bg-sky-600 rounded-lg transition-colors flex items-center gap-2"
                    title="Share on Twitter"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Twitter</span>
                  </button>
                  <button
                    onClick={() => shareOnSocial('linkedin')}
                    className="p-3 bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors flex items-center gap-2"
                    title="Share on LinkedIn"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm font-medium">LinkedIn</span>
                  </button>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <div className="p-6 text-center">
                    <div className="text-4xl font-bold mb-2">{campaign.currentSignatures.toLocaleString()}</div>
                    <div className="text-sm text-gray-200">Signatures</div>
                  </div>
                </Card>
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <div className="p-6 text-center">
                    <div className="text-4xl font-bold mb-2">{progress}%</div>
                    <div className="text-sm text-gray-200">of Goal</div>
                  </div>
                </Card>
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <div className="p-6 text-center">
                    <div className="text-4xl font-bold mb-2">{completedMilestones}</div>
                    <div className="text-sm text-gray-200">Milestones</div>
                  </div>
                </Card>
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <div className="p-6 text-center">
                    <div className="text-4xl font-bold mb-2">{campaign.targetCountries.length}</div>
                    <div className="text-sm text-gray-200">Countries</div>
                  </div>
                </Card>
              </div>
            </div>
          </Container>
        </div>

        <Container className="py-12 md:py-16">
          {/* Progress Bar */}
          <Card className="mb-12">
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-navy-900">Campaign Progress</h2>
                <Badge className="bg-green-100 text-green-700 border-green-200 text-lg px-4 py-2">
                  {campaign.status}
                </Badge>
              </div>
              
              <div className="relative w-full bg-gray-200 rounded-full h-8 overflow-hidden mb-4">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-1000 flex items-center justify-center text-white font-bold text-sm"
                  style={{ width: `${progress}%` }}
                >
                  {progress}%
                </div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>{campaign.currentSignatures.toLocaleString()} signatures</span>
                <span>Goal: {campaign.signatureGoal.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About the Campaign */}
              <Card>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <Megaphone className="w-6 h-6 text-red-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-navy-900">Why This Matters</h2>
                  </div>
                  
                  <div 
                    className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: campaign.longDescription.replace(/\n/g, '<br />') }}
                  />
                </div>
              </Card>

              {/* Milestones */}
              <Card>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-navy-900">Campaign Milestones</h2>
                      <p className="text-gray-600">{completedMilestones} of {campaign.milestones.length} completed</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {campaign.milestones.sort((a, b) => a.order - b.order).map((milestone, index) => (
                      <div key={milestone.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                            milestone.isCompleted
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}>
                            {milestone.isCompleted ? (
                              <CheckCircle className="w-6 h-6" />
                            ) : (
                              <Clock className="w-6 h-6" />
                            )}
                          </div>
                          {index < campaign.milestones.length - 1 && (
                            <div className={`w-px h-full flex-1 ${
                              milestone.isCompleted ? 'bg-green-500' : 'bg-gray-200'
                            }`} style={{ minHeight: '2rem' }} />
                          )}
                        </div>
                        
                        <div className="flex-1 pb-8">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className={`font-bold text-lg ${
                                milestone.isCompleted ? 'text-navy-900' : 'text-gray-600'
                              }`}>
                                {milestone.title}
                              </h3>
                              <p className="text-gray-600 mt-1">{milestone.description}</p>
                              {milestone.isCompleted && milestone.completedAt && (
                                <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Completed {formatDate(milestone.completedAt)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Campaign Updates */}
              {campaign.updates.length > 0 && (
                <Card>
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                      </div>
                      <h2 className="text-3xl font-bold text-navy-900">Recent Updates</h2>
                    </div>

                    <div className="space-y-6">
                      {campaign.updates.slice(0, 3).map((update) => (
                        <div key={update.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(update.publishedAt)}</span>
                          </div>
                          <h3 className="text-xl font-bold text-navy-900 mb-2">{update.title}</h3>
                          <p className="text-gray-700">{update.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Sign Petition */}
              <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                <div id="sign-petition" className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-navy-900">Sign the Petition</h3>
                  </div>
                  
                  <p className="text-gray-700 mb-6">
                    Add your voice to thousands demanding legislation to criminalize paternity fraud
                  </p>

                  <div className="space-y-4">
                    <input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    
                    <Button 
                      onClick={handleSignPetition}
                      variant="primary" 
                      size="lg" 
                      className="w-full bg-red-600 hover:bg-red-700"
                    >
                      Sign Petition Now
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>

                    <p className="text-xs text-gray-600 text-center">
                      Your email will only be used for campaign updates
                    </p>
                  </div>
                </div>
              </Card>

              {/* Take Action */}
              <Card>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-navy-900 mb-4">How You Can Help</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Share2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-navy-900">Share on Social Media</div>
                        <div className="text-sm text-gray-600">Use #EndPaternityFraudNG</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-navy-900">Contact Your Representatives</div>
                        <div className="text-sm text-gray-600">Write to National Assembly members</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-navy-900">Share Your Story</div>
                        <div className="text-sm text-gray-600">Help others understand the impact</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Megaphone className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-navy-900">Spread Awareness</div>
                        <div className="text-sm text-gray-600">Educate your community</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Target Countries */}
              <Card>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-navy-900 mb-4">Target Countries</h3>
                  <div className="space-y-2">
                    {campaign.targetCountries.map((country) => (
                      <div key={country} className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-4 h-4 text-teal-600" />
                        <span>{country}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Learn More */}
              <Card className="bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-navy-900 mb-4">Learn More</h3>
                  <div className="space-y-3">
                    <Link href="/blog/criminalize-paternity-fraud-nigeria">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Read Full Article
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </Button>
                    </Link>
                    <Link href="/contact">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Mail className="w-4 h-4 mr-2" />
                        Contact Us
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Related Articles */}
          <Card className="bg-gradient-to-br from-navy-900 to-teal-900 text-white">
            <div className="p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-4 !text-white">Understanding Paternity Fraud</h2>
              <p className="text-xl text-gray-200 mb-8">
                Read our comprehensive articles on why this legislation is crucial for Nigerian families
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/blog?category=PATERNITY_FRAUD">
                  <Button size="lg" className="bg-white text-navy-900 hover:bg-gray-100">
                    Read Articles
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/blog?category=ADVOCACY">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    View All Advocacy Content
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
