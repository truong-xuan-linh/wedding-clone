# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run start    # Start production server
```

## Architecture

This is a Next.js (Pages Router) clone of a CineLove wedding invitation page (Huy & Mai, wedding date: January 3, 2026).

### Key files

- `pages/index.tsx` — Main page. Injects the full page HTML via `dangerouslySetInnerHTML` and attaches all interactive behavior in a `useEffect`.
- `lib/pageContent.ts` — Auto-generated file containing the entire rendered page HTML as a template literal. This is the source of truth for page markup.
- `pages/_document.tsx` — HTML head (meta tags, favicon, CSS link).
- `pages/_app.tsx` — Imports minimal `styles/globals.css`.
- `public/css/globals.css` — All page CSS (~418KB). Served as a static file via `<link>` in `_document.tsx` to bypass PostCSS processing. Contains: Ant Design CSS variables, all component styles, Tailwind base, Cropper.js, and all custom font `@font-face` declarations.
- `public/assets/` — Local images (photos, icons, audio-control icon, etc.).

### CSS approach

The full CSS is in `public/css/globals.css` and linked as a static stylesheet. It is **not** processed through PostCSS/webpack — this is intentional because the file is too large (418KB) and contains patterns that conflict with PostCSS (base64 strings, non-standard comments that were cleaned up). Do not move it back to `styles/` or import it via `_app.tsx`.

### Interactivity

All JavaScript interactivity is implemented in `pages/index.tsx` inside a single `useEffect`:

- **Audio toggle** — `#audio-control-wrapper` click plays/pauses the background music (hosted on `assets.cinelove.me`)
- **Auto-scroll** — `#auto-scroll-play` click toggles smooth auto-scrolling of `.styles_customScroll__X5r6w`
- **Envelope animation** — `.envelope-container` click toggles `close`/`open` CSS classes
- **Countdown timer** — Updates `.jsx-3272123691.countdown.componentBOX` children every second toward `WEDDING_DATE` (2026-01-03T10:00:00+07:00)

### External dependencies

- Background music: `https://assets.cinelove.me/audio/...mp3`
- Template background images: `https://assets.cinelove.me/templates/...`
- Uploaded photos (couple photos): `https://assets.cinelove.me/uploads/...` or in `public/assets/`
- Custom fonts (Aquarelle, Carlytte, Signora, etc.): `https://assets.cinelove.me/fonts/...`
