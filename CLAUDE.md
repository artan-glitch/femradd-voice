# FemraDD — Zëri i Gruas Shqiptare

Albanian women's online magazine. React + Vite + TypeScript + Tailwind CSS + shadcn/ui.

## Tech Stack

- **Framework:** React 18 + TypeScript + Vite (SWC)
- **Styling:** Tailwind CSS with CSS custom properties (HSL), shadcn/ui components
- **Fonts:** DM Sans (headings + body), Lora (logo only) — loaded via Google Fonts
- **Routing:** react-router-dom v6
- **State/Data:** @tanstack/react-query, react-hook-form + zod
- **Icons:** lucide-react
- **Dark mode:** class-based via next-themes

## Dev Server

```bash
npm run dev    # runs on port 8080
```

## Project Structure

```
src/
├── components/   # Reusable UI (HeroArticle, ArticleCard, Footer, Logo, NewsletterForm, etc.)
├── pages/        # Route pages (Index, ArticlePage, CategoryPage, About, Contact, etc.)
├── data/         # Static article/author data
├── hooks/        # Custom React hooks
├── lib/          # Utility functions (formatDateAlbanian, etc.)
├── assets/       # Images and static assets
└── index.css     # Tailwind base + theme tokens
```

## Design System

- **Color palette:** Terracotta/orange primary (`--primary: 14 52% 52%`), warm rose secondary, sage accent
- **Light mode bg:** Cream (`--background: 36 33% 97%`)
- **Dark mode bg:** Charcoal (`--background: 220 25% 7%`)
- **Footer:** Hardcoded dark bg (`bg-[hsl(220,20%,14%)]` light / `dark:bg-[hsl(220,18%,8%)]` dark) with cream text
- **Links:** Global orange hover color via `index.css` (`a:hover { color: hsl(var(--primary)); }`)
- **Text on dark backgrounds:** Always use hardcoded `text-white` or `text-[hsl(36,33%,97%)]` — never `text-primary-foreground` (it resolves to dark in dark mode)

## Important Conventions

- Language: Albanian (sq). All UI text in Albanian.
- Date format: Albanian months via `formatDateAlbanian()` in `src/lib/utils.ts`
- Article dates: Always show "Përditësuar" (updated) date unconditionally
- Hero images: Use gradient overlay (`from-black/80 via-black/30 to-transparent`) + drop shadows for text readability
- Footer links: Bold on hover (`hover:font-semibold`)
- No Playfair Display font — removed entirely, DM Sans everywhere
- Newsletter form exists in hero variant (terracotta bg) and default variant

## Build

```bash
npm run build      # production build
npm run preview    # preview production build
```

Chunks split: vendor-react, vendor-query, vendor-ui.

## New Article Checklist

When publishing a new article, ALWAYS follow these steps:

### 1. Create article content
- Add `src/data/articles/content/{slug}.json` with full HTML content
- All internal links must use `/artikull/{slug}` format (never old WordPress URLs)
- All images must use local paths `/images/articles/{slug}.webp` (never external URLs)
- Every `<img>` tag must have a descriptive `alt` attribute

### 2. Add article entry
- Add entry to `src/data/articles/index.ts` with all required fields:
  - `slug` — URL-friendly, lowercase, no special chars
  - `title` — 30-60 characters (will append " — FemraDD" = keep under 55 chars)
  - `description` — 120-155 characters (meta description)
  - `content` — import from content JSON
  - `image` — `/images/articles/{slug}.webp`
  - `category` — must match existing category slug
  - `author` — must match existing author slug
  - `date` / `updatedDate` — ISO format
  - `readTime` — e.g. "5 min lexim"

### 3. Add article image
- Place hero image at `public/images/articles/{slug}.webp`
- Image should be 16:9 ratio, optimized WebP, under 200KB
- Can use Nano Banana API (key in session) to generate if needed

### 4. SEO verification before push
- Title: 30-60 chars (not too long, not too short)
- Meta description: 120-155 chars
- All `<img>` tags have `alt` text
- No links to non-existent pages
- No external image URLs (wp-content, etc.)
- Article has correct `category` so CategoryNavLinks works
- For English articles: set `lang: "en"` in article data

### 5. Deploy
- Push to `main` branch — Vercel auto-deploys in ~30 seconds
- Verify at `https://www.femradd.com/artikull/{slug}`
- Check that canonical, OG tags, and title are correct in page source

### 6. Post-deploy
- Submit new URL to Google Search Console (URL Inspection → Request Indexing)
- Verify in Ahrefs that no new errors appeared

## Deployment

- **Platform:** Vercel (CDN, auto-deploy on push to main)
- **Domain:** www.femradd.com (DNS on Hostpoint, A record → 76.76.21.21)
- **Build:** `npm run build` → generates static HTML with SEO meta injection
- **Pre-render:** `scripts/inject-meta.mjs` injects per-page title, canonical, OG tags, description, and article body HTML into static files
- **Analytics:** Google Analytics (GA4), Plausible, Microsoft Clarity, Google Search Console verified
- **Health Score:** Ahrefs 100/100 — do NOT break this
