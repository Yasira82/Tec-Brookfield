# TEC Brookfield — Claude Code Instructions

> ⚡ **SESSION START:** اقرأ `knowledge-base/C-02___CURRENT_STATE_.md` + **app charter
> `knowledge-base/C-131___BROOKFIELD_INFRASTRUCTURE_RUNTIME.md`** من `yasira82/tec-knowledge-base` (branch: `main`).

## What This App Is

**The Infrastructure & Institutional Assets Runtime** of the Pi economy (C-131) —
the **System of Institutional Assets** (B2B / B2I). Brookfield answers one question:

```
"How do we own, finance, and operate large-scale assets in the Pi economy?"
```

Brookfield is the **institutional counterpart to Estate**:
- **Estate (C-114)** = individual / SME property (B2C — "where do I live?")
- **Brookfield** = institutional / infrastructure assets (B2B/B2I — "who owns the project?")

It is the **missing middle** of the Pi capital stack: **FundX raises** the capital,
**Brookfield owns + operates** the asset, **Estate sells** the retail units.

Built from `tec-template-base` (Next.js 15 frontend).

**Current Phase: Brookfield V0/V1 — SIMULATED read-only preview.** Identity / domain /
slug / legal + a themed home (a **simulated institutional portfolio** · the capital
stack · phased asset classes · governance records) + a `/asset/[id]` detail page +
**Brookfield Pro** (the Pi Portal "Process a Transaction" gate). Real assets / funds /
REITs are **hard-gated** (below). Not yet deployed.

---

## Pi App Identity

| Field | Value |
|-------|-------|
| **App** | TEC Brookfield |
| **Domain** | `https://brookfield.tecosystem.app` |
| **Pi App ID** | ⏳ TBD — register at Pi Developer Portal · then Vercel `NEXT_PUBLIC_PI_APP_ID` |
| **APP_SOURCE slug** | `brookfield` (payment-service resolves `PI_API_KEY_BROOKFIELD`) — set in `src/lib/app-source.ts` |
| **PI_SANDBOX** | `false` (Mainnet) |

---

## Brookfield-Specific Rules (C-131) — READ BEFORE ANY ASSET/FUND CODE

### 🔴 Custody + Legal Hard-Gate — the DEFINING constraint (P0)
Brookfield is **more regulated than FundX (C-113) or Insure (C-129)** —
infrastructure investment funds + REITs = **securities law**. NO real Pi
investment / fund / REIT mechanic ships until **ALL** of these are documented-done:
1. **Legal clearance FIRST** — securities / REIT / institutional-investor law for the target jurisdiction, before any real Pi movement.
2. **payment-service custody** — every invested π is held/moved/distributed BY `tec-payment-service` (Invariant #8). **brookfield-service NEVER holds capital** — it records asset + governance state and issues intents, never balances.
3. **SYSTEM governance (C-110)** — permitted asset classes + fund types + return models + multi-party governance approved as governed workflows; full ActorContext + audit trail.
4. **FundX V2 operational** — financing integrates FundX; Brookfield never re-implements capital raising.

Until ALL exist, Brookfield ships **simulated / educational read-only ONLY** —
sample portfolios + definitions + governance illustrations. **NO real Pi, NO
investment, NO custody, NO REITs.** Every V1 asset carries `simulated: true`.

### The ownership boundary
Brookfield **OWNS**: asset records + governance records. Brookfield does **NOT OWN**:
- **Capital custody** → `tec-payment-service` (Invariant #8). **Capital raising** → FundX (C-113).
- **Operations** → Titan (C-130). **Verification** → Zone (C-120, presented, never minted).
- **Legal** → external counsel. **Valuation** → external market data (via Analytics, never asserted).
- **Retail unit sale** → Estate (C-114) / Commerce. **Reputation** → Legend (C-126). **Metrics** → Analytics (C-105).

### Isolation (P6)
Identity from the `tec_user` session cookie server-side — **never** a query param
or body. No session → fail closed.

**Reference of record:** `yasira82/tec-knowledge-base` —
`C-131___BROOKFIELD_INFRASTRUCTURE_RUNTIME.md` (charter) + `C-113` (FundX gate posture) +
`C-114` (Estate B2C) + `C-12_Dual_Mode_Payment.md` + `C-123` (session/cookies) + `C-71` (financial integrity).

---

## Stack

- Next.js 15 App Router + TypeScript strict · React 18
- `@yasser172/tec-ui` (design system) · `@yasser172/tec-auth` · `@yasser172/tec-sdk`
- Vitest (unit) + Playwright (e2e) · Deployment: Vercel

---

## Architecture Rules (non-negotiable)

### CSRF — middleware ONLY (P2 single source of truth)
CSRF is enforced in **`middleware.ts`** and **nowhere else**: a request is trusted
if the double-submit token matches **OR** it is first-party (Origin host === Host /
`*.tecosystem.app`).
- ❌ **NEVER** add a CSRF check inside a route handler (`csrfCookie !== csrfHeader`
  → 403). It 403's legit Mode-2 payments in Pi Browser (drops `sameSite=None`
  cookies). The CI `payment-policy` job fails the build if you do. (KB C-12 §11)
- ✅ A route may *forward* `x-csrf-token` to a downstream call; it must never *validate* it.

### ADR-007 — Dual-mode payment (Pi foreign session)
Every buy handler MUST guard before touching `window.Pi`:
```typescript
const isHubNavigation = () =>
  document.referrer.toLowerCase().includes('hub.tecosystem.app');
if (isHubNavigation() || !(window as any).Pi || !piReady) {
  redirectToHubPayment(...);   // Mode 1: Hub modal → /hub?pay=1&...
  return;
}
// Mode 2: standalone — createPaymentRecord() then createU2APayment() (src/lib/pi-payment.ts)
```
> Brookfield Pro (subscription) is the only buy flow — NOT an investment. Approve
> under `PI_API_KEY_BROOKFIELD` (never the default Hub key — the Analytics
> approve→502 lesson, C-12 §11).

### ADR-009 — Unified payment contract
`amount` is a **number**; gateway path is **`/api/payment/*`** (singular); the only
inter-service header is **`x-internal-key`** + `INTERNAL_SECRET`. Don't re-declare
payment Zod locally — shapes live in `@yasser172/tec-sdk`.

### Two-SDK boundary
```
Client components → src/lib-client/*  (browser state, Pi hooks)
API routes (BFF)  → @yasser172/tec-sdk via /api/bff/*  (server-only)
```

### Auth / cookies (LOCKED)
SSO via Hub cookies `tec_access_token`, `tec_csrf`, `tec_user`. Never localStorage.
Identity is derived from the `tec_user` cookie server-side — **never from the request body**.
> `NEXT_PUBLIC_HUB_URL` MUST be `https://hub.tecosystem.app` — the apex `tecosystem.app`
> is not the Hub → `ERR_CONNECTION_CLOSED` at login; redeploy after changing it.

---

## Setup status + Roadmap (C-131 §Build Protocol)

```
Brookfield V0/V1 — SIMULATED preview (customized from template):
  ✅ package.json name = tec-brookfield · APP_SOURCE = 'brookfield' (src/lib/app-source.ts)
  ✅ sso-callback ALLOWED_AUDIENCES → brookfield.tecosystem.app + tec-brookfield.vercel.app
  ✅ privacy + terms → TEC Brookfield / brookfield.tecosystem.app
  ✅ NEW-A: no NEXT_PUBLIC_API_GATEWAY_URL / Railway host in the client bundle
  ✅ /app themed: simulated institutional portfolio + capital stack + phased asset
     classes + governance records + Brookfield Pro (real Pi U2A subscription)
  ✅ /asset/[id] detail (simulated) + BFF /api/bff/brookfield/assets (sample, read-only)

Next (before live):
  □ Register Pi App ID (Pi Developer Portal) → Vercel NEXT_PUBLIC_PI_APP_ID +
    API_GATEWAY_URL · INTERNAL_SECRET · SSO_SECRET · NEXT_PUBLIC_HUB_URL=https://hub.tecosystem.app · PI_SANDBOX=false.
  □ payment-service: set PI_API_KEY_BROOKFIELD on Railway (approve→502 otherwise, C-12 §11).
  □ Hub SSO: add brookfield.tecosystem.app + tec-brookfield.vercel.app to Hub /api/auth/sso
    ALLOWED_TARGETS + Hub domain registry.
  □ Deploy (Vercel) + runtime-verify login (C-123) + a real Brookfield Pro payment
    Mode 1 (Hub) AND Mode 2 (standalone).

Brookfield V2+ (POST Custody + Legal Hard-Gate — legal + payment-service custody +
  SYSTEM + FundX V2): real infrastructure projects → institutional assets →
  infrastructure financing → REITs. NONE ship until all P0 gates documented-done.
```

---

## What NOT To Do

- Do NOT build real asset/fund/REIT/investment mechanics before the P0 gates (legal + payment-service custody + SYSTEM + FundX V2) — C-131
- Do NOT hold capital in Brookfield or compute distributions here — payment-service custodies, FundX raises
- Do NOT present simulated assets as real investments — every V1 asset is simulated
- Do NOT mint verification — present Zone's verified flag, never create it
- Do NOT assert valuation as truth — it is indicative (Analytics / external)
- Do NOT validate CSRF in a route handler — middleware only (CI blocks it)
- Do NOT send `amount` as a string, or use `/payments` / `x-service-secret`
- Do NOT skip the ADR-007 `isHubNavigation()` guard before `window.Pi`
- Do NOT store tokens in localStorage; do NOT derive identity from the body
- Do NOT add `NEXT_PUBLIC_*` for internal service URLs or `INTERNAL_SECRET`
- Do NOT set `NEXT_PUBLIC_HUB_URL` to the apex `tecosystem.app` — use `hub.tecosystem.app`

---

## Commit Convention

```
feat(brookfield):  new asset feature   fix(payment): payment flow fix (test carefully)
fix(brookfield):   bug fix             chore(scope):  build/config
```

---

## Skills

Available via plugin — invoke automatically when the situation matches:

| Situation | Skill |
|-----------|-------|
| Writing new feature or fixing a bug → use TDD | `/tdd` |
| Bug, regression, or unexpected behavior | `/diagnose` |
| Writing or modifying tests | `/test-guard` |
| Writing or modifying BFF routes, payment handlers, or API contracts | `/clean-code-guard` |
| Updating docs, CLAUDE.md, or knowledge-base entries | `/docs-guard` |
| Planning a new feature or architectural decision | `/grill-with-docs` |
| Breaking down a roadmap item into GitHub Issues | `/to-issues` |
| Session is getting long or context is filling up | `/handoff` |
| Adding pre-commit hooks to this repo | `/setup-pre-commit` |
