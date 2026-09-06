import Link from 'next/link';

export default function NotFound() {
  return <main id="main-content" className="foundation"><article><p className="eyebrow">404 · Page not found</p><h1>This page isn’t here.</h1><p className="muted">Check the address or return to TradeDocs.</p><Link className="button" href="/">Return to TradeDocs</Link></article></main>;
}
