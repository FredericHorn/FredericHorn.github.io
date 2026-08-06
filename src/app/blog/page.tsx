import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { getAllPosts, formatDate } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Mathematical essays, research thoughts, and explorations.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <PageHeader
        title="Blog"
        subtitle="Essays on mathematical ideas and hobby projects."
        ornament="¶"
      />

      <div className="section-container pb-24">
        {posts.length === 0 ? (
          <AnimatedSection>
            <div className="max-w-reading">
              <p className="text-ink-500 italic">
                Posts are on their way. Check back soon.
              </p>
            </div>
          </AnimatedSection>
        ) : (
          <div className="max-w-wide space-y-1">
            {posts.map((post, i) => (
              <AnimatedSection key={post.slug} delay={i * 0.05}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block py-6 border-b border-ink-100/60 hover:bg-white/30 -mx-4 px-4 rounded-lg transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
                    <time className="text-sm font-mono text-ink-400 shrink-0">
                      {formatDate(post.date)}
                    </time>
                    <div>
                      <h2 className="font-display text-xl text-ink-900 group-hover:text-accent transition-colors">
                        {post.title}
                      </h2>
                      {post.description && (
                        <p className="mt-1 text-sm text-ink-500 leading-relaxed">
                          {post.description}
                        </p>
                      )}
                      {post.tags.length > 0 && (
                        <div className="mt-2 flex gap-2">
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
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
