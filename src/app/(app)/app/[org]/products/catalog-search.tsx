import Link from 'next/link';
import { Search } from 'lucide-react';
import { Button } from '@/components/primitives/button';
import { Input } from '@/components/primitives/form';

/**
 * A plain GET form. Search belongs in the URL — an operator sharing "the row that is
 * wrong" with a colleague should be able to send the address bar — and a native
 * submission keeps it working before the page's JavaScript has loaded.
 */
export function CatalogSearch({
  org,
  term,
  archived,
}: {
  org: string;
  term: string;
  archived: boolean;
}) {
  return (
    <form
      method="get"
      action={`/app/${org}/products`}
      role="search"
      style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}
    >
      {archived ? <input type="hidden" name="show" value="archived" /> : null}
      <div className="field" style={{ flex: '1 1 240px', margin: 0 }}>
        <label htmlFor="catalog-search">Search the catalog</label>
        <Input
          id="catalog-search"
          name="q"
          type="search"
          defaultValue={term}
          placeholder="Description or product code"
          autoComplete="off"
        />
      </div>
      <Button type="submit" tone="secondary">
        <Search size={16} aria-hidden="true" />
        Search
      </Button>
      {term ? (
        <Link
          className="text-link"
          href={archived ? `/app/${org}/products?show=archived` : `/app/${org}/products`}
          style={{ paddingBottom: 10 }}
        >
          Clear
        </Link>
      ) : null}
    </form>
  );
}
