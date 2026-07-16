import { NextResponse } from 'next/server';
import { ASSETS, GOVERNANCE, ASSET_CLASSES } from '@/lib/brookfield/assets';

// GET /api/bff/brookfield/assets — the institutional asset surface (C-131), read-only.
// SIMULATED / educational ONLY (every asset simulated=true). Brookfield owns the
// asset + governance RECORDS; capital is raised by FundX, custodied by
// payment-service (Invariant #8 — never brookfield-service), operated by Titan,
// verified by Zone. NO real Pi / investment / REIT until the Custody + Legal
// Hard-Gate is documented-done. This V1 serves a curated SAMPLE (source:'sample');
// when live, identity is from the session cookie, never a param (P6).
export function GET() {
  return NextResponse.json(
    { source: 'sample', assets: ASSETS, governance: GOVERNANCE, assetClasses: ASSET_CLASSES },
    { headers: { 'Cache-Control': 'private, max-age=60' } },
  );
}
