import type { Metadata } from "next";
import "./globals.css";
import { CookieConsent } from "@/components/ui";

export const metadata: Metadata = {
  title: "Afrigenomix - DNA Testing Platform for Africa",
  description: "Connect with trusted laboratories for paternity, immigration, prenatal and other DNA and genetic tests in Nigeria and internationally.",
  keywords: ["DNA testing", "paternity test", "immigration DNA", "genetic testing", "Nigeria", "Africa"],
  verification: {
    google: "K9DpmcNH5YnxmqPYLFv9N9CkQzI3RnYBDQAHks2FNOw",
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://afrigenomix.com',
    siteName: 'Afrigenomix',
    title: 'Afrigenomix - DNA Testing Platform for Africa',
    description: 'Connect with trusted laboratories for paternity, immigration, prenatal and other DNA and genetic tests in Nigeria and internationally.',
    images: [
      {
        url: 'https://afrigenomix.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Afrigenomix - DNA Testing Platform for Africa',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@afrigenomix',
    creator: '@afrigenomix',
    title: 'Afrigenomix - DNA Testing Platform for Africa',
    description: 'Connect with trusted laboratories for paternity, immigration, prenatal and other DNA and genetic tests in Nigeria and internationally.',
    images: ['https://afrigenomix.com/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
