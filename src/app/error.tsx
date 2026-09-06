'use client';

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main-content" className="foundation">
      <article>
        <p className="eyebrow">Something went wrong</p>
        <h1>We couldn’t load this page.</h1>
        <p className="muted">
          Please try again. Contact your workspace administrator if the problem continues.
        </p>
        <button className="btn" onClick={reset}>
          Try again
        </button>
      </article>
    </main>
  );
}
