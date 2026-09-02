import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://afrigenomix.com';

  // Static pages
  const staticPages = [
    '',
    '/blog',
    '/advocacy',
    '/test-finder',
    '/tests',
    '/login',
    '/register',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Note: In production, you would fetch actual articles from the database
  // For now, we'll create a placeholder structure
  // TODO: Add dynamic article URLs from database
  const dynamicArticles: MetadataRoute.Sitemap = [];

  return [...staticPages, ...dynamicArticles];
}
