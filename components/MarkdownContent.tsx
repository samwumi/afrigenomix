import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { ArticleCallout } from './ArticleCallout';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

// Helper function to generate heading IDs
const generateId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Parse custom callout syntax
const parseCallouts = (content: string): string => {
  // Convert :::[type] syntax to HTML divs for callouts
  return content.replace(
    /:::(\w+)\s+(.*?)\n([\s\S]*?):::/g,
    (match, type, title, body) => {
      return `<div class="callout" data-type="${type}" data-title="${title}">${body}</div>`;
    }
  );
};

export function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  // Pre-process content for callouts
  const processedContent = parseCallouts(content);

  return (
    <div className={`article-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          // Add IDs to headings for anchor links
          h1: ({ node, children, ...props }) => (
            <h1 id={generateId(String(children))} {...props}>
              {children}
            </h1>
          ),
          h2: ({ node, children, ...props }) => (
            <h2 id={generateId(String(children))} {...props}>
              {children}
            </h2>
          ),
          h3: ({ node, children, ...props }) => (
            <h3 id={generateId(String(children))} {...props}>
              {children}
            </h3>
          ),
          h4: ({ node, children, ...props }) => (
            <h4 id={generateId(String(children))} {...props}>
              {children}
            </h4>
          ),
          h5: ({ node, children, ...props }) => (
            <h5 id={generateId(String(children))} {...props}>
              {children}
            </h5>
          ),
          h6: ({ node, children, ...props }) => (
            <h6 id={generateId(String(children))} {...props}>
              {children}
            </h6>
          ),
          // Custom renderers for links - open external links in new tab
          a: ({ node, ...props }) => (
            <a
              {...props}
              target={props.href?.startsWith('http') ? '_blank' : undefined}
              rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="article-link hover:underline transition-all"
            />
          ),
          // Add custom image handling with lazy loading
          img: ({ node, ...props }) => (
            <img
              {...props}
              loading="lazy"
              alt={props.alt || 'Article image'}
              className="rounded-xl shadow-lg my-6"
            />
          ),
          // Custom callout rendering
          div: ({ node, className, children, ...props }: any) => {
            if (className === 'callout') {
              const type = props['data-type'] || 'info';
              const title = props['data-title'] || '';
              return (
                <ArticleCallout type={type as any} title={title}>
                  {children}
                </ArticleCallout>
              );
            }
            return <div className={className} {...props}>{children}</div>;
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
