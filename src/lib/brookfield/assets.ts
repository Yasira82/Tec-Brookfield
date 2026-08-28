// TEC Brookfield — Infrastructure Runtime (C-131) — read-only V1 data.
//
// Brookfield = System of Institutional Assets (B2B/B2I): how large-scale assets
// are owned, financed, governed, and operated in the Pi economy ("who owns the
// project?"). It is the institutional counterpart to Estate (B2C) and the missing
// middle between FundX (raises capital) and Estate (sells units).
//
// 🔴 CUSTODY + LEGAL HARD-GATE (C-131, the DEFINING constraint):
// Brookfield is MORE regulated than FundX/Insure (securities + REIT law). This V1
// is SIMULATED / educational read-only ONLY — every asset carries simulated=true.
// NO real Pi, NO investment, NO custody, NO REITs. Real capital ships only AFTER
// legal clearance + payment-service custody (Invariant #8; brookfield-service NEVER
// holds capital) + SYSTEM governance + FundX V2. Brookfield owns the asset +
// governance RECORDS; capital is raised by FundX, operated by Titan, verified by
// Zone — coordinated by ID, never re-derived here.

export type AssetClass = 'INFRA_PROJECT' | 'INSTITUTIONAL' | 'RE_FUND' | 'REIT';

// DRAFT → VERIFIED → FUNDED → OPERATIONAL → CLOSED
export type AssetStatus = 'DRAFT' | 'VERIFIED' | 'FUNDED' | 'OPERATIONAL' | 'CLOSED';

export interface InstitutionalAsset {
  id:           string;
  class:        AssetClass;
  name:         string;
  summary:      string;
  scaleBand:    string;         // indicative only — never asserted as truth
  status:       AssetStatus;
  zoneVerified: boolean;        // presented from Zone — never minted here
  fundedPct?:   number;         // presented from FundX — capital raised THERE
  ownedBy:      string;         // the OWNING system for capital/ops/verification
  simulated:    true;           // V1 invariant: always simulated (no real capital)
}

export interface GovernanceRecord {
  id:       string;
  assetId:  string;
  proposal: string;
  parties:  number;             // participating stakeholders (ID references)
  status:   'OPEN' | 'DECIDED';
}

// Simulated institutional portfolio (educational).
export const ASSETS: InstitutionalAsset[] = [
  {
    id: 'pi-datacenter-01',
    class: 'INFRA_PROJECT',
    name: 'Pi-Native Data Center',
    summary: 'Compute + storage infrastructure serving the Pi ecosystem.',
    scaleBand: 'Large',
    status: 'VERIFIED',
    zoneVerified: true,
    fundedPct: 40,
    ownedBy: 'FundX raises capital · Titan operates · payment-service custodies',
    simulated: true,
  },
  {
    id: 'renewable-energy-fund',
    class: 'INFRA_PROJECT',
    name: 'Renewable Energy for Pi Mining',
    summary: 'Solar + wind generation powering distributed Pi infrastructure.',
    scaleBand: 'Large',
    status: 'FUNDED',
    zoneVerified: true,
    fundedPct: 85,
    ownedBy: 'FundX (capital) · Titan (ops)',
    simulated: true,
  },
  {
    id: 'hospitality-portfolio',
    class: 'INSTITUTIONAL',
    name: 'Hospitality Asset Portfolio',
    summary: 'Institutional hotels + malls managed as a coordinated portfolio.',
    scaleBand: 'Medium-Large',
    status: 'OPERATIONAL',
    zoneVerified: true,
    ownedBy: 'Titan (operations) · Commerce (services)',
    simulated: true,
  },
  {
    id: 'community-re-fund',
    class: 'RE_FUND',
    name: 'Community Real Estate Fund',
    summary: 'Collective-ownership fund for community property (educational).',
    scaleBand: 'Medium',
    status: 'DRAFT',
    zoneVerified: false,
    fundedPct: 0,
    ownedBy: 'FundX (capital) · Estate (retail units)',
    simulated: true,
  },
];

// Multi-party governance (recorded, never executed here).
export const GOVERNANCE: GovernanceRecord[] = [
  { id: 'gov-1', assetId: 'pi-datacenter-01',        proposal: 'Approve Phase-2 capacity expansion', parties: 5, status: 'OPEN' },
  { id: 'gov-2', assetId: 'renewable-energy-fund',   proposal: 'Distribute Q3 operating surplus',    parties: 8, status: 'DECIDED' },
];

// The 5 asset classes, phased (real classes gated on legal — C-131).
export const ASSET_CLASSES: { class: AssetClass | 'FINANCING'; label: string; phase: string; note: string }[] = [
  { class: 'RE_FUND',       label: 'Real Estate Funds',        phase: 'V1',  note: 'Simulated / educational first.' },
  { class: 'INFRA_PROJECT', label: 'Infrastructure Projects',  phase: 'V2',  note: 'Needs Zone verification + legal.' },
  { class: 'INSTITUTIONAL', label: 'Institutional Assets',     phase: 'V2',  note: 'Needs NBF / Titan integration.' },
  { class: 'FINANCING',     label: 'Infrastructure Financing', phase: 'V3',  note: 'Needs FundX V2 + legal.' },
  { class: 'REIT',          label: 'REITs',                    phase: 'V3+', note: 'Full regulatory clearance required.' },
];

export const CLASS_META: Record<AssetClass, { label: string; icon: string }> = {
  INFRA_PROJECT: { label: 'Infrastructure', icon: '🏗️' },
  INSTITUTIONAL: { label: 'Institutional',  icon: '🏨' },
  RE_FUND:       { label: 'RE Fund',        icon: '🏘️' },
  REIT:          { label: 'REIT',           icon: '📈' },
};

export const STATUS_META: Record<AssetStatus, { label: string; tone: string }> = {
  DRAFT:       { label: 'Draft',       tone: '#8B5CF6' },
  VERIFIED:    { label: 'Verified',    tone: '#06B6D4' },
  FUNDED:      { label: 'Funded',      tone: '#22C55E' },
  OPERATIONAL: { label: 'Operational', tone: '#FBB44A' },
  CLOSED:      { label: 'Closed',      tone: '#9ca3af' },
};

export function getAsset(id: string): InstitutionalAsset | null {
  return ASSETS.find((a) => a.id === id) ?? null;
}
