# Agent Instructions

Read `docs/AGENTS.md` first, every session. It is the source of truth for the
read order, hard rules, section workflow, tracker, and mistakes log.

Quick pointers:

- Build spec: `docs/PRD.md`
- Visual and motion direction: `docs/DESIGN.md`
- Stack, data flow, and folder structure: `docs/ARCHITECTURE.md`
- Portfolio content: `docs/about.json` (the only content source)
- Installed skills: `.opencode/skills/` (Anthropic `frontend-design` plus the
  official GreenSock GSAP skills)
- Quality gate: `pnpm check`

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
