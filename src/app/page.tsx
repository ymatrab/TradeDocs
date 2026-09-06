import { ArrowUpRight, Files } from 'lucide-react';

export default function Home() {
  return (
    <main id="main-content" className="foundation">
      <article>
        <Files size={36} strokeWidth={1.5} aria-hidden="true" />
        <p className="eyebrow" style={{ marginTop: 32 }}>TradeDocs · Engineering foundation</p>
        <h1>One shipment.<br />One connected document set.</h1>
        <p className="muted">The TradeDocs platform is being built from the production specification. This environment is not open for customer use.</p>
        <a href="/api/health" className="button">Check application health <ArrowUpRight size={16} aria-hidden="true" /></a>
      </article>
    </main>
  );
}
