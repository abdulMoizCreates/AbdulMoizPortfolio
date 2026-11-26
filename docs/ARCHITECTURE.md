# ARCHITECTURE.md

## Stack
- Next.js (App Router, latest stable) with TypeScript
- Tailwind CSS
- shadcn/ui (base, restyled) and custom components
- GSAP (core, ScrollTrigger) and Lenis for smooth scroll
- Three.js via `@react-three/fiber` and `@react-three/drei` is installed but not currently rendered; the About film-tape scene is not part of the current static pass. The hero 3D ring was removed by the owner.
- Lucide for interface actions and generic disciplines; authentic local brand marks in `public/media/tool-icons/` for named tools. Social links use Lucide symbols with accessible platform names.
- pnpm as package manager
- Deploy: Vercel
- Phase 2: Supabase (contact form, analytics)

Confirm package versions are compatible with each other and the Next.js version before building.

## Data flow
`docs/about.json` is the only content source. The predev and prebuild scripts copy it to `src/data/about.json`.

A typed loader `src/lib/about.ts` validates it (zod) and exports typed getters. Components never import the raw JSON directly.

```
docs/about.json
  -> scripts/sync-about.mjs
  -> src/data/about.json
  -> src/lib/about.ts (types + validation + getters)
  -> section component
  -> UI
```

If a key is missing or empty, the section renders nothing or a defined empty state. It never falls back to invented content. Certifications hide when empty; Work keeps an honest preview empty state; Contact shows only real channels.

## Folder structure
```
src/
  app/
    layout.tsx        fonts, metadata, theme init, smooth scroll, skip link
    page.tsx          composes the header and sections in order
    globals.css       tokens, glass system, section styles, responsive rules
  components/
    sections/         SiteHeader, Hero, ToolsMarquee, About, Journey, Work,
                      Skills, Certifications, Contact, Footer
    ui/               shadcn components (restyled)
    motion/           hero entrance, scroll reveal, mask reveal, image reveal,
                      hover effects, scroll progress, smooth scroll, count up,
                      draw line
    social-links.tsx  social controls and empty-link filtering
    tool-mark.tsx     authentic brand marks and discipline icons
    theme-toggle.tsx  persisted light and dark theme control
  data/about.json     generated from docs/about.json
  lib/
    about.ts          schema, types, getters
    gsap.ts           plugin registration, shared defaults
    utils.ts
public/
  media/              portrait, tool icons, future showreel and screenshots
docs/                 these files
```

## Conventions
- Server components by default; `"use client"` only for animated or interactive parts.
- GSAP code lives in `useGSAP` or `useLayoutEffect` with proper cleanup (`gsap.context`, matchMedia revert, ScrollTrigger cleanup on unmount).
- Register plugins once in `lib/gsap.ts`.
- Images through `next/image`; videos use poster frames and lazy loading. No video is rendered until the owner supplies real media.
- Design tokens only through CSS variables; no hardcoded colors or font names in components.
- Glass surfaces use the shared `--glass-*` tokens and `--radius-glass` on the scrolled header, hero pill, Journey panels, supplied Work previews, Contact card and footer only. Ambient background light uses `--glow-cool` and `--glow-warm`. There is no accent token; focus (`--ring`) and selection resolve to `--foreground`, and primary actions are border-only at rest.
- Mobile backdrop blur is reduced below 768px for performance. The visual language stays the same.
- Typeface: Bricolage Grotesque through `next/font` for main headings (`--font-heading`); Inter for body, descriptions and UI (`--font-sans`). Fonts load through `next/font`.
- Theme: light tokens on `:root`, dark tokens under `.dark`. A blocking script in `layout.tsx` restores the persisted theme before paint; `theme-toggle.tsx` toggles the class and `color-scheme`. Dark is the default.
- Header navigation order is About, Journey, Work, Skills, Contact. The mobile menu uses a native dialog, locks document scroll, focuses the first navigation link on open and restores focus on close.
- Monochrome brand marks get a `data-brand` attribute; dark mode inverts only the marks that need it for contrast.
- Use the shared hero surface and portrait-plate gradient tokens rather than one-off gradients.
- `prefers-reduced-motion` must keep all content visible, stop the marquee and render the tools as a static wrapped list.
- Interactive targets are at least 44px where practical, including header controls, social links, source links and the primary action.

## Quality gates (run before marking a section done)
`pnpm check` (lint, typecheck and build), then a manual check at 320px, 375px, 768px and 1440px in both themes. Verify keyboard focus, the mobile menu, reduced motion and the absence of horizontal overflow.
