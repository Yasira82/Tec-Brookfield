'use client';

// TEC Brookfield — Infrastructure home (C-131), read-only SIMULATED V1.
// The B2B/institutional counterpart to Estate (B2C): who owns, finances, and
// operates large-scale assets. Brookfield owns the asset + governance records;
// capital is FundX's, custody payment-service's, ops Titan's, verification Zone's.
// SIMULATED-ONLY — no real Pi / investment / REIT (Custody + Legal Hard-Gate).
import Link from 'next/link';
import { TEC_COLORS } from '@yasser172/tec-ui';
import { ASSETS, ASSET_CLASSES, CLASS_META, STATUS_META, GOVERNANCE } from '@/lib/brookfield/assets';
import BrookfieldPro from './components/BrookfieldPro';

export default function BrookfieldHome() {
  return (
    <main style={{ minHeight: '100vh', background: TEC_COLORS.bg, color: '#e7e7ea', padding: '32px 22px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <header style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 34 }}>🏗️</div>
          <h1 style={{ color: TEC_COLORS.gold, margin: '4px 0 2px', fontSize: 26 }}>TEC Brookfield</h1>
          <p style={{ opacity: 0.7, margin: 0, fontSize: 14 }}>
            Infrastructure Runtime — who owns, finances, and operates large-scale assets on Pi?
          </p>
        </header>

        {/* Simulated / legal banner */}
        <div style={{ marginTop: 18, padding: '12px 16px', background: '#FBBF2411', border: `1px solid ${TEC_COLORS.gold}44`, borderRadius: 12, fontSize: 12.5, lineHeight: 1.6 }}>
          <strong style={{ color: TEC_COLORS.gold }}>Simulated / educational preview.</strong> Every asset below is a
          simulation — <strong>no real Pi, no investment, no REITs</strong>. Institutional scale carries securities
          law: real capital ships only after legal clearance + payment-service custody + SYSTEM governance (C-131).
        </div>

        {/* Capital stack */}
        <div style={{ marginTop: 16, padding: '12px 16px', background: TEC_COLORS.surface, borderRadius: 12, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', fontSize: 13 }}>
          {['FundX · Raise', 'Brookfield · Own', 'Titan · Operate', 'Estate · Sell units'].map((s, i, a) => (
            <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: i === 1 ? TEC_COLORS.gold : '#9ca3af' }}>{s}</span>
              {i < a.length - 1 && <span style={{ opacity: 0.4 }}>→</span>}
            </span>
          ))}
        </div>

        {/* Portfolio */}
        <h2 style={{ color: TEC_COLORS.gold, fontSize: 16, marginTop: 28, marginBottom: 12 }}>Institutional portfolio (simulated)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {ASSETS.map((a) => {
            const cm = CLASS_META[a.class]; const sm = STATUS_META[a.status];
            return (
              <Link key={a.id} href={`/asset/${a.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ padding: 16, background: TEC_COLORS.surface, borderRadius: 12, border: '1px solid #ffffff10', height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 20 }}>{cm.icon} <span style={{ fontSize: 11, opacity: 0.7 }}>{cm.label}</span></span>
                    <span style={{ fontSize: 11, color: sm.tone, border: `1px solid ${sm.tone}55`, borderRadius: 20, padding: '2px 8px' }}>{sm.label}</span>
                  </div>
                  <div style={{ color: '#e7e7ea', fontWeight: 700, marginTop: 10 }}>{a.name}</div>
                  <div style={{ opacity: 0.65, fontSize: 12.5, marginTop: 6, lineHeight: 1.5 }}>{a.summary}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 11, opacity: 0.6 }}>
                    <span>{a.scaleBand} · {a.zoneVerified ? '✓ Zone' : '—'}</span>
                    {a.fundedPct != null && <span>Funded {a.fundedPct}%</span>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Asset classes (phased) */}
        <h2 style={{ color: TEC_COLORS.gold, fontSize: 16, marginTop: 28, marginBottom: 10 }}>Asset classes (phased)</h2>
        <div style={{ display: 'grid', gap: 6 }}>
          {ASSET_CLASSES.map((c) => (
            <div key={c.label} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '9px 14px', background: TEC_COLORS.surface, borderRadius: 10, fontSize: 13 }}>
              <span style={{ minWidth: 42, color: TEC_COLORS.gold, fontWeight: 700 }}>{c.phase}</span>
              <span style={{ minWidth: 170, fontWeight: 600 }}>{c.label}</span>
              <span style={{ opacity: 0.6, fontSize: 12 }}>{c.note}</span>
            </div>
          ))}
        </div>

        {/* Governance */}
        <h2 style={{ color: TEC_COLORS.gold, fontSize: 16, marginTop: 28, marginBottom: 10 }}>Governance (recorded, not executed)</h2>
        <div style={{ display: 'grid', gap: 8 }}>
          {GOVERNANCE.map((g) => (
            <div key={g.id} style={{ padding: '10px 14px', background: TEC_COLORS.surface, borderRadius: 10, fontSize: 13, display: 'flex', justifyContent: 'space-between', gap: 10 }}>
              <span style={{ opacity: 0.85 }}>{g.proposal}</span>
              <span style={{ opacity: 0.6, fontSize: 12, whiteSpace: 'nowrap' }}>{g.parties} parties · {g.status}</span>
            </div>
          ))}
        </div>

        <p style={{ opacity: 0.55, fontSize: 12, marginTop: 20, lineHeight: 1.6, borderLeft: `2px solid ${TEC_COLORS.gold}55`, paddingLeft: 12 }}>
          <strong>Boundary (C-131).</strong> Brookfield owns the asset + governance records. Capital custody is
          payment-service&rsquo;s (Invariant #8 — never brookfield-service), raising is FundX&rsquo;s, operations
          are Titan&rsquo;s, verification is Zone&rsquo;s. Estate is the B2C counterpart. Read-only simulation.
        </p>

        {/* Brookfield Pro */}
        <h2 style={{ color: TEC_COLORS.gold, fontSize: 16, marginTop: 32, marginBottom: 12 }}>Upgrade</h2>
        <BrookfieldPro />
      </div>
    </main>
  );
}
