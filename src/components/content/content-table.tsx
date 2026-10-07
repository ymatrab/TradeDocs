import { DataTable } from '@/components/primitives/table';
import type { ArticleTable } from '@/lib/content/article';

/** A content table: the first cell of each row is its header, as in the guides. */
export function ContentTable({ table }: { table: ArticleTable }) {
  return (
    <DataTable caption={table.caption}>
      <thead>
        <tr>
          {table.head.map((cell, index) => (
            <th key={`${cell}-${index}`} scope="col">
              {cell === '' ? <span className="sr-only">Item</span> : cell}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.rows.map((row) => (
          <tr key={row.join('|')}>
            {row.map((cell, index) =>
              index === 0 ? (
                <th key={`${cell}-${index}`} scope="row">
                  {cell}
                </th>
              ) : (
                <td key={`${cell}-${index}`}>{cell}</td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}
