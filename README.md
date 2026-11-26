# Abdul Moiz Portfolio

Premium personal portfolio for Abdul Moiz: video editor, designer, and MERN
stack developer. Phase 1 is a fully static site; all content comes from
`docs/about.json`.

The current direction is a cinematic, dark-first glass studio: neutral graphite
surfaces in dark mode, cool paper in light mode, soft frosted panes on selected
surfaces, a cool-blue ambient background light and precise typography. Glass is
deliberately not applied to everything, and there is no interactive accent
color anywhere in the project.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16.4.6 (App Router, TypeScript, Turbopack) |
| Styling | Tailwind CSS 4.3.3 |
| Components | shadcn/ui 4.23.0 (Base UI, restyled) |
| Motion | GSAP 3.15.1 + ScrollTrigger, `@gsap/react`, Lenis 1.3.27 |
| 3D | Three.js 0.187 + `@react-three/fiber` 9 + `@react-three/drei` 10 are installed but not currently rendered; the hero ring is removed |
| Icons | Lucide React + authentic local tool marks |
| Validation | Zod 4 |
| Package manager | pnpm 12 |
| Deploy target | Vercel |

## Commands

```bash
pnpm install       # install dependencies
pnpm dev           # sync content and start the dev server
pnpm build         # sync content and build for production
pnpm start         # run the production build
pnpm lint          # ESLint
pnpm typecheck     # tsc --noEmit
pnpm check         # lint, typecheck, build
pnpm sync:about    # copy docs/about.json to src/data/about.json
```

`predev` and `prebuild` run `sync:about` automatically. Edit content in
`docs/about.json`; `src/data/about.json` is generated and must not be edited by
hand.

## Content flow

```text
docs/about.json
  -> scripts/sync-about.mjs
  -> src/data/about.json
  -> src/lib/about.ts (Zod validation + types + getters)
  -> section components
  -> UI
```

Components never import the raw JSON. Missing or empty content renders nothing
or a defined empty state; it never falls back to invented content. This is why
the empty Work previews, hidden Certifications section and limited Contact
channels are intentional.

## Structure

```text
src/
  app/
    layout.tsx              fonts, metadata, theme init, smooth scroll, skip link
    page.tsx                composes the header and all sections
    globals.css             glass tokens, typography, section and responsive styles
  components/
    motion/                 hero entrance, scroll/mask/image reveals, hover effects,
                            scroll progress, smooth scroll
    sections/               site header, hero, tools marquee, about, journey, work,
                            skills, certifications, contact, footer
    ui/                     restyled shadcn components
    social-links.tsx        social controls and empty-link filtering
    tool-mark.tsx           authentic brand marks and discipline icons
    theme-toggle.tsx        persisted light and dark theme control
  data/about.json           generated from docs/about.json
  lib/
    about.ts                Zod schema, types, getters
    gsap.ts                 plugin registration and shared defaults
    utils.ts                cn helper
public/media/               portrait, tool icons, project screenshots and future showreel
docs/                       product, design, architecture, content
.opencode/skills/           installed agent skills
scripts/sync-about.mjs      content sync
```

## Site sections

Hero, tools marquee, About (three role panels), Journey (experience and
education), Work, Skills, Certifications (hidden while empty), Contact and
Footer. The header navigation follows the same page order: About, Journey,
Work, Skills, Contact.

## Skills installed

| Skill | Source |
| --- | --- |
| `frontend-design` | [anthropics/skills](https://github.com/anthropics/skills) |
| `gsap-core` | [greensock/gsap-skills](https://github.com/greensock/gsap-skills) |
| `gsap-timeline` | official GreenSock skills |
| `gsap-scrolltrigger` | official GreenSock skills |
| `gsap-plugins` | official GreenSock skills |
| `gsap-utils` | official GreenSock skills |
| `gsap-react` | official GreenSock skills |
| `gsap-performance` | official GreenSock skills |
| `gsap-frameworks` | official GreenSock skills |

Skill files live in `.opencode/skills/`. Licenses are included beside them.
Read `frontend-design` before writing UI and the relevant GSAP skill before
writing motion code.

## Design decisions

Decided by the owner:

1. **No accent color:** there is no `--accent` token. Focus and selection use
   the foreground color; primary actions are border-only at rest and gain a
   subtle neutral glass background on hover or focus.
2. **Typeface:** Bricolage Grotesque for main headings, Inter for body copy, UI
   labels and navigation. Display headings keep deliberate negative tracking.
3. **Theme:** light and dark, dark by default. The header toggle persists the
   choice and the blocking theme script prevents a wrong-theme flash.
4. **Hero:** a symmetrical, premium and minimal centered composition: location
   pill, circular portrait, full unbroken name on one line, short bio,
   border-only primary action with social links, and the masked role cycle.
   Both themes use restrained glass surfaces.
5. **About reel:** the Developer terminal, Designer selection artifact and
   Video Editor timeline with film tape are permanent. Keep this section;
   improve it only with the owner's direction.
6. **Header:** floating glass command bar with the full name as the brand.
   Navigation follows page order: About, Journey, Work, Skills, Contact. The
   mobile menu is a full-screen frosted sheet with the real location and
   available social links.
7. **Journey:** experience and education come only from `about.json`; the
   section hides when both arrays are empty.
8. **Work:** an editorial gallery. Supplied screenshots get a rounded preview;
   projects without one are set as text. No filler projects.
9. **Skills:** development is a two-column index, creative tools a vertical
   list and disciplines a chip row. No percentage bars.
10. **Contact:** only real channels. The form is Phase 2.
11. **Glassmorphism:** soft, rounded, low-opacity glass on the scrolled header,
    hero pill and portrait halo, Journey panels, supplied Work previews, Contact
    card and footer. No hard borders: a diagonal sheen, one top edge highlight,
    faint inner diffusion and a broad shadow make the panes read as real glass.
    Marquee and Skills stay on the base surface.
12. **Ambient light:** blurred cool-blue light layers sit behind overlapping
    content and drift slowly via transform-only animation, so the glass has
    moving depth to refract. The wash lives in the background only; the
    interactive palette stays neutral. Reduced motion stops the drift.
13. **Motion:** bottom-to-top masked text reveals on scroll, transform and
    opacity only. Reduced motion keeps everything visible and still.
14. **Footer:** real name, role and location, section navigation, available
    social links and a back-to-top action.

Still open:

1. **Showreel, featured work, certifications, contact details.** Showreel,
   videos, email, phone, availability and certifications are `null` or empty in
   `docs/about.json`. Do not invent them; the UI shows defined empty states or
   hides the section. The two supplied project screenshots are static files, so
   they do not track later UI changes to the live projects; a refresh process
   is still open.
2. **Public contact links.** GitHub is the only available social URL at the
   moment; the other entries remain hidden until the owner fills them in.

## Quality gates

Before a section is marked done:

```bash
pnpm check
```

Then check manually at 320px, 375px, 768px and 1440px in both themes. Verify
keyboard focus, the mobile menu, reduced motion, touch target sizes and the
absence of horizontal overflow. Respect the Lighthouse targets in
`docs/PRD.md`.
