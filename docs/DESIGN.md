# DESIGN.md

## Direction

A cinematic, dark-first portfolio for a maker who works across video, design and software. The page reads as three things in sequence: a **symmetrical title card**, a **three-scene reel**, and an **editorial program**. Real portrait, strong typography, deliberate pacing and generous negative space carry the identity. Keep the interface polished and quiet: no decorative grid, separator rules, dots, fake device frames or placeholder artwork.

Near-black graphite is the default; the optional light theme is cool paper. The interactive palette is strictly neutral. A soft cool-blue ambient light lives in the background only, and it drifts slowly behind the glass.

Use project imagery only when the owner supplies real screenshots. Without them, present projects as clean editorial text layouts. Every component takes its content from `about.json`; no invented content.

## Color

- Two theme palettes: near-black background with off-white text in dark mode, and cool paper with near-black text in light mode. Neutral surfaces carry the interface.
- **No accent color on interactive UI.** Do not define `--accent` or hardcode blue for controls. Keyboard focus (`--ring`) and text selection resolve to `--foreground`. Primary actions are border-only at rest and gain a subtle neutral background on hover or focus.
- **Ambient light is background only.** `--glow-cool` is a soft blue-cool wash and `--glow-warm` is a quieter counterweight. Both are broad, low-opacity and blurred. They are never used on controls, text or section markers.
- Do not repeat blue as decoration, section markers, glow washes on panels, or hover color for ordinary links.

## Typography

- Two strict roles, never mixed:
  - Bricolage Grotesque for main headings only.
  - Inter for all descriptions, paragraphs, UI labels and navigation.
- Never set body copy, the marquee or about text in the heading face. Never use Inter for a main heading.
- Display type is weight 500 or 600, never 700. Negative tracking around `-0.03em` to `-0.05em` is allowed at display sizes; no tight, sports-like display type.
- No all-caps, letter-spaced labels. Section labels and meta text are sentence case, small and muted. Do not join meta items with middle dots.
- Clear scale with real hierarchy: not everything big. Body text is never tiny.

## Layout

- 12-column grid, wide margins, large vertical rhythm.
- **Hero: symmetrical title card.** A single centered axis carries, in order: a small location pill, a circular portrait, the full unbroken name set large, a short bio, a border-only primary action with the available social links, and the role line with its masked cycle. Everything is centered and separated by whitespace, never rules. The portrait has no frame or drop shadow. The composition stays symmetrical, quiet and premium; the name is the one memorable element.
- **About: asymmetrical three-scene reel.** This is a permanent owner-requested feature. Pinned scroll with three frames, fade transitions and a different artifact per role: Developer uses a terminal, Designer uses a selection artifact, Video Editor uses a film tape with a timeline. Do not replace it; improve it only with direction. The section heading is offset, not a centered template.
- **Journey: two glass panels** for real experience and education, hidden when both arrays are empty.
- **Work: editorial program.** Projects are text-led entries with an intentional rhythm, not identical cards. A supplied screenshot gets a rounded glass preview; a project without one is set as text. No empty previews, no repeated titles, no filler projects.
- **Skills: typographic index.** Grouped lists on the 12-column grid with no card panels.
- **Contact: closing glass card** with one clear primary channel. If email and phone are absent, promote the available social profile. No invented contact details.
- **Footer: proper closing surface** with the real name, role, location, section navigation, available social links and a back-to-top action.
- No rounded bordered container around everything. Use space and type to separate.

## Glass system

Glassmorphism is selective, not a box around every section. Glass appears only on the scrolled header, hero location pill, Journey panels, supplied Work previews, Contact card and footer. The marquee, skills and text-only content stay on the base surface.

- Every pane uses the shared `--glass-*` tokens and `--radius-glass` (1.5rem). No sharp corners and no pane that dominates the composition.
- **Realistic glass has no hard border.** A visible 1px rounded border reads as a generic card and is not allowed. Instead: a soft diagonal specular sheen, one highlighted top edge, one shaded bottom edge for thickness, faint inner diffusion and a broad diffused shadow.
- Keep opacity low so the background reads through. Use `backdrop-filter` with blur and slight saturation; reduce the blur below 768px for performance.
- Blurred ambient light layers sit **behind overlapping content** (`body::before`, `.contact-section::before`, `.site-footer::before`) so glass refracts real depth instead of a flat fill. They drift slowly via transform-only animation and stop completely under reduced motion.
- Wherever fixed or floating content overlaps the page, apply a background blur. The header carries a light blur at rest and a stronger one when scrolled, with a masked blurred falloff below it so content eases under the bar. The mobile menu is a frosted sheet with a blurred backdrop. Anchor targets keep `scroll-margin-top` / `scroll-padding-top` clear of the header.
- The hero portrait carries one soft ambient halo. No frames, cards or drop shadows on the photo itself.

## Photo

Use the same real professional portrait in all states, with a controlled circular crop. The supplied file has a white background, not a transparent one; treat the circle as a clean photo plate until a transparent source is supplied. Never invent background removal that damages the subject.

## Motion

- One signature motion language across the site, with one surprise per section.
- Smooth scrolling (Lenis) plus GSAP ScrollTrigger.
- Text reveals bottom-to-top inside static overflow masks, driven by scroll position. Animate transform and opacity only. Never animate `filter`, `width`, `height`, `top` or `left`. `MaskReveal` requires the `.reveal-mask` / `.reveal-word` / `.reveal-char` CSS or the mask does nothing.
- Hero: one orchestrated entrance. The name reveals as a unit, the portrait resolves after it, and the baseline settles last. Subtle scroll parallax on the name only; the portrait stays still.
- About: pinned scroll, three frames, each with a unique entrance and exit driven by its artifact (terminal typing, selection draw, film-tape/timeline sweep).
- Do not add the same fade-and-slide-up entrance to every section. Section reveals follow the content: masked headings, a single line reveal, or no entrance at all.
- Lazy-load heavy assets (video, 3D scene).
- Respect `prefers-reduced-motion`: all content visible, no pinning, no typing, no marquee movement, no ambient drift.

## Hard don'ts

- No emojis.
- No decorative grids, repeated separator lines, dots, fake device mockups or raw placeholder graphics.
- No generic purple mesh or blurry AI-style gradient washes.
- No hard borders on glass panes and no color repeated throughout the page.
- No split hero name across separate corners, and no unanchored portrait cutout.
- No empty project preview cards when no screenshot exists.
- No numbered role markers; the three roles are facets, not a sequence.
- No REC blinking indicators.
- No raw graphs or skill percentage bars.
- No icon overuse and no tiny description text.
- No default shadcn look: restyle shadcn components to match this file.

## Components

Built with shadcn/ui as a base and custom components where needed. Every component takes its content from `about.json` through the typed loader.
