// TEC Brookfield — asset detail (C-131), read-only simulated, statically generated.
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TEC_COLORS } from '@yasser172/tec-ui';
import { ASSETS, getAsset, GOVERNANCE, CLASS_META, STATUS_META } from '@/lib/brookfield/assets';

export function generateStaticParams() {
  return ASSETS.map((a) => ({ id: a.id }));
}

export default async function AssetDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = getAsset(id);
  if (!a) notFound();

  const cm = CLASS_META[a.class];
  const sm = STATUS_META[a.status];
  const gov = GOVERNANCE.filter((g) => g.assetId === a.id);

  return (
    <main style={{ minHeight: '100vh', background: TEC_COLORS.bg, color: '#e7e7ea', padding: '32px 22px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <Link href="/app" style={{ color: TEC_COLORS.gold, fontSize: 13, textDecoration: 'none' }}>← Back</Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
          <span style={{ fontSize: 30 }}>{cm.icon}</span>
          <h1 style={{ color: TEC_COLORS.gold, margin: 0, fontSize: 23 }}>{a.name}</h1>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: sm.tone, border: `1px solid ${sm.tone}55`, borderRadius: 20, padding: '3px 10px' }}>{sm.label}</span>
          <span style={{ fontSize: 12, opacity: 0.7, border: '1px solid #ffffff22', borderRadius: 20, padding: '3px 10px' }}>{cm.label} · {a.scaleBand}</span>
          <span style={{ fontSize: 12, opacity: 0.7, border: '1px solid #ffffff22', borderRadius: 20, padding: '3px 10px' }}>{a.zoneVerified ? '✓ Zone verified' : 'Unverified'}</span>
          <span style={{ fontSize: 12, color: TEC_COLORS.gold, border: `1px solid ${TEC_COLORS.gold}55`, borderRadius: 20, padding: '3px 10px' }}>Simulated</span>
        </div>

        <p style={{ marginTop: 16, lineHeight: 1.6, opacity: 0.9 }}>{a.summary}</p>
        <p style={{ opacity: 0.6, fontSize: 13 }}>Owned / operated by: <strong>{a.ownedBy}</strong></p>

        {a.fundedPct != null && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
              <span style={{ opacity: 0.8 }}>Capital raised (via FundX — simulated)</span>
              <span style={{ color: TEC_COLORS.gold }}>{a.fundedPct}%</span>
            </div>
            <div style={{ height: 8, background: '#ffffff14', borderRadius: 8 }}>
              <div style={{ height: 8, width: `${a.fundedPct}%`, background: TEC_COLORS.goldDark, borderRadius: 8 }} />
            </div>
          </div>
        )}

        {gov.length > 0 && (
          <>
            <h2 style={{ color: TEC_COLORS.gold, fontSize: 15, marginTop: 24 }}>Governance records</h2>
            {gov.map((g) => (
              <div key={g.id} style={{ padding: '10px 0', borderBottom: '1px solid #ffffff10', fontSize: 13.5, display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <span style={{ opacity: 0.9 }}>{g.proposal}</span>
                <span style={{ opacity: 0.6, fontSize: 12, whiteSpace: 'nowrap' }}>{g.parties} parties · {g.status}</span>
              </div>
            ))}
          </>
        )}

        <p style={{ marginTop: 20, fontSize: 12, opacity: 0.55, lineHeight: 1.6, borderLeft: `2px solid ${TEC_COLORS.gold}55`, paddingLeft: 12 }}>
          <strong>Simulated (C-131).</strong> No real Pi, no investment. Capital custody is payment-service&rsquo;s
          (Invariant #8), raising is FundX&rsquo;s, operations are Titan&rsquo;s, verification is Zone&rsquo;s —
          Brookfield records the asset + governance state only. Real flows are hard-gated to legal + SYSTEM.
        </p>
      </div>
    </main>
  );
}
