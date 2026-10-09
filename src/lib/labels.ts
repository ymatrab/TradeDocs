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
  quotation: 'Quotation',
  purchase_order: 'Purchase order',
  sales_confirmation: 'Sales confirmation',
  sales_contract: 'Sales contract draft',
  bill_of_lading_draft: 'Bill of lading draft',
  shipper_letter_of_instruction: 'Shipper’s letter of instruction',
  vgm_declaration: 'VGM declaration',
} as const;

export type DocumentKind = keyof typeof documentKindLabels;

/**
 * Every document kind the workspace knows, in the order it offers them. The database
 * accepts the same list (private.document_kind_known); a test pins the two together.
 */
export const DOCUMENT_KINDS = [
  'commercial_invoice',
  'proforma_invoice',
  'packing_list',
  'delivery_note',
  'certificate_of_origin',
  'quotation',
  'purchase_order',
  'sales_confirmation',
  'sales_contract',
  'bill_of_lading_draft',
  'shipper_letter_of_instruction',
  'vgm_declaration',
] as const satisfies readonly DocumentKind[];

export const documentKindGroupLabels = {
  sales: 'Sales',
  invoicing: 'Invoicing and packing',
  shipping: 'Shipping',
} as const;

export type DocumentKindGroup = keyof typeof documentKindGroupLabels;

/** Where each kind sits in the document picker and the plan list. */
export const documentKindGroups: Record<DocumentKind, DocumentKindGroup> = {
  quotation: 'sales',
  purchase_order: 'sales',
  sales_confirmation: 'sales',
  sales_contract: 'sales',
  proforma_invoice: 'invoicing',
  commercial_invoice: 'invoicing',
  packing_list: 'invoicing',
  delivery_note: 'invoicing',
  certificate_of_origin: 'invoicing',
  bill_of_lading_draft: 'shipping',
  shipper_letter_of_instruction: 'shipping',
  vgm_declaration: 'shipping',
};

export function documentKindLabel(kind: string): string {
  return documentKindLabels[kind as DocumentKind] ?? kind;
}

export const companyKindLabels = {
  own: 'Own company',
  customer: 'Customer',
  supplier: 'Supplier',
} as const;

export type CompanyKind = keyof typeof companyKindLabels;

export function companyKindLabel(kind: string): string {
  return companyKindLabels[kind as CompanyKind] ?? kind;
}

export const partyRoleLabels = {
  exporter_id: 'Exporter',
  consignee_id: 'Consignee',
  notify_id: 'Notify party',
} as const;

export type PartyRole = keyof typeof partyRoleLabels;
