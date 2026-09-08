import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main-content" className="foundation">
      <article>
        <p className="eyebrow" style={{ marginBottom: 8 }}>
          404 · Page not found
        </p>
        <h1 style={{ marginBottom: 12 }}>This page isn’t here.</h1>
        <p className="lede" style={{ marginBottom: 24 }}>
          Check the address, or pick up from one of these.
        </p>
        {/* A dead end should offer somewhere to go, not just back. The tools are the one
            destination that works on every deployment, with or without an account. */}
        <div className="cta-row" style={{ marginTop: 0 }}>
          <Link className="btn" href="/">
            Return to TradeDocs
          </Link>
          <Link className="text-link" href="/tools">
            Free trade tools
          </Link>
        </div>
      </article>
    </main>
  );
}
