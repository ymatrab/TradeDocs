import { ImageResponse } from 'next/og';
import { documentKindLabels } from '@/lib/labels';
import { regulatedDocumentsEnabled } from '@/lib/config/server';
import { publicDocumentKinds } from '@/lib/seo/site';

/**
 * The share card, in the Manifest palette (DESIGN_SYSTEM.md): a hull-green ground, the
 * offered documents stacked as paper, and the tape strip behind the two words that matter.
 * Drawn from the same document list as the home page, so the certificate of origin joins
 * it only behind its review gate (D-008, D-025).
 */
// Literal values, mirrored by SHARE_IMAGE in src/lib/seo/social.ts.
export const alt = 'TradeDocs: enter a shipment once, get the whole document set';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const HULL = '#143d3a';
const HULL_RAISED = '#1d524d';
const HULL_MUTED = '#b6c9c3';
const PAPER = '#f4f1ea';
const TAPE = '#f6c945';
const INK = '#14221f';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: HULL,
        color: PAPER,
        padding: '64px 72px',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingRight: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 30, fontWeight: 700 }}>
          <div style={{ width: 28, height: 8, background: TAPE, marginRight: 14 }} />
          TradeDocs
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 64,
            fontSize: 66,
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: -1.5,
          }}
        >
          <div style={{ display: 'flex' }}>Enter a shipment once.</div>
          <div style={{ display: 'flex', marginTop: 8 }}>Get the whole</div>
          <div style={{ display: 'flex', marginTop: 8 }}>
            <div style={{ display: 'flex', background: TAPE, color: INK, padding: '0 14px' }}>
              document set
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', marginTop: 'auto', fontSize: 24, color: HULL_MUTED }}>
          Free while early · Prepared, not issued
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: 360,
        }}
      >
        {publicDocumentKinds(regulatedDocumentsEnabled()).map((kind, index) => (
          <div
            key={kind}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: index === 0 ? 0 : 14,
              padding: '22px 24px',
              background: index % 4 === 0 ? TAPE : index % 4 === 2 ? PAPER : HULL_RAISED,
              color: index % 2 === 1 ? PAPER : INK,
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            <div style={{ display: 'flex' }}>{documentKindLabels[kind]}</div>
            <div style={{ display: 'flex', fontSize: 18, fontWeight: 500 }}>
              {String(index + 1).padStart(4, '0')}
            </div>
          </div>
        ))}
      </div>
    </div>,
    size,
  );
}
