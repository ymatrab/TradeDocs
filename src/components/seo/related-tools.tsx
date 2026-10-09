import Link from 'next/link';
import { cslApiKey } from '@/lib/screening/config';
import { listedTools } from '@/lib/seo/site';

/**
 * The other free tools, linked from each tool page.
 *
 * Someone working out CBM is usually a step away from chargeable weight, an Incoterm or an
 * invoice, so each tool page points at the rest. Built from the shared tool list so a new
 * tool appears everywhere at once. Uses the existing grid classes; no styles of its own.
 */
export function RelatedTools({ current }: { current: string }) {
  // Screening is linked only where it runs (D-025).
  const others = listedTools(cslApiKey() !== null).filter((tool) => tool.path !== current);
  if (others.length === 0) return null;
  return (
    <section className="section" aria-labelledby="related-tools-title">
      <h2 id="related-tools-title">More free tools</h2>
      <div className="form-grid">
        {others.map((tool) => (
          <Link key={tool.path} href={tool.path} className="form-cell">
            <h3>{tool.name}</h3>
            <p>{tool.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
