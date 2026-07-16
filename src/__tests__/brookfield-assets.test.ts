import { describe, it, expect } from 'vitest';
import {
  ASSETS, GOVERNANCE, ASSET_CLASSES, CLASS_META, STATUS_META, getAsset,
} from '@/lib/brookfield/assets';

describe('TEC Brookfield — Infrastructure Runtime (C-131), read-only simulated V1', () => {
  it('SIMULATED HARD-GATE: every asset is simulated (no real capital in V1)', () => {
    expect(ASSETS.length).toBeGreaterThan(0);
    for (const a of ASSETS) {
      expect(a.simulated, a.id).toBe(true);
      expect(CLASS_META[a.class]).toBeTruthy();
      expect(STATUS_META[a.status]).toBeTruthy();
    }
  });

  it('capital custody is payment-service (Invariant #8) — never brookfield-service', () => {
    // the primary infra asset names payment-service as custodian; none name brookfield custody
    const dc = getAsset('pi-datacenter-01');
    expect(dc?.ownedBy.toLowerCase()).toContain('payment-service');
    for (const a of ASSETS) {
      expect(a.ownedBy.toLowerCase()).not.toContain('brookfield custod');
    }
  });

  it('REITs are the last phase (V3+ — full regulatory clearance)', () => {
    const reit = ASSET_CLASSES.find((c) => c.class === 'REIT');
    expect(reit?.phase).toBe('V3+');
    // no REIT asset is live/operational in the simulated V1 portfolio
    expect(ASSETS.some((a) => a.class === 'REIT')).toBe(false);
  });

  it('governance records reference a real asset and are recorded, not executed', () => {
    for (const g of GOVERNANCE) {
      expect(getAsset(g.assetId), g.id).not.toBeNull();
      expect(['OPEN', 'DECIDED']).toContain(g.status);
    }
  });

  it('covers the institutional asset classes (infra · institutional · RE fund)', () => {
    const classes = new Set(ASSETS.map((a) => a.class));
    for (const c of ['INFRA_PROJECT', 'INSTITUTIONAL', 'RE_FUND'] as const) {
      expect(classes.has(c), c).toBe(true);
    }
  });

  it('getAsset resolves by id and fails closed for an unknown id', () => {
    expect(getAsset('renewable-energy-fund')?.class).toBe('INFRA_PROJECT');
    expect(getAsset('nope')).toBeNull();
  });
});
