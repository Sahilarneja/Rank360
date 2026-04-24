# Tech Stack

## Framework & Runtime
- **Next.js 14** (App Router) – React 18, server components by default
- **Node.js** – runtime for scripts and API routes
- **JavaScript** (no TypeScript) – JSX with `.js`/`.jsx` extensions

## Database
- **PostgreSQL** – primary data store
- **Neon** (`@neondatabase/serverless`) in production – HTTP driver, auto-detected when `DATABASE_URL` contains `neon.tech`
- **`pg` Pool** in local dev – standard TCP connection
- DB client abstraction lives in `src/lib/db.js`; always import `query` from there, never instantiate drivers directly

## Styling
- **Tailwind CSS v3** – utility-first, no CSS modules
- Custom design tokens defined in `tailwind.config.js` under `theme.extend`:
  - Colors: `brand.blue`, `brand.red`, `brand.dark`, `brand.muted`, `brand.border`, etc.
  - Border radius: `rounded-news`, `rounded-news-lg`
  - Shadows: `shadow-card`, `shadow-card-hover`, `shadow-hero`
  - Animations: `ticker`, `fade-in`, `slide-up`, `pulse-dot`
- Use `cn()` from `src/lib/utils.js` (wraps `clsx` + `tailwind-merge`) for conditional class merging

## Key Libraries
| Package | Purpose |
|---|---|
| `date-fns` | Date formatting (`formatRelativeTime`, `formatDate`, etc.) |
| `clsx` + `tailwind-merge` | Conditional class merging via `cn()` |
| `slugify` | Slug generation |
| `sharp` | Image optimisation (Next.js Image) |
| `next-sitemap` | Sitemap + robots.txt generation |

## Rendering Strategy
- **ISR (Incremental Static Regeneration)** is the default pattern
  - Homepage: `export const revalidate = 300` (5 min)
  - Article pages: `export const revalidate = 3600` (1 hr)
- **`generateStaticParams`** used on article pages; returns `[]` gracefully if DB is unavailable at build time
- API routes use `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`

## Deployment
- **Vercel** – production host
- Vercel Cron (`vercel.json`) triggers `/api/scrape` every 30 minutes
- `/api/scrape` is protected by `Authorization: Bearer <CRON_SECRET>`
- On-demand revalidation via `/api/revalidate` protected by `REVALIDATE_SECRET`

## Environment Variables
See `.env.example` for the full list. Key vars:
- `DATABASE_URL` – Postgres connection string
- `NEXT_PUBLIC_SITE_URL` – canonical site URL
- `NEXT_PUBLIC_GA_ID` – Google Analytics measurement ID
- `NEXT_PUBLIC_ADSENSE_ID` – AdSense publisher ID
- `REVALIDATE_SECRET` – on-demand ISR secret
- `CRON_SECRET` – cron endpoint auth secret

## Common Commands
```bash
# Development
npm run dev           # Start dev server (localhost:3000)

# Production
npm run build         # Build for production
npm run start         # Start production server

# Code quality
npm run lint          # ESLint (next lint)

# Database
npm run db:migrate    # Run migrations (node scripts/migrate.js)

# Content
npm run scrape        # Run RSS scraper manually (node scripts/scraper.js)
```
