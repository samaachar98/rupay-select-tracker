# Rupay Select Tracker - Architecture Specification

## 1. Tech Stack (Free Vercel Deployment)

### Frontend
- **Next.js 14** (App Router, SSR/SSG for SEO/performance)
- **React 18**
- **TanStack Table v8** (data grids)
- **shadcn/ui** (accessible components)
- **Tailwind CSS** (styling)
- **Lucide React** (icons)
- **Zod** (validation)
- **React Hook Form** (forms)
- **Date-fns** (date handling)

### Backend & Database
- **Supabase** (Free tier: 500MB DB, 1GB storage, 50k MAU auth, realtime)
  - PostgreSQL (normalized schema)
  - Supabase Auth (JWT tokens)
  - Supabase Realtime (live sync for multi-device/family)
  - Supabase Edge Functions (cron jobs for notifications)

### Additional Services (All Free Tiers)
- **Authentication**: Supabase Auth (email/password, OAuth)
- **Notifications**: Supabase Edge Functions + Resend (free tier: 3k emails/mo) or Supabase Realtime push + service worker
- **Exports**:
  - CSV: PapaParse (client-side)
  - PDF: jsPDF + jspdf-autotable (client-side)
- **Analytics**: Supabase SQL queries + Vercel Analytics (free basic)
- **Deployment**: Vercel (Hobby: 100GB bandwidth/mo, 100 build hours/mo, 10s serverless timeout)

**Vercel Limits Compliance**:
- Static/SSG pages for most routes
- Server Actions for mutations (short-lived)
- No long-polling; use Supabase Realtime
- Client-side heavy for exports/notifications

## 2. Data Model (PostgreSQL via Supabase)

```sql
-- Users auto-managed by Supabase Auth (uuid, email, etc.)

-- Cards (per user/family member)
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,  -- e.g., 'BoB Rupay Select ****1234'
  bank VARCHAR(100),
  last4 VARCHAR(4),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Vouchers/Benefits
CREATE TABLE vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,  -- e.g., 'Cult.fit 3mo'
  cycle_type ENUM('quarterly', 'half_yearly', 'yearly') NOT NULL,
  expiry_date DATE,  -- For notifications
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Redemptions (tracks usage per period)
CREATE TABLE redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voucher_id UUID REFERENCES vouchers(id) ON DELETE CASCADE,
  period VARCHAR(20) NOT NULL,  -- 'q1_2026', 'h1_2026', '2026'
  redeemed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(voucher_id, period)  -- One redemption per period
);

-- Usage Analytics (aggregated views)
CREATE VIEW voucher_usage AS
SELECT 
  v.name, c.name as card,
  COUNT(r.id) as total_redemptions,
  COUNT(DISTINCT r.period) as unique_periods_used
FROM vouchers v
JOIN cards c ON v.card_id = c.id
LEFT JOIN redemptions r ON v.id = r.voucher_id
GROUP BY v.id, c.id;
```

**RLS Policies** (Row Level Security):
- `ENABLE RLS` on all tables
- Users see only own `user_id` rows
- Family sharing: Optional `family_id` column + invite system

## 3. Authentication (Free Tier Friendly)

- **Provider**: Supabase Auth (unlimited users free up to 50k MAU)
- **Methods**: Email/password + Google/OAuth (Rupay-related banks?)
- **Flows**:
  1. `/login`, `/signup` (Next.js pages)
  2. Supabase `signInWithPassword` / `signUp`
  3. JWT session via cookies (`next-auth` compatible or Supabase SSR helpers)
- **Protection**: Server Components/Actions check `auth.getUser()`
- **Multi-User**: Per-user data isolation via `user_id`; optional family groups
- **Middleware**: Next.js middleware redirects unauth to `/login`

**Lib**: `@supabase/supabase-js` (client/server), `@supabase/ssr` (cookies)

## 4. API Structure (Server Actions + Supabase)

**Server Actions** (App Router preferred over API Routes):
```ts
// app/actions.ts
'use server'
import { createClient } from '@/utils/supabase/server'

export async function addCard(formData: FormData) { ... }
export async function toggleRedemption(voucherId: string, period: string) { ... }
export async function getVouchers(userId: string) { ... }
```

**Direct Supabase Queries** in Server Components:
- `fetchVouchers()`: `supabase.from('vouchers').select('*').eq('user_id', user.id)`
- Realtime: `supabase.channel('vouchers').on('postgres_changes', ...).subscribe()`

**Edge Functions** (Supabase):
- `notify-expiry`: Cron job scans `expiry_date`, sends emails via Resend

## 5. Component Breakdown

```
src/
├── app/
│   ├── (auth)/login/page.tsx          # Auth forms
│   ├── (auth)/signup/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx                   # Main table (protected)
│   │   ├── export/page.tsx            # PDF/CSV exports
│   │   └── analytics/page.tsx         # Usage charts (Recharts?)
│   ├── layout.tsx                     # Root layout + Supabase provider
│   └── middleware.ts                  # Auth guard
├── components/
│   ├── table/
│   │   ├── voucher-table.tsx          # Enhanced DataTable
│   │   ├── columns.tsx                # Dynamic columns by cycle_type
│   │   └── add-card-dialog.tsx        # Forms
│   ├── ui/                            # shadcn
│   └── auth/                          # Login/Signup forms
└── lib/
    ├── supabase.ts                    # Client init
    └── schema.ts                      # Zod schemas
```

**Key Enhancements**:
- Dynamic columns: Group quarters/half/yearly based on `cycle_type`
- Realtime updates: Checkbox toggles → Server Action → Realtime broadcast
- Mobile: Existing responsive + PWA (Next.js manifest)

## 6. Vercel Deployment Considerations

1. **Connect GitHub repo** to Vercel dashboard
2. **Env Vars**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...  # Server-only
   RESEND_API_KEY=...  # Optional
   ```
3. **Build**: `next build` (static + serverless)
4. **Limits**:
   - Serverless: 10s timeout → Offload heavy exports to client
   - Bandwidth: Client-heavy app → Fine for family use
   - Functions: Edge for notifications (Supabase handles)
5. **Custom Domain**: Free subdomain `*.vercel.app`
6. **Preview Deploys**: Auto per PR

## 7. Migration Plan from Local Storage

1. **Export Script** (one-time client-side):
   ```ts
   // In dashboard, 'Import Local Data' button
   const localData = localStorage.getItem('rupay-vouchers');
   if (localData) {
     // Parse, map to new schema via Server Action
     await importLocalData(JSON.parse(localData));
     localStorage.removeItem('rupay-vouchers');
   }
   ```

2. **Steps**:
   - User logs in first time
   - App detects localStorage data
   - Prompts 'Migrate to cloud?' → Server Action upserts cards/vouchers
   - Mark as migrated (user_meta or DB flag)

3. **Fallback**: Manual CSV export/import

4. **Multi-User**: Local data assigned to current user; family can share post-migration.

---

**Version**: 1.0 | **Author**: Hikari (Build Engineer) | **Date**: 2026-02-26
**Next Steps**: Implement Supabase schema, auth pages, migrate table logic.
