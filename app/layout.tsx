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
