# Project Structure

## Top-Level Layout
```
rank360/
├── src/                  # All application source code
├── scripts/              # Standalone Node.js scripts (run outside Next.js)
├── public/               # Static assets
├── .kiro/                # Kiro steering and spec files
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind design tokens and theme
├── vercel.json           # Vercel cron job config
├── next-sitemap.config.js
└── .env.local            # Local environment variables (never commit)
```

## `src/` Directory
```
src/
├── app/                  # Next.js App Router – pages and API routes
│   ├── layout.js         # Root layout (Header, Footer, GA, AdSense)
│   ├── page.js           # Homepage
│   ├── globals.css       # Global styles
│   ├── news/
│   │   ├── page.js       # News listing page (paginated, filterable)
│   │   └── [slug]/
│   │       └── page.js   # Individual article page
│   ├── api/
│   │   ├── articles/     # GET /api/articles – paginated article feed
│   │   │   └── [slug]/   # GET /api/articles/[slug]
│   │   ├── live-updates/ # GET /api/live-updates
│   │   ├── scrape/       # GET /api/scrape – cron-triggered scraper endpoint
│   │   └── revalidate/   # GET /api/revalidate – on-demand ISR
│   ├── contact/
│   ├── privacy/
│   └── terms/
│
├── components/
│   ├── layout/           # Header, Footer (site-wide chrome)
│   ├── home/             # Page-specific sections (HeroSection, LatestGrid, etc.)
│   ├── ui/               # Reusable primitives (ArticleCard, CategoryBadge, etc.)
│   ├── ads/              # AdSenseScript, AdUnit
│   └── analytics/        # GoogleAnalytics
│
└── lib/
    ├── db.js             # Universal DB query function (Neon/pg auto-switch)
    ├── articles.js       # All article/category DB query functions
    └── utils.js          # cn(), date formatters, category metadata, SEO helpers, constants
```

## `scripts/` Directory
Standalone Node.js scripts that run outside the Next.js runtime. They use `require()` (CommonJS) and load `.env.local` via `dotenv`.

- `scraper.js` – RSS fetch → parse → categorise → insert pipeline
- `migrate.js` – Database schema migrations
- `test-db.js` – DB connection smoke test

## Key Conventions

### Imports
- Use the `@/` alias for all `src/` imports (e.g. `@/lib/utils`, `@/components/ui/ArticleCard`)
- Never use relative `../` paths across feature boundaries

### Components
- Server Components by default; add `"use client"` only when browser APIs or interactivity are needed
- Page-level data fetching happens directly in the page component (async server component), not in a separate data layer
- Component variants are handled via a `variant` prop (e.g. `ArticleCard` supports `"default"`, `"compact"`, `"horizontal"`)

### Data Access
- All DB queries go through `src/lib/articles.js` functions — never write raw SQL in page or component files
- Always import `query` from `src/lib/db.js`; never instantiate `pg` or `neon` directly elsewhere
- Wrap data fetches in `try/catch` in page components and degrade gracefully (empty arrays, `notFound()`)

### Styling
- Tailwind utility classes only — no CSS modules, no inline `style` props except for dynamic values
- Use `cn()` for any conditional or merged class strings
- Prefer brand tokens (`text-brand-muted`, `bg-brand-blue-light`) over raw Tailwind color classes

### SEO
- Every page exports `metadata` (static) or `generateMetadata` (dynamic)
- Article pages include JSON-LD via `buildJsonLd()` from `src/lib/utils.js`
- Canonical URLs always set via `alternates.canonical`

### API Routes
- Return `NextResponse.json()` with appropriate status codes
- Include `Cache-Control` headers on GET responses
- Protect sensitive endpoints with secret header checks (`CRON_SECRET`, `REVALIDATE_SECRET`)

### Categories
- The canonical category list is `CATEGORIES` exported from `src/lib/utils.js`: `["jee", "neet", "cuet", "admissions", "results", "news"]`
- Always use lowercase slugs for category values in the DB and URLs
- Use `getCategoryMeta()` / `getCategoryLabel()` / `getCategoryColor()` from `src/lib/utils.js` for display
