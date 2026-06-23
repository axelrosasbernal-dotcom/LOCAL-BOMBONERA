# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server at localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build locally
npm run lint     # ESLint check
```

Deploy is handled by Vercel, connected to GitHub repo `axelrosasbernal-dotcom/LOCAL-BOMBONERA` (master branch auto-deploys to production).

## Stack

- **React 18** + **Vite 8** — no TypeScript
- **CSS Modules** — every component has a co-located `.module.css`; no Tailwind, no styled-components
- **React Router v7** (single route: `/` → `Home`)
- **Supabase** — client in `src/services/supabase.js`; auth context in `src/context/AuthContext.jsx` (currently unused in UI)
- **ThemeContext** (`src/context/ThemeContext.jsx`) — persists `dark`/`light` to `localStorage`, sets `data-theme` on `<html>`; light-mode overrides are in `global.css` under `[data-theme="light"]`

## Architecture

```
src/
  context/        AuthContext, ThemeContext
  data/products.js  — single source of truth for categories + products
  components/
    layout/       Navbar, Layout (Outlet wrapper)
    sections/     Hero, Categories, FeaturedProducts, ContactFooter
    ui/           ProductCard
  pages/Home.jsx  — composes sections, owns activeCategory state
  styles/global.css — CSS custom properties (colors, radii, shadows, transitions)
  utils/formatters.js
```

**Data flow:** `products.js` exports `categories`, `products`, `featured`. `Home` owns filter state (`activeCategory`) and passes it down to `Categories` (selection) and `FeaturedProducts` (filtering). `ProductCard` builds a per-product WhatsApp URL directly.

## Business context

Local de comidas "Burguer's La Bombonera", Oruro, Bolivia. WhatsApp numbers: `+591 77289212` (central) and `+591 75711571` (sucursal). Currency: Bolivianos (Bs.). Two physical locations: Tarapacá esq. León and Tarapacá entre Sucre y Murguia.

## Conventions

- Prices in `products.js` are plain integers (Bs.)
- Images live in `public/images/` and are referenced as `/images/filename.jpg`
- No TypeScript; no test suite currently
- `formatters.js` uses `es-AR` locale (legacy — local currency is Bs., not ARS)
