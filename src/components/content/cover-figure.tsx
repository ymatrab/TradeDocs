import {
  UNSPLASH_HOME,
  coverHeight,
  unsplashImage,
  unsplashReferral,
  unsplashSrcSet,
  type UnsplashPhoto,
} from '@/lib/content/images';

/** The cover spans the shell's content column, and the full width less the gutters below it. */
const COVER_SIZES = '(min-width: 1180px) 1132px, calc(100vw - 32px)';
const FALLBACK_WIDTH = 1280;
const FALLBACK_HEIGHT = coverHeight(FALLBACK_WIDTH);

type CoverFigureProps = { photo: UnsplashPhoto; priority?: boolean };

/**
 * A credited Unsplash cover (D-016). Server component: no JavaScript ships with it.
 *
 * The width and height attributes reserve the 2:1 box before the image arrives, so the
 * page does not shift. `priority` is for the one cover at the top of a page; any other
 * use loads lazily.
 */
export function CoverFigure({ photo, priority = false }: CoverFigureProps) {
  return (
    <figure className="cover-figure">
      {/* eslint-disable-next-line @next/next/no-img-element -- Unsplash is hotlinked (D-016) */}
      <img
        src={unsplashImage(photo, { width: FALLBACK_WIDTH, height: FALLBACK_HEIGHT })}
        srcSet={unsplashSrcSet(photo)}
        sizes={COVER_SIZES}
        width={FALLBACK_WIDTH}
        height={FALLBACK_HEIGHT}
        alt={photo.alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
      />
      <figcaption>
        Photo by{' '}
        <a className="text-link" href={unsplashReferral(photo.photographer.profile)}>
          {photo.photographer.name}
        </a>{' '}
        on{' '}
        <a className="text-link" href={unsplashReferral(UNSPLASH_HOME)}>
          Unsplash
        </a>
      </figcaption>
    </figure>
  );
}
