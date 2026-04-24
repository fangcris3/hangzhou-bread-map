# Cold Brew Map

Mushroom's Cold Brew Field Guide — a personal, editorial ranking of San Diego cold brew spots.
Styled like a vintage Japanese tourism pamphlet crossed with an indie zine.
This is NOT a tech product. It's a friend who takes coffee very seriously made you a guide.

## Tech Stack

- **Vite + React + TypeScript** — SPA, no routing library needed
- **Tailwind CSS** — utility-first styling; custom design tokens via `tailwind.config.ts`
- **shadcn/ui** — used only for admin mode UI (Dialog, Slider, Form components)
- **Deploy**: Vercel

## Project Structure

```
src/
  components/
    CoverPage/          # Magazine-style title spread
    CoffeeCard/         # Single store card component
    RatingBar/          # Bitter/Sweetness/Power bar display
    AdminPanel/         # Edit modal + data management
    MapView/            # (future) interactive map
  data/
    stores.ts           # Demo data + TypeScript types
    storage.ts          # localStorage read/write helpers
  styles/
    globals.css         # Tailwind base + CSS custom properties
  App.tsx
  main.tsx
```

## Design System

### Color Tokens (defined in `tailwind.config.ts` + `globals.css`)

| Token       | Value   | Use                        |
|-------------|---------|----------------------------|
| `cream`     | #FAF6F0 | Page background            |
| `espresso`  | #2C1810 | Primary text, borders      |
| `latte`     | #C4956A | Secondary brown accent     |
| `brick`     | #8B4A42 | Accent (ratings, tags)     |
| `fog`       | #E8E0D5 | Card backgrounds, dividers |
| `ink`       | #1A0F0A | Headings                   |

### Typography

| Role           | Font                  | Tailwind class   |
|----------------|-----------------------|------------------|
| Display/Hero   | Playfair Display      | `font-display`   |
| Body/Editorial | Lora or EB Garamond   | `font-serif`     |
| Data labels    | Courier Prime (mono)  | `font-mono`      |
| UI/System      | Inter (fallback)      | `font-sans`      |

Load via Google Fonts in `index.html`.

### Visual Language

- Warm cream base with paper texture overlay (`bg-texture` utility)
- Cards look like cutout photos placed on a corkboard — soft drop shadow, slight rotation allowed
- Rating bars use monospace labels: "BITTER/SOUR", "SWEETNESS", "POWER"
- Section transitions should feel like turning a magazine page
- Map numbers displayed as stamped circular badges

## Data Model

```typescript
interface Store {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  shortReview: string;   // 2-3 sentences, personal voice
  ratings: {
    bitter: number;      // 1-5
    sweetness: number;   // 1-5
    power: number;       // 1-5
  };
  photo: string;         // URL or base64
  mapNumber: number;
}
```

## State & Persistence

- All store data lives in `localStorage` key: `"coldbrewmap_stores"`
- On first load, seed from `src/data/stores.ts` demo data if localStorage is empty
- Admin mode enabled via `?admin=true` URL param
- No backend, no auth — this is a personal tool

## Admin Mode (`?admin=true`)

- Click any card → opens shadcn Dialog with edit form
- Drag & drop image upload → stores as base64 in localStorage
- Rating sliders (shadcn Slider, 1–5)
- Export all data as JSON download
- Import from JSON file upload

## Map Strategy

- **Phase 1 (current)**: Each card shows a `mapNumber` badge; optionally a static illustrated map image
- **Phase 2 (future)**: Add Leaflet or Mapbox embed with store pins — don't architect for this now

## Layout Philosophy

Single SPA. Sections scroll vertically but should feel like distinct magazine "pages":

1. **Cover** — full-viewport title spread
2. **Field Notes** — card grid of all stores
3. *(future)* **The Map** — illustrated or interactive map

Use `min-h-screen` sections and let content breathe. No tight grids — editorial spacing.

## Project Phases

### Phase 1 — Foundation (current)
1. **Design System**: Tailwind config + CSS custom properties for color tokens and typography
2. **Cover Page**: Full-viewport magazine title spread with hero coffee image placeholder
3. **Coffee Card**: Single card component with cutout photo, neighborhood tag, review text, rating bars
4. **Demo Data**: 3 placeholder stores (real San Diego neighborhoods) seeded into localStorage on first load
5. **Admin Mode** (`?admin=true`): Edit form per card, drag & drop image upload, rating sliders, JSON export/import

### Phase 2 — Visual refinement
- Build multiple layout/card variants side by side to compare and choose
- Paper texture, card rotation, stamped badge polish
- Section transitions (magazine page-turn feel)

### Phase 3 — Map
- Static illustrated map image with numbered pins matching card `mapNumber`
- Later: interactive Leaflet/Mapbox embed

### Phase 4 — Content
- Replace placeholder stores with real San Diego cold brew spots
- Add real photos via admin upload

## Key Rules

- **Tone first**: every copy choice should feel warm, personal, and opinionated — not neutral
- Reuse Tailwind tokens; never hardcode color hex values in JSX
- shadcn/ui is for admin scaffolding only — don't let it bleed into the public-facing design
- Card component must work with placeholder AND real image URLs
- Keep demo data realistic (real San Diego neighborhoods, plausible store names)
- CSS-only transitions where possible; no animation libraries
