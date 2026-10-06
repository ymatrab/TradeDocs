import {
  UNSPLASH_HOME,
  unsplashImage,
  unsplashReferral,
  unsplashSrcSetAt,
  type UnsplashPhoto,
} from '@/lib/content/images';

/** Renditions offered for a photo beside a section's text; it never renders wider than ~620px. */
const SECTION_WIDTHS = [480, 720, 960, 1280] as const;
const FALLBACK_WIDTH = 960;

type SectionPhotoProps = {
  photo: UnsplashPhoto;
  /** Width over height of the crop Unsplash returns. */
  ratio?: number;
  /** The `sizes` hint for the layout the photo sits in. */
  sizes?: string;
  className?: string;
};

/**
 * A credited Unsplash photo that supports a section (D-016). Server component: no script.
 *
 * Always lazy, because the hero's product frame is the only thing above the fold. The
 * width and height attributes reserve the box at the requested ratio, so nothing shifts
 * when it arrives. The entrance motion clips the image only; the credit is text and is
 * never hidden or faded.
 */
export function SectionPhoto({
  photo,
  ratio = 4 / 3,
  sizes = '(min-width: 1180px) 560px, (min-width: 901px) 46vw, calc(100vw - 32px)',
  className,
}: SectionPhotoProps) {
  const height = Math.round(FALLBACK_WIDTH / ratio);
  return (
    <figure className={['section-photo', className].filter(Boolean).join(' ')}>
      <div className="section-photo-frame">
        {/* eslint-disable-next-line @next/next/no-img-element -- Unsplash is hotlinked (D-016) */}
        <img
          src={unsplashImage(photo, { width: FALLBACK_WIDTH, height })}
          srcSet={unsplashSrcSetAt(photo, ratio, SECTION_WIDTHS)}
          sizes={sizes}
          width={FALLBACK_WIDTH}
          height={height}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          style={{ aspectRatio: `${FALLBACK_WIDTH} / ${height}` }}
        />
      </div>
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
