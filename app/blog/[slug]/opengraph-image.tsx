import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Afrigenomix Article';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  try {
    // Fetch article data
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://afrigenomix.com'}/api/articles/${params.slug}`);
    const data = await response.json();
    
    if (!data.success || !data.data?.article) {
      return new ImageResponse(
        (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(to bottom right, #1e3a8a, #0891b2)',
              color: 'white',
              fontSize: 48,
              fontWeight: 'bold',
            }}
          >
            Afrigenomix
          </div>
        ),
        size
      );
    }

    const article = data.data.article;
    
    // If article has featured image, use it
    if (article.featuredImage) {
      return Response.redirect(article.featuredImage);
    }

    // Generate dynamic OG image
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '60px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                color: 'white',
                fontSize: 32,
                fontWeight: 'bold',
                marginBottom: 40,
              }}
            >
              <span>AFRIGENOMIX</span>
            </div>
            
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                color: 'white',
              }}
            >
              <h1
                style={{
                  fontSize: 64,
                  fontWeight: 'bold',
                  lineHeight: 1.2,
                  marginBottom: 20,
                  maxHeight: '300px',
                  overflow: 'hidden',
                }}
              >
                {article.title}
              </h1>
              
              <p
                style={{
                  fontSize: 28,
                  opacity: 0.9,
                  lineHeight: 1.4,
                  maxHeight: '120px',
                  overflow: 'hidden',
                }}
              >
                {article.excerpt?.slice(0, 150)}...
              </p>
            </div>
            
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: 'white',
                opacity: 0.8,
                fontSize: 24,
              }}
            >
              <span>{article.category?.replace(/_/g, ' ')}</span>
              <span>afrigenomix.com</span>
            </div>
          </div>
        </div>
      ),
      size
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to bottom right, #1e3a8a, #0891b2)',
            color: 'white',
            fontSize: 48,
            fontWeight: 'bold',
          }}
        >
          Afrigenomix
        </div>
      ),
      size
    );
  }
}
