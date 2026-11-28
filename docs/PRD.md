# PRD: Abdul Moiz Portfolio

## Goal
A premium personal portfolio that proves skill by being itself a piece of craft. A visitor should feel the quality within the first scroll and leave with a clear picture: Abdul Moiz designs, edits and builds.

## Audience
- Potential clients for video editing, design and web work
- Collaborators and founders looking for a creative who can also build
- Anyone who finds him through a hackathon, GitHub or social profile

## Positioning
AI Creative Designer who builds. Creative background (videography since age 10-11, editing, graphic design, filmmaking, photography, 3D animation) combined with MERN web development. Long-term he is a founder, not an employee; the site should read as a creator's studio page, not a job application.

## Scope (Phase 1)
Fully static, content from `docs/about.json`. No backend. Supabase (contact form storage, analytics, CMS) is Phase 2.

## Sections
1. **Hero.** A symmetrical, premium and minimal composition on one centered axis: a location pill above a circular portrait, the full unbroken name, a short bio, a border-only primary action with the available social links, then the role line with its masked cycle. The name reveals as a unit and may move subtly with desktop scrolling; the portrait stays still after its entrance. The palette is neutral: no accent color anywhere. The 3D ring was removed by the owner.
2. **Tools marquee.** Right-to-left typographic marquee of tool names between the hero and About. Use the authentic local brand marks that now exist in `public/media/tool-icons/` and keep every tool name visible. Pause control and a static wrapped fallback for reduced motion.
3. **About.** Three role panels from `about.roles` (Developer, Designer, Video Editor), each with its statement, description and real tools. The existing letter reveal and tool entrance remain. Do not fabricate UI backgrounds or add unsupported role claims.
4. **My Work.** Websites presented in an editorial two-column gallery with rounded rectangular preview areas. Use supplied screenshots only when available and clearly mark empty previews. Include authentic tool marks beside stack names. Videos appear with their real media in a simple responsive player. Showreel at the top when available. Source links use an accessible open-in-new-tab icon. If the project count is odd, leave the final cell empty rather than inventing a filler project. This section sits immediately after About because proof of work is the strongest signal for the audience.
5. **Skills.** Grouped as a development index, creative tools and disciplines. No percentage bars or raw graphs.
6. **Journey.** Real experience and education from `about.experience` and `about.education`, presented as two glass panels. Hide the section when both arrays are empty. Never invent dates, clients, programs or institutions. This is the owner's lowest-priority section and is placed after Skills; recruiters and other visitors may skip it.
7. **Certifications.** Rendered only from real entries in `about.json`. Hidden if the list is empty.
8. **Contact.** Real contact links from `about.json` only. The contact form is Phase 2. When email, phone or availability is null, do not display a placeholder that implies a working channel.
9. **Footer.** Real name, role, location and available social links.

## Header and navigation
- Floating glass command bar with the full name as the brand.
- Navigation follows page order: About, Work, Skills, Journey, Contact.
- Mobile menu is a full-screen frosted sheet with the same navigation, real location and available social links.
- Keyboard focus moves into the menu on open; Escape closes it and restores focus to the menu button.

## Requirements
- Responsive: mobile first, checked at 320, 375, 768 and 1440 pixels
- Light and dark themes with a visible, persisted toggle; dark is the default
- Both themes use restrained transparent glass surfaces with soft rounded corners. Glass is applied selectively where surfaces genuinely overlap or carry hierarchy; text-only content stays on the base surface.
- A soft cool-blue ambient light sits in the background through `--glow-cool` (with a gentler `--glow-warm`). This is background light only; interactive elements stay neutral.
- Bottom-to-top masked text reveals on scroll, driven by transform and opacity only, with a calm reduced-motion fallback.
- The footer is a proper closing surface with the real name, role, location, section navigation, available social links and a back-to-top action.
- No horizontal overflow at supported widths
- Every overlapping layer gets a background blur: header at rest and scrolled, frosted mobile menu, and a lighter blur on controls and links that sit over content
- Interactive targets at least 44 pixels where practical, especially header controls, social links and the primary action
- Lighthouse: Performance 90+, Accessibility 95+, SEO 95+ on mobile
- Respect `prefers-reduced-motion`: content stays visible, the marquee becomes a static wrapped list, and no entrance animation is required to see the page
- Animations must never block scrolling or drop below 60 fps on a mid-range phone
- Keyboard accessible, visible focus states, real alt text
- No content invented to fill an empty state or balance a grid

## Non-goals (Phase 1)
Blog, CMS, auth, backend, analytics dashboards.

## Decided
- No accent color on interactive UI. There is no `--accent` token. Neutral graphite and paper carry every state, including keyboard focus and selection. Soft cool-blue light in the background is ambient only, not an interactive accent.
- Typeface: Bricolage Grotesque for main headings only; Inter for body copy, UI labels and navigation
- Theme: light and dark, dark by default, preference persisted in the browser
- Visual direction: restrained cinematic glassmorphism, neutral graphite and paper surfaces, authentic tool marks and real content
- Header brand: full name
- Navigation order: About, Work, Skills, Journey, Contact
- Work directly follows About; Journey (experience and education) is the owner's lowest-priority section and sits after Skills
- About three-scene reel (Developer terminal, Designer selection artifact, Video Editor program monitor with a sprocketed filmstrip and layered timeline) is a permanent owner-requested feature. Keep it; improve it only with the owner's direction. The Video Editor visuals were rebuilt from scratch as CSS surfaces at the owner's request; the earlier 3D film-tape scene is retired.
- Primary action: border-only at rest, a subtle neutral glass background on hover and focus

## Open items (owner to decide, agent must not guess)
- Showreel video and which projects are featured
- Real project screenshots are supplied temporarily in `docs/Images/Project-thumbnails/` and wired into Work from `public/media/project-thumbnails/`. Static files do not track later UI changes to the live projects; a refresh process is still open.
- Real videos, a current portrait with a transparent background, and any auto-refreshing screenshot capture
- Certifications list
- Public contact email, phone, availability and social links
