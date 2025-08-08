PR: Handle‑Claim → Clerk → Artist Select → Dashboard (Scaffold)

Branch name: feature/handle-claim-flow

Summary: Replace homepage artist search with a handle‑claim input. Pass handle through Clerk auth, finish onboarding with artist selection, then land in dashboard. Roll out behind a Statsig gate.

⸻

1. File Tree (new/changed)

app/
page.tsx # MOD: gate old search; show ClaimHandleForm when flag on
onboarding/
claim/
page.tsx # NEW: artist search + confirm mapping
api/
spotify/
search/route.ts # NEW: server route for artist search
components/
ClaimHandleForm.tsx # NEW: homepage handle input + availability check
constants/
reserved-handles.ts # NEW: disallowed handle list
lib/
feature-flags.ts # MOD: add handle_claim_enabled gate
spotify.ts # NEW: client creds helper w/ token cache
supabase-server.ts # (exists) ensure a server client helper is available; if not, add
app/actions/
check-handle.ts # NEW: server action → handle availability
claim-handle.ts # NEW: server action → persist handle post-auth
link-artist.ts # NEW: server action → link selected artist to profile
middleware.ts # MOD: short‑circuit reserved handle slugs if needed
supabase/
migrations/
20250807_handle_claim.sql # NEW: add handle to profiles + constraints + RLS
tests/
e2e/
onboarding-handle.spec.ts # NEW: Playwright happy path
docs/
ONBOARDING_HANDLE_FLOW.md # NEW: dev doc (this summary + notes)
CHANGELOG.md # MOD: add entry
README.md # MOD: update onboarding section

⸻

2. Feature flag (Statsig)

Add a gate: handle_claim_enabled.

// lib/feature-flags.ts (additions)
export type FeatureFlags = {
waitlistEnabled: boolean
debugBannerEnabled: boolean
// ...
handleClaimEnabled: boolean
}

export async function getFeatureFlags(): Promise<FeatureFlags> {
// existing bootstrapping …
return {
// existing flags …
handleClaimEnabled: await getGate('handle_claim_enabled'),
}
}

Rollout plan: dev=ON, preview=staged, prod=OFF (flip once metrics look good).

⸻

3. Homepage component swap

// app/page.tsx (excerpt)
import { ClaimHandleForm } from '@/components/ClaimHandleForm'
import { getFeatureFlags } from '@/lib/feature-flags'

export default async function HomePage() {
const { handleClaimEnabled } = await getFeatureFlags()

return (

<main>
{handleClaimEnabled ? (
<section className="mx-auto max-w-xl py-24">
<h1 className="text-4xl font-semibold mb-6">Claim your handle</h1>
<ClaimHandleForm />
</section>
) : (
// TODO: existing artist-search hero (unchanged)
<ExistingArtistSearchHero />
)}
</main>
)
}

⸻

4. ClaimHandleForm

// components/ClaimHandleForm.tsx
'use client'
import { useState } from 'react'
import { z } from 'zod'
import { reservedHandles } from '@/constants/reserved-handles'

const schema = z
.string()
.trim()
.toLowerCase()
.min(3)
.max(30)
.regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])$/)
.refine((h) => !reservedHandles.has(h), 'That handle is reserved.')

export function ClaimHandleForm() {
const [handle, setHandle] = useState('')
const [checking, setChecking] = useState(false)
const [available, setAvailable] = useState<boolean | null>(null)
const [error, setError] = useState<string | null>(null)

async function check() {
setChecking(true)
setError(null)
try {
const res = await fetch('/actions/check-handle', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ handle }),
})
const data = await res.json()
setAvailable(data.available)
if (!data.available && data.reason) setError(data.reason)
} finally {
setChecking(false)
}
}

async function submit(e: React.FormEvent) {
e.preventDefault()
const parsed = schema.safeParse(handle)
if (!parsed.success) {
setError(parsed.error.issues[0]?.message ?? 'Invalid handle')
return
}
// Forward to Clerk auth with handle as query param
const qp = new URLSearchParams({ handle: parsed.data })
window.location.href = `/sign-in?redirect_url=/onboarding/claim?${qp}`
// If you use Clerk components on a dedicated route, use their afterSignIn/UpUrl config
}

return (

<form onSubmit={submit} className="flex flex-col gap-3">
<div className="flex items-center gap-2">
<span className="text-xl">jov.ie/</span>
<input
value={handle}
onChange={(e) => setHandle(e.target.value)}
onBlur={check}
placeholder="your-handle"
className="flex-1 rounded-xl border px-4 py-3 text-lg"
/>
</div>
{checking && <p>Checking…</p>}
{available === true && <p className="text-green-600">Available ✓</p>}
{error && <p className="text-red-600">{error}</p>}
<button className="rounded-xl px-4 py-3 text-base font-medium border">Claim handle</button>
</form>
)
}

⸻

5. Server actions (API stubs)

// app/actions/check-handle.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { reservedHandles } from '@/constants/reserved-handles'

export async function POST(req: NextRequest) {
const { handle } = await req.json()
const h = String(handle ?? '').trim().toLowerCase()
if (!h) return NextResponse.json({ available: false, reason: 'Handle required' })
if (reservedHandles.has(h)) return NextResponse.json({ available: false, reason: 'Reserved' })
const supabase = createClient()
const { data, error } = await supabase
.from('profiles')
.select('id')
.ilike('handle', h)
.maybeSingle()
if (error) return NextResponse.json({ available: false, reason: 'Error' })
return NextResponse.json({ available: !data })
}

// app/actions/claim-handle.ts
'use server'
import { auth } from '@clerk/nextjs'
import { createClient } from '@/lib/supabase-server'

export async function claimHandle(handle: string) {
const { userId } = auth()
if (!userId) throw new Error('Unauthorized')
const h = handle.trim().toLowerCase()
const supabase = createClient()
// unique, case-insensitive
const { error } = await supabase.rpc('set_user_handle', { p_user_id: userId, p_handle: h })
if (error) throw error
}

// app/actions/link-artist.ts
'use server'
import { auth } from '@clerk/nextjs'
import { createClient } from '@/lib/supabase-server'

type Artist = { id: string; name: string; images?: { url: string }[] }

export async function linkArtist(artist: Artist) {
const { userId } = auth()
if (!userId) throw new Error('Unauthorized')
const supabase = createClient()
const { error } = await supabase
.from('profiles')
.update({ artist_spotify_id: artist.id, artist_name: artist.name })
.eq('id', userId)
if (error) throw error
}

⸻

6. Onboarding page

// app/onboarding/claim/page.tsx
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'
import { claimHandle } from '@/app/actions/claim-handle'
import { ArtistSearch } from './search'

export default async function ClaimOnboarding({ searchParams }: { searchParams: { handle?: string } }) {
const { userId } = auth()
if (!userId) redirect('/sign-in')

const handle = (searchParams.handle ?? '').toLowerCase()
if (handle) await claimHandle(handle)

return (

<div className="mx-auto max-w-3xl py-12">
<h1 className="text-3xl font-semibold">Choose your artist</h1>
<p className="text-sm text-muted-foreground mb-6">Handle locked: <strong>{handle}</strong></p>
<ArtistSearch />
</div>
)
}

// app/onboarding/claim/search.tsx
'use client'
import { useState } from 'react'
import { linkArtist } from '@/app/actions/link-artist'

export function ArtistSearch() {
const [q, setQ] = useState('')
const [results, setResults] = useState<any[]>([])

async function search() {
const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(q)}`)
const data = await res.json()
setResults(data.items ?? [])
}

async function select(a: any) {
await linkArtist({ id: a.id, name: a.name, images: a.images })
window.location.href = '/dashboard'
}

return (

<div className="flex flex-col gap-3">
<div className="flex gap-2">
<input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search Spotify artists"
className="flex-1 rounded-xl border px-4 py-3" />
<button onClick={search} className="rounded-xl border px-4">Search</button>
</div>
<ul className="divide-y">
{results.map((a) => (
<li key={a.id} className="py-3 flex items-center justify-between">
<div>
<div className="font-medium">{a.name}</div>
<div className="text-xs opacity-70">{a.followers?.total ?? 0} followers</div>
</div>
<button className="border rounded-lg px-3 py-2" onClick={() => select(a)}>Select</button>
</li>
))}
</ul>
</div>
)
}

⸻

7. Spotify search route

// app/api/spotify/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSpotifyToken } from '@/lib/spotify'

export async function GET(req: NextRequest) {
const q = req.nextUrl.searchParams.get('q') || ''
const token = await getSpotifyToken()
const r = await fetch(`https://api.spotify.com/v1/search?type=artist&limit=10&q=${encodeURIComponent(q)}`, {
headers: { Authorization: `Bearer ${token}` },
cache: 'no-store',
})
const data = await r.json()
return NextResponse.json({ items: data?.artists?.items ?? [] })
}

// lib/spotify.ts
let \_token: { value: string; exp: number } | null = null
export async function getSpotifyToken() {
const now = Math.floor(Date.now() / 1000)
if (\_token && \_token.exp > now + 30) return \_token.value
const res = await fetch('https://accounts.spotify.com/api/token', {
method: 'POST',
headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
body: new URLSearchParams({
grant_type: 'client_credentials',
client_id: process.env.SPOTIFY_CLIENT_ID!,
client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
}),
cache: 'no-store',
})
const json = await res.json()
\_token = { value: json.access_token, exp: now + json.expires_in }
return \_token.value
}

⸻

8. Reserved handles

// constants/reserved-handles.ts
export const reservedHandles = new Set<string>([
'admin','root','login','logout','signin','signup','api','dashboard','settings','legal','terms','privacy','about','pricing','help','support','static','assets','_next','vercel','preview'
])

⸻

9. Middleware (optional guard)

// middleware.ts (snippet — add before existing matcher logic if needed)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { reservedHandles } from '@/constants/reserved-handles'

export function middleware(req: NextRequest) {
const { pathname } = req.nextUrl
const m = pathname.match(/^\/(?:@)?([a-z0-9][a-z0-9-]\*[a-z0-9])$/)
if (m && reservedHandles.has(m[1])) {
return NextResponse.redirect(new URL('/', req.url))
}
return NextResponse.next()
}

⸻

10. Supabase migration

-- supabase/migrations/20250807_handle_claim.sql
-- 1) handle column (case-insensitive unique)
create extension if not exists citext;
alter table public.profiles add column if not exists handle citext;
alter table public.profiles add constraint profiles_handle_key unique (handle);

-- 2) basic RLS helper function to set handle once (idempotent; changeable until first set)
create or replace function public.set_user_handle(p_user_id uuid, p_handle citext)
returns void language plpgsql security definer as $$
begin
-- deny reserved list on server too (simple example — mirror app list as a table for production)
if lower(p_handle) in ('admin','root','login','logout','signin','signup','api','dashboard','settings','legal','terms','privacy','about','pricing','help','support','static','assets','\_next','vercel','preview') then
raise exception 'reserved handle';
end if;

update public.profiles
set handle = lower(p_handle)
where id = p_user_id
and (handle is null or handle = lower(p_handle));
if not found then
raise exception 'handle taken or cannot change';
end if;
end;

$$
;

-- 3) index to speed lookups (even with citext)
create index if not exists profiles_handle_lower_idx on public.profiles (lower(handle));

If profiles table doesn’t exist, add a migration to create it with id uuid primary key default auth.uid() and appropriate RLS policies (omitted here for brevity).

⸻

11) Playwright happy‑path test (stub)

// tests/e2e/onboarding-handle.spec.ts
import { test, expect } from '@playwright/test'

test('handle claim → auth → select artist → dashboard', async ({ page }) => {
  await page.goto('/')
  // Assume flag forces new experience in CI
  await page.fill('input[placeholder="your-handle"]', 'timwhite')
  await page.click('text=Claim handle')
  // Stub Clerk in CI or use test accounts; skip to onboarding route
  await page.goto('/onboarding/claim?handle=timwhite')
  await page.fill('input[placeholder="Search Spotify artists"]', 'Tim White')
  await page.click('text=Search')
  // Mock API and click first result
  // … mock network …
  await page.click('text=Select')
  await expect(page).toHaveURL('/dashboard')
})


⸻

12) README + CHANGELOG
	•	Update README “Onboarding” to reflect handle‑first flow.
	•	CHANGELOG entry: feat: handle‑claim onboarding behind gate

⸻

13) Clerk routing
	•	Configure Clerk sign‑in/up to respect redirect_url (or set afterSignInUrl/afterSignUpUrl to /onboarding/claim).
	•	Ensure the Clerk components/pages used in your project forward the handle param.

⸻

14) Rollout checklist
	•	Gate on preview → smoke test
	•	Backfill existing users with handle if missing
	•	404/UX states for taken handles
	•	Analytics: handle_claim_started, auth_completed, artist_selected, onboarding_completed
	•	Remove homepage artist search after rollout

⸻

15) Commit plan
	1.	feat(flags): add handle_claim_enabled
	2.	feat(home): ClaimHandleForm + server actions
	3.	feat(onboarding): claim page + artist search API
	4.	feat(db): add handle column + proc + index
	5.	test(e2e): handle claim flow
	6.	docs: update README + changelog

⸻

16) AI Prompt (drop into Cursor/Claude)

Implement the “handle‑claim flow” using the scaffolded files. Keep coding style and imports consistent with the repo. Ensure CI passes.
	•	Validate handle with Zod and reserved list
	•	Use server actions for check-handle, claim-handle, link-artist
	•	Pass handle through Clerk auth to /onboarding/claim
	•	Build Spotify artist search with client‑credentials flow
	•	Persist {user_id, handle, artist_spotify_id} in Supabase using set_user_handle
	•	Add Playwright e2e and wire flag handle_claim_enabled
	•	Update docs and changelog
$$
