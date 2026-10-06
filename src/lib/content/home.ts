import type { UnsplashPhoto } from '@/lib/content/images';

/**
 * The homepage's supporting photos (D-016, extended by the owner's 2026-10-06 ask).
 *
 * The hero stays the product frame; these sit beside sections further down, so a visitor
 * sees where the paperwork goes: a desk, a warehouse, a port, a delivery. Each download was
 * tracked once when it was chosen. Three are the same photos the guides use (their download
 * was tracked then); the warehouse is new to this page.
 */
export const HOME_PHOTOS = {
  desk: {
    id: 'spScdgWY-_c',
    src: 'https://images.unsplash.com/photo-1631651693480-97f1132e333d',
    width: 3576,
    height: 2384,
    alt: 'Paper documents and a pen on a wooden table, the paperwork a shipment starts with',
    caption: 'Papers and a pen on a wooden table',
    photographer: { name: '2H Media', profile: 'https://unsplash.com/@2hmedia' },
    page: 'https://unsplash.com/photos/spScdgWY-_c',
  },
  warehouse: {
    id: 'VnMbc9Szs-E',
    src: 'https://images.unsplash.com/photo-1672552226380-486fe900b322',
    width: 6000,
    height: 4000,
    alt: 'A warehouse aisle with boxes stacked on pallets, waiting to be packed and listed',
    caption: 'A warehouse filled with boxes and pallets',
    photographer: { name: 'Arum Visuals', profile: 'https://unsplash.com/@arumvisuals' },
    page: 'https://unsplash.com/photos/a-warehouse-filled-with-lots-of-boxes-and-pallets-VnMbc9Szs-E',
  },
  port: {
    id: 'b4lmjXJi9e4',
    src: 'https://images.unsplash.com/photo-1782398138711-72c37bce4b38',
    width: 7094,
    height: 4532,
    alt: 'Aerial view of a busy port with stacked shipping containers waiting to be loaded',
    caption: 'Aerial view of a busy port with shipping containers',
    photographer: { name: 'Cosmin Andrei Buzamat', profile: 'https://unsplash.com/@cos592' },
    page: 'https://unsplash.com/photos/b4lmjXJi9e4',
  },
  truck: {
    id: 'crHhZlES310',
    src: 'https://images.unsplash.com/photo-1601467995997-ac1ae9a8fff4',
    width: 5900,
    height: 3933,
    alt: 'White delivery truck parked at a building at the end of a delivered shipment',
    caption: 'White delivery truck parked at a building',
    photographer: { name: 'Maxim Tolchinskiy', profile: 'https://unsplash.com/@shaikhulud' },
    page: 'https://unsplash.com/photos/crHhZlES310',
  },
} satisfies Record<string, UnsplashPhoto>;
