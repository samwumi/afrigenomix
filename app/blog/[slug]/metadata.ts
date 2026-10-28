import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://afrigenomix.com'}/api/articles/${params.slug}`, {
      cache: 'no-store',
    });
    const data = await response.json();

    if (!data.success || !data.data?.article) {
      return {
        title: 'Article Not Found | Afrigenomix',
        description: 'The article you are looking for could not be found.',
      };
    }

    const article = data.data.article;
    const title = article.metaTitle || article.title;
    const description = article.metaDescription || article.excerpt || article.title;
    const imageUrl = article.featuredImage || 'https://afrigenomix.com/og-image.jpg';
    const url = `https://afrigenomix.com/blog/${article.slug}`;

    return {
      title: `${title} | Afrigenomix`,
      description,
      keywords: article.metaKeywords?.split(',') || [],
      authors: article.author ? [{ name: article.author.name }] : [{ name: 'Afrigenomix Editorial Team' }],
      openGraph: {
        title,
        description,
        url,
        siteName: 'Afrigenomix',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: article.title,
          },
        ],
        locale: 'en_US',
        type: 'article',
        publishedTime: article.publishedAt,
        authors: article.author ? [article.author.name] : ['Afrigenomix Editorial Team'],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
        site: '@afrigenomix',
        creator: '@afrigenomix',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Afrigenomix - DNA Testing Platform for Africa',
      description: 'Connect with trusted laboratories for DNA testing in Africa.',
    };
  }
}
