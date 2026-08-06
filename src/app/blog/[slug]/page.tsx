import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllPosts, getPostBySlug, formatDate } from '@/lib/blog';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: 'Not Found' };
  return {
    title: post.title,
    description: post.description,
  };
}

// MDX components available in blog posts
const components = {
  Theorem: ({ title, children }: { title?: string; children: React.ReactNode }) => (
    <div className="theorem-block">
      {title && <p className="font-display text-sm font-semibold text-theorem mb-2">{title}</p>}
      {children}
    </div>
  ),
  Definition: ({ title, children }: { title?: string; children: React.ReactNode }) => (
    <div className="definition-block">
      {title && <p className="font-display text-sm font-semibold text-accent mb-2">{title}</p>}
      {children}
    </div>
  ),
  Aside: ({ children }: { children: React.ReactNode }) => (
    <aside className="my-6 bg-accent-muted/30 border border-accent/10 rounded-lg p-5 text-sm text-ink-700">
      {children}
    </aside>
  ),
};

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="pt-32 sm:pt-40 pb-24">
      <div className="section-container">
        {/* Post header */}
        <header className="mb-12 max-w-reading">
          <a
            href="/blog"
            className="text-sm text-ink-400 hover:text-accent transition-colors font-mono"
          >
            ← Blog
          </a>
          <h1 className="mt-6 font-display text-display-md sm:text-display-lg text-ink-950 text-balance">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-4">
            <time className="text-sm font-mono text-ink-400">
              {formatDate(post.date)}
            </time>
            {post.tags.length > 0 && (
              <div className="flex gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono text-ink-400 bg-ink-50 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Post content */}
        <div className="prose prose-lg max-w-reading">
          <MDXRemote
            source={post.content}
            components={components}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkMath],
                rehypePlugins: [rehypeKatex as any],
              },
            }}
          />
        </div>
      </div>
    </article>
  );
}
