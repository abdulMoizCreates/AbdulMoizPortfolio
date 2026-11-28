# AGENTS.md

Rules for any AI coding agent working on this repo. Read this first, every session.

## Read order
1. `docs/AGENTS.md` (this file)
2. `docs/PRD.md` (what we build)
3. `docs/DESIGN.md` (how it looks and moves)
4. `docs/ARCHITECTURE.md` (how it is structured)
5. `docs/about.json` (all content; the only source of truth for text, links, projects)

## First-time setup
- Install Anthropic's skills (at least `frontend-design`) and a motion/GSAP skill if available. Read them before writing any UI.
- Install every dependency listed in `docs/ARCHITECTURE.md`. Confirm versions work together before building.

## Hard rules
1. **No invented content.** Never make up certifications, projects, testimonials, numbers, links, quotes or dates. If it is not in `about.json`, do not render it. If something is missing, leave a clearly marked empty state or ask the owner.
2. **One section at a time.** Finish, polish and verify one section before starting the next. Do not touch other sections while working on one.
3. **Follow DESIGN.md exactly.** Do not "redesign". If you think a design choice is wrong, say so with a reason and evidence, then wait for the owner's decision. The owner wants to be corrected when he is wrong, backed by research.
4. **Do the full change.** When asked for a change, make it fully. Small cosmetic tweaks that leave the result basically the same count as a failure.
5. **Do not repeat mistakes.** Check the Mistakes Log below before starting. Add every new mistake to it.
6. **Data-driven.** All content comes from `about.json` through the typed loader. No hardcoded text in components.
7. **Do not break what works.** Before finishing, run build, lint and typecheck. Fix errors you caused.
8. **No emojis anywhere** (UI, code comments, commits).

## Section workflow
1. Plan briefly (what, which components, which data keys).
2. Build static UI from `about.json`, mobile first, then desktop.
3. Polish: spacing, type hierarchy, states (hover, focus, empty, loading).
4. Add motion (see DESIGN.md motion rules).
5. Check performance and accessibility (see PRD.md targets).
6. Update the tracker below, then stop and report.

## Tracker
| Section | Status |
|---|---|
| Project setup | done |
| Global layout, theme, fonts, smooth scroll | done |
| Header, navigation, mobile menu | done (full name brand; About, Work, Skills, Journey, Contact order shared by header and footer; real location and focus restore in mobile menu) |
| Hero | done (symmetrical, premium and minimal: circular portrait, full name, bio, border-only neutral action, socials, masked role cycle; location removed from hero and carried by the footer) |
| Tools marquee | done |
| About (3 roles) | done (three-scene reel: developer terminal, cinematic design artboard with selection/palette/layers, and a recreated CSS edit suite with a graded program monitor, sprocketed filmstrip, live timecode and a layered waveform timeline — permanent, do not replace) |
| My Work (websites + videos) | done (two supplied static screenshots wired in; placed directly after About) |
| Skills | done |
| Journey (experience + education) | done (styled as two glass panels; moved after Skills as the owner's lowest-priority section) |
| Certifications | done (hidden until real entries exist) |
| Contact | done |
| Footer | done (carries the real location removed from the hero) |
| Final polish, responsive and accessibility pass | in progress (`pnpm check` passes; 375/768/1440 verified in headless Chrome, including header glass and horizontal overflow; 320 and reduced-motion spot checks still pending) |
| SEO and deploy | ready |

## Mistakes Log
Previous agent passes failed in these ways. Do not repeat them.
- Redesigned everything instead of following the given design.
- Used a different accent color and overused the accent.
- Used completely different fonts than specified.
- Invented certifications and other content.
- Made only about 10 percent of the requested change.
- Output felt generic: default shadcn look, rounded bordered cards everywhere, generic purple mesh or blur AI gradients.
- Repeated accent color throughout the design. Current owner direction reserves blue for the primary action and keyboard focus; see `docs/DESIGN.md`.
- Added decorative grids, dots, separator rules and rough CSS artwork. Keep the current direction cinematic and quiet; remove decoration that does not come from real portfolio content.
- Used fake laptop and phone frames without real project screenshots. Show the project details cleanly and only show media supplied in `about.json`.
- Relied on Next's generated `LayoutProps` global before the generated types existed, which broke standalone `pnpm typecheck`. Use explicit prop types or run the build first.
- Audited touch targets only at the default size. Media-query overrides later shrank the hero CTA and social button below 44px at 375 and 320; re-measure computed sizes at every breakpoint after the final CSS.
- Misread a scroll-restored reduced-motion screenshot as hidden hero content. Check `scrollY` and reset to the top before diagnosing motion fallbacks.
- Left dark monochrome brand marks invisible on graphite. Give GitHub, Next.js, Express, Vercel and Socket.IO a theme-aware contrast treatment.
- Typed a `pointermove` listener as `(event: PointerEvent)` on an element returned by `closest()`; TypeScript rejects it because `ElementEventMap` has no `pointermove`. Type the handler as `(event: Event)` and cast to `PointerEvent` inside.
- Marked a section done while its component was neither mounted in `page.tsx` nor styled in `globals.css` (Journey). Verify the rendered page and the CSS for every tracker row.
- Used `meta.brand` ('Portfolio 2026') as the header brand instead of `identity.fullName`, and let navigation order drift from About, Work, Skills, Journey, Contact.
- Reintroduced a decorative accent color against the owner's no-accent direction. The palette is strictly neutral; focus, selection and primary actions use neutral tokens.
- Wrote an invalid CSS selector by placing `@media` inside a comma-separated selector list. Keep reduced-motion and no-JS fallbacks in separate blocks.
- Left supplied screenshots unused in `docs/Images`; content must flow through `about.json` and `public/media`.
- Used `MaskReveal` without its `.reveal-mask` / `.reveal-word` / `.reveal-char` CSS, so the mask never hid the text. Always add the mask CSS with the component.
- Animated `filter: blur()` in a text reveal despite the transform-and-opacity-only rule.
- Put glass panes around every section. Glassmorphism here is selective: overlapping surfaces and hierarchy only, never a box around text-only content.
- Made glass panes as generic rounded boxes with a visible 1px border. Realistic glass has no hard border: soft sheen, one top edge highlight, faint inner diffusion, broad shadow, and low opacity so the background blends through. Blurred ambient light layers belong behind overlapping content.
- Wrote literal `backdrop-filter` values in `globals.css`. The Turbopack dev CSS pipeline rewrites them to `-webkit-backdrop-filter` only, which Chrome ignores, so the glass looked flat in dev while production was fine. Store the filter in a custom property (`--header-blur: blur(28px) saturate(150%)`) and apply `backdrop-filter: var(--header-blur)`; the variable form emits both prefixed and unprefixed in dev and production.
- Let an ambient pseudo-element bleed sideways with `inset: 0 -8%`. That added exactly 8% to `document.scrollWidth` at every breakpoint. Keep ambient layers inside the section box, or clip the section, and measure `scrollWidth` against `clientWidth` after adding one.
- Ran `pnpm build` while `next dev` was running. The dev server kept serving stale CSS after that. Restart `next dev` after any production build before judging visual changes.
- Ignored a sub-pixel horizontal overflow from a decorative cursor at the viewport edge. `html { overflow-x: clip }` is the safe global guard; verify the page still scrolls vertically and pinned sections still pin.
- Let the designer scene's art and copy auto-place into two grid rows because the art sits in earlier columns but comes later in the DOM. Set `grid-row: 1` explicitly on `.about-scene-copy` and `.about-scene-art` whenever the artifact is left of the copy.
- Left the mobile and reduced-motion video scene without a viewer, so the HUD floated over the timeline. Render the static CSS film-strip fallback when the 3D tape is disabled, and gate the GSAP progress line on `tapeEnabled`.
- Gated the entire pinned About setup on `[data-film-progress]`, which only mounts after `tapeEnabled` flips to true, so pinning never started. Treat late-mounted elements as optional in the guard, animate them conditionally, and keep the `useGSAP` dependency array constant in size.
- Mutated `camera.position` from `useThree()` inside `useFrame`; the hooks lint rule rejects it. Mirror the camera into a ref in an effect and mutate `cameraRef.current` in the frame loop, the same pattern used for CanvasTexture offsets.
- Left the video artifact as a thin dark ribbon with no visible frames. A monitor needs a graded still behind the film, brighter frame captions, and a low twist so the frames face the camera; otherwise it reads as raw even with post-processing. Resolved by replacing the 3D ribbon with a CSS program monitor, sprocketed filmstrip and layered timeline.

## Permanent owner decisions (do not revert without asking)
- The About **three-scene reel** is permanent: Developer terminal, Designer selection artifact, and Video Editor edit suite with a program monitor, sprocketed filmstrip and timeline. Do not replace it; improve it only with the owner's direction. The owner asked to recreate the Video Editor visuals from scratch, so the old 3D film-tape component was removed in favor of a refined CSS-built suite.
- The palette is strictly neutral. There is no accent color anywhere.
- The hero stays symmetrical, premium and minimal on one centered axis. Iterate on it, but keep that character.
- The header brand is the full name; navigation order is About, Work, Skills, Journey, Contact, shared with the footer through `src/lib/navigation.ts`.
- Work sits directly after About because proof of work is the strongest signal. Journey (experience and education) is the owner's lowest-priority section and sits after Skills; recruiters and other visitors may ignore it. Do not move Journey back above Work.
- Project screenshots are currently static files. The owner wants a refresh path so they track later UI changes to the live projects.
- The site is now a glassmorphism upgrade: soft rounded glass on selected surfaces only, a cool-blue ambient background light that drifts slowly behind overlapping content, bottom-to-top scroll text reveals, and a proper footer. Keep it minimal and never make the panes dominate.
- The fixed header overlaps page content by design. Blur whatever sits under it (stronger when scrolled) and keep anchor targets clear of it; the mobile menu is a frosted sheet too.
- Ambient blue background light is allowed. Blue on interactive controls is not; there is still no `--accent` token.
