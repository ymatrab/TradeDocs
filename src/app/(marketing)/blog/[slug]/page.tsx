import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleView } from '@/components/content/article-view';
import { PostJsonLd } from '@/components/seo/json-ld';
import { unsplashShareImage } from '@/lib/content/images';
import { POSTS, POST_DISCLAIMER, findPost } from '@/lib/content/posts';
import { relatedLinks } from '@/lib/content/related';
import { SITE_NAME } from '@/lib/seo/site';
import { twitterFor } from '@/lib/seo/social';

/** The posts this route answers on. Anything else is a 404, not an empty page. */
export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) return { title: 'Blog' };
  const path = `/blog/${post.slug}`;
  const image = unsplashShareImage(post.cover);
  return {
    title: post.metaTitle,
    description: post.description,
    alternates: {
      canonical: path,
      types: { 'application/rss+xml': [{ url: '/blog/rss.xml', title: 'TradeDocs blog' }] },
    },
    // The same fields openGraphFor sets, as an article so the dates are part of the card.
    openGraph: {
      type: 'article',
      siteName: SITE_NAME,
      locale: 'en',
      title: post.metaTitle,
      description: post.description,
      url: path,
      images: [image],
      publishedTime: post.published,
      modifiedTime: post.updated,
    },
    twitter: twitterFor(image),
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) notFound();

  return (
    <>
      <ArticleView
        article={post}
        hub={{ href: '/blog', label: 'Blog', allLabel: 'All posts' }}
        disclaimer={POST_DISCLAIMER}
        related={relatedLinks(post, 'blog')}
        relatedTitle="More from the blog"
      />
      <PostJsonLd slug={post.slug} />
    </>
  );
}
