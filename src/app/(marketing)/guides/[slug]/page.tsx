import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleView } from '@/components/content/article-view';
import { GuideJsonLd } from '@/components/seo/json-ld';
import { GUIDES, GUIDE_DISCLAIMER, findGuide } from '@/lib/content/guides';
import { unsplashShareImage } from '@/lib/content/images';
import { openGraphFor, twitterFor } from '@/lib/seo/social';

/** The guides this route answers on. Anything else is a 404, not an empty page. */
export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = findGuide(slug);
  if (!guide) return { title: 'Guides' };
  const path = `/guides/${guide.slug}`;
  const image = unsplashShareImage(guide.cover);
  return {
    title: guide.metaTitle,
    description: guide.description,
    alternates: { canonical: path },
    openGraph: openGraphFor(guide.metaTitle, guide.description, path, image),
    twitter: twitterFor(image),
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = findGuide(slug);
  if (!guide) notFound();

  const related = GUIDES.filter((entry) => entry.slug !== guide.slug).map((entry) => ({
    href: `/guides/${entry.slug}`,
    title: entry.title,
    description: entry.description,
  }));

  return (
    <>
      <ArticleView
        article={guide}
        hub={{ href: '/guides', label: 'Guides', allLabel: 'All guides' }}
        disclaimer={GUIDE_DISCLAIMER}
        related={related}
        relatedTitle="More guides"
      />
      <GuideJsonLd slug={guide.slug} />
    </>
  );
}
