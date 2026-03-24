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
