import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources first cited by the country page /export-documents/mexico. Each URL was opened on
 * the retrieval date and checked against the claim in `supports`.
 */
const RETRIEVED = '2026-10-07';
const PENDING = 'pending owner review';

export default {
  'trade-gov-ccg-mx': {
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title:
      'Mexico Country Commercial Guide: Import Requirements and Documentation (last published 9 February 2026)',
    url: 'https://www.trade.gov/country-commercial-guides/mexico-import-requirements-and-documentation',
    jurisdiction: 'Mexico (U.S. government export guidance)',
    supports:
      'the pedimento de importación as the basic Mexican import document, accompanied by a commercial invoice in Spanish, the bill of lading and documentation proving compliance with Mexican product safety regulations; Mexican importers also having to comply with the Complemento Carta Porte from 1 August 2023; all Mexican importers registering in the Padrón de Importadores kept by the Secretariat of Finance and Public Credit, with sector registries such as textiles, apparel and footwear; and goods being cleared by a Mexican customs broker or an authorised legal representative',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'anam-mexico': {
    authority: 'Agencia Nacional de Aduanas de México (ANAM)',
    title: 'ANAM — Agencia Nacional de Aduanas de México',
    url: 'https://www.anam.gob.mx/',
    jurisdiction: 'Mexico',
    supports:
      'ANAM being Mexico’s national customs agency, responsible for customs clearance, the electronic customs system and the VUCEM single window for foreign trade',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'sat-padron-importadores': {
    authority: 'Servicio de Administración Tributaria (SAT), Mexico',
    title: 'Padrón de Importadores / Inscripción',
    url: 'https://www.sat.gob.mx/minisitio/PadronImportadoresExportadores/pi_inscripcion.html',
    jurisdiction: 'Mexico',
    supports:
      'natural and legal persons who wish to import goods into Mexico registering in the Padrón de Importadores, on condition of being registered and active in the RFC, holding a valid e.firma, being current with tax obligations and having a customs agent, customs representative or legal representative',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
