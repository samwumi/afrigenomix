import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  articleData?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  keywords?: string[];
  noindex?: boolean;
  structuredData?: Record<string, any>;
}

export function SEO({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  articleData,
  keywords = [],
  noindex = false,
  structuredData,
}: SEOProps) {
  const siteName = 'Afrigenomix';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const defaultOgImage = ogImage || '/og-image.jpg';
  const url = canonical || (typeof window !== 'undefined' ? window.location.href : '');

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    if (keywords.length > 0) {
      updateMetaTag('keywords', keywords.join(', '));
    }
    if (noindex) {
      updateMetaTag('robots', 'noindex, nofollow');
    }

    // Open Graph tags
    updateMetaTag('og:type', ogType, true);
    updateMetaTag('og:site_name', siteName, true);
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', defaultOgImage, true);
    if (url) {
      updateMetaTag('og:url', url, true);
    }

    // Article specific tags
    if (ogType === 'article' && articleData) {
      if (articleData.publishedTime) {
        updateMetaTag('article:published_time', articleData.publishedTime, true);
      }
      if (articleData.modifiedTime) {
        updateMetaTag('article:modified_time', articleData.modifiedTime, true);
      }
      if (articleData.author) {
        updateMetaTag('article:author', articleData.author, true);
      }
      if (articleData.section) {
        updateMetaTag('article:section', articleData.section, true);
      }
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', defaultOgImage);

    // Canonical link
    if (canonical) {
      let linkElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.setAttribute('rel', 'canonical');
        document.head.appendChild(linkElement);
      }
      linkElement.setAttribute('href', canonical);
    }

    // Add structured data (JSON-LD)
    if (structuredData) {
      let scriptElement = document.querySelector('script[type="application/ld+json"]');
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(structuredData);
    }
  }, [fullTitle, description, canonical, ogImage, ogType, articleData, keywords, noindex, url, defaultOgImage, siteName, structuredData]);

  return null;
}
