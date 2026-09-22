'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
import { SEO } from '@/components/SEO';
import { Card, Button, Spinner } from '@/components/ui';
import { Mail, Phone, MapPin, Send, Clock, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <SEO
        title="Contact Afrigenomix - Get in Touch"
        description="Contact Afrigenomix for DNA testing inquiries, partnerships, or advocacy questions. We're here to help you access reliable DNA testing services across Africa."
        canonical="https://afrigenomix.com/contact"
        keywords={[
          'contact afrigenomix',
          'DNA testing inquiry',
          'paternity test contact',
          'DNA test help',
          'African DNA testing support',
        ]}
      />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-teal-900 text-white py-16 md:py-24">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 !text-white">
                Get in Touch
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
                Have questions about DNA testing? We're here to help.
              </p>
            </div>
          </Container>
        </div>

        <Container className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {/* Contact Info Cards */}
              <Card className="p-8 hover:shadow-xl transition-shadow text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">Email Us</h3>
                <a href="mailto:info@afrigenomix.com" className="text-teal-600 hover:text-teal-700">
                  info@afrigenomix.com
                </a>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-shadow text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">Call Us</h3>
                <a href="tel:+2348012345678" className="text-blue-600 hover:text-blue-700">
                  +234 801 234 5678
                </a>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-shadow text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">Business Hours</h3>
                <p className="text-gray-600">Mon-Fri: 9AM - 6PM WAT</p>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold text-navy-900 mb-6">Send Us a Message</h2>
                <Card className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                        placeholder="+234 801 234 5678"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                      >
                        <option value="">Select a subject</option>
                        <option value="dna-testing">DNA Testing Inquiry</option>
                        <option value="paternity">Paternity Testing</option>
                        <option value="immigration">Immigration DNA</option>
                        <option value="legal">Legal DNA Testing</option>
                        <option value="partnership">Partnership Opportunity</option>
                        <option value="advocacy">Advocacy & Legislation</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-none"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    {submitStatus === 'success' && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                        ✓ Thank you! Your message has been sent successfully. We'll get back to you soon.
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                        ✗ Something went wrong. Please try again or email us directly.
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner size="sm" />
                          <span className="ml-2">Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </Card>
              </div>

              {/* Additional Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-navy-900 mb-6">Why Contact Us?</h2>
                  <div className="space-y-4">
                    <Card className="p-6 border-l-4 border-teal-500">
                      <h3 className="text-lg font-bold text-navy-900 mb-2">DNA Testing Questions</h3>
                      <p className="text-gray-600">
                        Get expert guidance on which DNA test is right for your needs, pricing, turnaround times, and sample collection.
                      </p>
                    </Card>

                    <Card className="p-6 border-l-4 border-blue-500">
                      <h3 className="text-lg font-bold text-navy-900 mb-2">Partnership Inquiries</h3>
                      <p className="text-gray-600">
                        Interested in becoming a laboratory or collection partner? We'd love to hear from you.
                      </p>
                    </Card>

                    <Card className="p-6 border-l-4 border-purple-500">
                      <h3 className="text-lg font-bold text-navy-900 mb-2">Advocacy Support</h3>
                      <p className="text-gray-600">
                        Join our campaign for paternity fraud legislation or share your story to help drive change.
                      </p>
                    </Card>

                    <Card className="p-6 border-l-4 border-orange-500">
                      <h3 className="text-lg font-bold text-navy-900 mb-2">Media & Press</h3>
                      <p className="text-gray-600">
                        Media inquiries and interview requests are welcome. Contact our team for quotes and expert opinions.
                      </p>
                    </Card>
                  </div>
                </div>

                <Card className="bg-gradient-to-br from-teal-50 to-blue-50 p-8 border-teal-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-navy-900 mb-2">Quick Response</h3>
                      <p className="text-gray-700">
                        We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
