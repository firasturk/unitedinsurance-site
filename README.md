# United Insurance Company — Website

Bilingual corporate website (Arabic default + English) for United Insurance Company.
Built with **React 19 + TanStack Start + Vite**, styled with Tailwind CSS v4, backed by a
Supabase project (database, auth, storage).

---

## 1. What is inside

```
├── src/                  # Application source code
│   ├── routes/           # Pages (each file = one URL)
│   ├── components/       # UI components (header, footer, hero, team, …)
│   ├── lib/              # i18n (translations), media helpers
│   ├── integrations/     # Generated database client (do not hand-edit)
│   └── styles.css        # Design tokens & global styles
├── supabase/
│   └── migrations/       # Database schema (run in filename order)
├── public/               # Static files served as-is
├── index.html
├── vite.config.ts
└── package.json
```

Main features: news system, six insurance-product pages, quote request flow,
complaints & whistleblowing forms, careers, annual reports, and a password-protected
admin dashboard at `/admin` for managing all content.

---

## 2. Requirements

- **Node.js 20+** and **Bun** (`https://bun.sh`) — or npm/pnpm if you prefer.
- A **Supabase project** (free tier is enough): https://supabase.com → New project.

---

## 3. Setup

### 3.1 Install dependencies

```bash
bun install        # or: npm install
```

### 3.2 Create `.env` in the project root

```
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your publishable (anon) key>
VITE_SUPABASE_PROJECT_ID=<your project ref>

SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_PUBLISHABLE_KEY=<your publishable (anon) key>
SUPABASE_SERVICE_ROLE_KEY=<your service_role key — server only, never expose>
```

All values are found in the Supabase dashboard → Project Settings → API.
See `.env.example` for the full list, including the chatbot key (`AI_API_KEY`).

### 3.3 Create the database schema

Apply the SQL files in `supabase/migrations/` **in filename order** (oldest first).
Either paste each file into the Supabase SQL editor, or use the CLI:

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

### 3.4 Create storage buckets

Create these **private** buckets in Supabase → Storage (no public access):

`articles`, `team`, `forms`, `insurance`, `logos`, `cvs`

Uploads go through the admin dashboard, which signs the URLs server-side.

### 3.5 Create the admin user

1. Supabase → Authentication → Users → **Add user** (email + password, confirm email).
2. Supabase → SQL editor:

```sql
insert into public.user_roles (user_id, role)
values ('<auth-user-uuid>', 'admin');
```

Only users with an `admin` row in `user_roles` can open `/admin`.

---

## 4. Run locally

```bash
bun run dev        # development server on http://localhost:8080
bun run build      # production build → dist/
bun run preview    # preview the production build
```

---

## 5. Deploy to a host

The production build (`bun run build`) outputs `dist/` containing a **Node.js server**
(`dist/server/index.mjs`). Ordinary shared hosting (cPanel "upload files") will **not**
run it — you need one of the following.

### Option A — Cloudflare (recommended, free tier works)

```bash
bunx wrangler deploy
```

Add the environment variables from `.env` in the Cloudflare dashboard
(Workers → Settings → Variables) as well. Then connect your domain:
Cloudflare → Workers → your worker → Custom Domains.

### Option B — Vercel / Netlify

Import the repository, set the build command to `bun run build` (output: `dist`),
and add the same environment variables in the project settings.

### Option C — VPS (GoDaddy VPS, DigitalOcean, Hetzner, …)

```bash
bun run build
node dist/server/index.mjs   # runs on port 3000 by default
```

Put Nginx (or Caddy) in front as a reverse proxy with HTTPS
(`certbot --nginx`), and keep the Node process alive with `pm2`:

```bash
npm i -g pm2
pm2 start dist/server/index.mjs --name united-site
pm2 save && pm2 startup
```

> Shared GoDaddy website hosting does **not** work — a VPS plan is required.

---

## 6. Connect the domain

1. Point DNS at your host:
   - **Cloudflare/Vercel:** follow their dashboard instructions (usually a CNAME or A record).
   - **VPS:** an A record to the server IP.
2. Add the domain in the host dashboard and issue the TLS certificate (automatic on Cloudflare/Vercel; `certbot` on a VPS).
3. If the domain already serves email (e.g. `uic@unitedjo.com`), **do not touch the MX records** — only add the website records.

---

## 7. Content & maintenance

- Everyday content (news, team, board, vacancies, reports, homepage texts, messages)
  is managed from the admin dashboard at `/admin` — no coding needed.
- Static texts and layout live in `src/routes/*` and `src/components/site/*`
  (translations are in `src/lib/i18n.tsx`).
- To migrate existing content from the previous database: export the tables
  (news, team members, partners, forms, messages, …) and the storage files, then
  import them into the new project — or simply re-enter them via `/admin`.

---

## 8. Notes

- The AI chatbot was removed (Oct 2026) — no AI key is needed.
- Changes made for self-hosting (Oct 2026): chat markdown renderer trimmed (code/math/mermaid
  plugins removed — server bundle 4 MB → 1.3 MB compressed, fits Cloudflare's free plan),
  "Continue with Google" removed from `/auth` (it depended on Lovable's auth broker),
  worker name set to `united-insurance`, chatbot removed entirely (widget, /api/chat, admin Chatbot tab).
- Never commit `.env` or expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.
