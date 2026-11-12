# CompassCEU

Continuing-education platform for California RNs, LVNs, CNAs and HHAs.
Next.js 16 (App Router) · Tailwind 4 · Supabase (Auth + Postgres).

## What works (learner side)

| Flow | Route |
| --- | --- |
| Create account / sign in / sign out | `/create-account`, `/sign-in` |
| Course catalog & detail | `/courses`, `/courses/[slug]` |
| **Mock checkout** (test mode, no charge) | `/checkout/[slug]` |
| My Courses dashboard (progress, CEUs, certificates) | `/dashboard` |
| Lesson player with saved progress | `/learn/[slug]`, `/learn/[slug]/[lesson]` |
| Final assessment (graded on the server, 70% to pass, unlimited retakes) | `/learn/[slug]/quiz` |
| Certificate — auto-issued on pass, printable / Save as PDF | `/certificates/[id]` |
| Public certificate verification | `/verify` |
| Profile (name + CA license no. shown on certificates) | `/account` |

Learner-only pages redirect to `/sign-in` and come back afterwards.

## Run it locally

1. **Install**
   ```bash
   npm install
   ```
2. **Create a Supabase project** (free) at https://supabase.com/dashboard.
3. **Create the tables:** Supabase → SQL Editor → New query → paste `supabase/schema.sql` → **Run**.
4. **Env vars:** open `.env.local` and paste your keys from
   Supabase → Project Settings → **API Keys** (Project URL, publishable key, secret key).
5. **Auth settings** (Supabase → Authentication):
   - *URL Configuration* → Site URL `http://localhost:3000`, and add `http://localhost:3000/auth/callback` to Redirect URLs.
   - Optional for faster testing: *Sign In / Providers → Email* → turn off **Confirm email** so new accounts sign in immediately.
6. **Start**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000. `COMING_SOON=false` shows the full site; remove it (or set `true`) to go back to the Coming Soon page.

### Quick test
Create account → open any course → **Enroll now** → *Complete test payment* → finish the 4 lessons → pass the assessment → **View certificate** → copy the ID into `/verify`.

## Where things live

- `src/lib/courses.ts` — catalog (titles, CEUs, USD prices — placeholders)
- `src/lib/content.ts` — lesson text + quiz questions/answers (**sample content**, server-only)
- `src/app/actions/` — Server Actions: auth, checkout, lesson progress, quiz grading, certificate issuing
- `src/lib/supabase/` — Supabase clients (user-scoped, admin/secret, proxy session refresh)
- `src/proxy.ts` — Coming Soon gate + session refresh + learner-page guard
- `supabase/schema.sql` — tables, Row Level Security, signup trigger, `verify_certificate()`

### Security notes
- Learners can only **read** their own rows (RLS). Enrollments, progress, quiz attempts and certificates are
  **written only by the server** with the secret key, so nobody can enroll for free or fake a certificate from the browser.
- Quiz answers never reach the browser; grading happens in `submitQuiz`.
- The public verify endpoint only exposes ID, holder name, course, CEUs and date.

## Before launch (not done yet)

- [ ] Real payments — replace `completeTestCheckout` in `src/app/actions/learning.ts` (Stripe Checkout + webhook)
- [ ] Real course content & quizzes from the client team (and BRN provider number in `src/lib/site.ts`)
- [ ] Confirm prices (USD) and whether certificates should say CEUs or contact hours
- [ ] Admin side (manage courses, learners, certificates, refunds)
- [ ] Transactional emails (enrollment receipt, certificate issued)
