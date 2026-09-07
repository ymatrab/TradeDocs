/**
 * Database enums are storage, not language. Every value a user reads passes through
 * here, so a schema string never reaches a screen as it is spelled in the table.
 */

export const roleLabels = {
  owner: 'Owner',
  admin: 'Administrator',
  member: 'Member',
} as const;

export type Role = keyof typeof roleLabels;

export function roleLabel(role: string): string {
  return roleLabels[role as Role] ?? role;
}

export const documentKindLabels = {
  commercial_invoice: 'Commercial invoice',
  proforma_invoice: 'Proforma invoice',
  packing_list: 'Packing list',
  delivery_note: 'Delivery note',
  certificate_of_origin: 'Certificate of origin',
} as const;

export type DocumentKind = keyof typeof documentKindLabels;

export function documentKindLabel(kind: string): string {
  return documentKindLabels[kind as DocumentKind] ?? kind;
}
