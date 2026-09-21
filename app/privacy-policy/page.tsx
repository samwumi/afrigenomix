import { Container } from '@/components/layout/Container';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'Privacy Policy | Afrigenomix',
  description: 'Learn how Afrigenomix collects, uses, and protects your personal information and data.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <Container>
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 md:p-12">
            <h1 className="text-4xl font-bold text-navy-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600 mb-8">Last updated: September 21, 2026</p>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-navy-900 mb-4">Introduction</h2>
                <p className="text-gray-700 mb-4">
                  Afrigenomix (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
                  you visit our website afrigenomix.com.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-navy-900 mb-4">Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-navy-800 mb-3 mt-6">Personal Information</h3>
                <p className="text-gray-700 mb-3">
                  We may collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                  <li>Register for an account</li>
                  <li>Book a DNA testing appointment</li>
                  <li>Contact us via email or contact forms</li>
                  <li>Subscribe to our newsletter</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  This information may include: name, email address, phone number, location, and any other 
                  information you choose to provide.
                </p>

                <h3 className="text-xl font-semibold text-navy-800 mb-3 mt-6">Automatically Collected Information</h3>
                <p className="text-gray-700 mb-3">
                  When you visit our website, we automatically collect certain information about your device, including:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                  <li>Browser type and version</li>
                  <li>IP address</li>
                  <li>Pages visited and time spent on pages</li>
                  <li>Referring website</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-navy-900 mb-4">How We Use Your Information</h2>
                <p className="text-gray-700 mb-3">We use the information we collect to:</p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                  <li>Process and manage your DNA testing appointments</li>
                  <li>Send you important updates about our services</li>
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Improve our website and services</li>
                  <li>Send promotional communications (with your consent)</li>
                  <li>Detect and prevent fraud or abuse</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-navy-900 mb-4">Cookies and Tracking Technologies</h2>
                <p className="text-gray-700 mb-4">
                  We use cookies and similar tracking technologies to enhance your browsing experience. 
                  Cookies are small data files stored on your device. We use cookies to:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                  <li>Remember your preferences and settings</li>
                  <li>Track article views (to prevent counting duplicate views)</li>
                  <li>Analyze website traffic and user behavior</li>
                  <li>Improve our website functionality</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  You can control cookies through your browser settings. However, disabling cookies may 
                  limit your ability to use certain features of our website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-navy-900 mb-4">Data Security</h2>
                <p className="text-gray-700 mb-4">
                  We implement appropriate technical and organizational security measures to protect your 
                  personal information from unauthorized access, disclosure, alteration, or destruction. 
                  However, no method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-navy-900 mb-4">Third-Party Disclosure</h2>
                <p className="text-gray-700 mb-4">
                  We do not sell, trade, or transfer your personal information to third parties without 
                  your consent, except:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                  <li>To trusted partner laboratories for DNA testing services</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and safety</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-navy-900 mb-4">Your Rights</h2>
                <p className="text-gray-700 mb-3">You have the right to:</p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-navy-900 mb-4">Children&apos;s Privacy</h2>
                <p className="text-gray-700 mb-4">
                  Our services are not directed to individuals under the age of 18. We do not knowingly 
                  collect personal information from children under 18. If we become aware that we have 
                  collected such information, we will take steps to delete it.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-navy-900 mb-4">Changes to This Privacy Policy</h2>
                <p className="text-gray-700 mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any changes 
                  by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-navy-900 mb-4">Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 mb-2">
                    <strong>Email:</strong> privacy@afrigenomix.com
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Website:</strong> afrigenomix.com
                  </p>
                  <p className="text-gray-700">
                    <strong>Address:</strong> Lagos, Nigeria
                  </p>
                </div>
              </section>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
