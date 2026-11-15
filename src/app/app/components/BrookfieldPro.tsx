'use client';

// BrookfieldPro — the real Pi U2A payment surface (the Pi Portal "Process a
// Transaction" gate). Brookfield Pro is a subscription (advanced asset analytics
// + governance tooling). IMPORTANT (C-131): this is NOT an investment — no real
// asset / fund / REIT capital flow exists in V1 (simulated-only, hard-gated to
// legal + payment-service custody + SYSTEM). Keeps the ADR-007 dual-mode guard.
import { useEffect, useState } from 'react';
import { TEC_COLORS } from '@yasser172/tec-ui';
import {
  isHubNavigation,
  redirectToHubPayment,
  createPaymentRecord,
  createU2APayment,
} from '@/lib/pi-payment';
import { CancelProButton } from '@/components/pro/CancelProButton';
import { readProState } from '@/lib/subscription/read-pro-state';

const BROOKFIELD_PRO = { id: 'brookfield_pro_monthly', name: 'Brookfield Pro (monthly)', price: 25 };

export default function BrookfieldPro() {
  const [piReady, setPiReady] = useState(false);

  // Reflect the real subscription (activated by commerce-service when a Pro payment
  // completes). Pro ONLY while the period is live — no auto-renewal / no downgrade job.
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  useEffect(() => {
    fetch('/api/bff/subscription', { credentials: 'include', cache: 'no-store' })
      .then((r) => r.json()).catch(() => ({}))
      .then((j: Record<string, unknown>) => {
        // One reading, fail-closed — the same as the server's (TEC-AUDIT-0044).
        const st = readProState(j);
        setIsSubscribed(st.pro);
        // Renewal signal (Pi Pro is one-time, no auto-renewal) — commerce sends
        // daysRemaining; fall back to the period end. Drives a re-subscribe nudge.
        const days = st.daysRemaining;
        setDaysRemaining(days);
      })
      .catch(() => {});
  }, []);

  const [status, setStatus]   = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ((window as { __TEC_PI_READY?: boolean }).__TEC_PI_READY) setPiReady(true);
    const onReady = () => setPiReady(true);
    window.addEventListener('tec-pi-ready', onReady);
    return () => window.removeEventListener('tec-pi-ready', onReady);
  }, []);

  const handleSubscribe = async () => {
    const { id, name, price } = BROOKFIELD_PRO;

    // ── ADR-007 guard — ALWAYS before touching window.Pi ──
    if (isHubNavigation() || !(window as { Pi?: unknown }).Pi || !piReady) {
      redirectToHubPayment({ amount: price, itemId: id, memo: name });   // Mode 1
      return;
    }

    // ── Mode 2: standalone Pi Browser payment ──
    setStatus('Creating payment…');
    const internalId = await createPaymentRecord(price, id, name);
    if (!internalId) { setStatus('Could not start payment.'); return; }

    // Report each step. One label for the whole flow could not say which of
    // the four waits a stuck payment was stuck in.
    const result = await createU2APayment(
      price, name, { item_id: id, plan: 'PRO' }, internalId, setStatus,
    );
    setStatus(
      result.success ? `✅ Subscribed — txid ${result.txid}` :
      result.status === 'cancelled' ? 'Payment cancelled.' :
      `❌ ${result.message ?? 'Payment failed.'}`,
    );
  };

  if (isSubscribed) {
    return (
      <div style={{ background: TEC_COLORS.surface, border: `1px solid ${TEC_COLORS.gold}55`, borderRadius: 16, padding: 20, marginTop: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: TEC_COLORS.gold }}>★ You’re on Pro</div>
        <div style={{ fontSize: 12, color: TEC_COLORS.subtext, marginTop: 6 }}>
          Your subscription is active. Thanks for supporting TEC.
        </div>
        {typeof daysRemaining === 'number' && (
          <div style={{ fontSize: 12, fontWeight: daysRemaining <= 7 ? 700 : 600, color: daysRemaining <= 7 ? TEC_COLORS.gold : TEC_COLORS.subtext, marginTop: 8 }}>
            {daysRemaining <= 7 ? '⏳ ' : ''}Expires in {daysRemaining} day{daysRemaining === 1 ? '' : 's'}{daysRemaining <= 7 ? ' — re-subscribe to keep Pro (one-time monthly, no auto-renewal).' : '.'}
          </div>
        )}
        <CancelProButton />
      </div>
    );
  }

  return (
    <div style={{
      padding: 20, background: TEC_COLORS.surface, borderRadius: 14,
      border: `1px solid ${TEC_COLORS.gold}33`, maxWidth: 460,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <h2 style={{ margin: 0, color: TEC_COLORS.gold, fontSize: 18 }}>Brookfield Pro</h2>
        <span style={{ color: TEC_COLORS.gold, fontWeight: 800 }}>π 25<span style={{ opacity: 0.6, fontSize: 12, fontWeight: 500 }}>/mo</span></span>
      </div>
      <p style={{ opacity: 0.75, fontSize: 13, margin: '8px 0 6px' }}>
        Advanced asset analytics · governance tooling · portfolio views.
      </p>
      <p style={{ opacity: 0.55, fontSize: 11.5, margin: '0 0 14px' }}>
        A subscription — NOT an investment. Real asset / fund / REIT capital is
        hard-gated (legal + payment-service custody + SYSTEM); V1 is simulated.
      </p>
      <button
        onClick={handleSubscribe}
        style={{
          background: `linear-gradient(135deg, ${TEC_COLORS.gold}, ${TEC_COLORS.goldDark})`,
          color: '#0a0800', border: 'none', borderRadius: 10,
          padding: '11px 20px', fontWeight: 700, cursor: 'pointer',
        }}>
        Subscribe with Pi
      </button>
      <p style={{ opacity: 0.5, fontSize: 11, marginTop: 10 }}>Pi SDK: {piReady ? 'ready' : 'loading…'}</p>
      {status && <p style={{ marginTop: 8, fontSize: 13 }}>{status}</p>}
    </div>
  );
}
