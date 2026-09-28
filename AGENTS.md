# AGENTS.md

This file provides guidance to Claude Code (claude.ai/code), Codex CLI and other AI agents when working with code in this repository.
Claude Code will use this AGENTS.md file only, not CLAUDE.md, for better compartable with other AI agents.

Speedy Jev is a WXT + React + TypeScript browser extension (Chrome/Edge/Firefox). The popup captures the active tab's selected text (or whole page text), substitutes it into a user-editable JSON request template, POSTs it to Jev (`https://api.typesafe.ai/v1/systemone`), and renders the typed answers. See `README.md` for full details.

## Principles

- **Performance first.** Every design and coding decision must weigh performance first: popup startup time, bundle size, and work done per click.
- **One codebase for Chrome, Edge and Firefox.** Code must work in all three: Chrome/Edge build as MV3, Firefox as MV2. Use WXT's `browser` (from `wxt/browser`), never `chrome.*`, and only use APIs and manifest keys all three support.
- **Tests before done.** Before finishing any change, add or update unit tests that cover the important behavior, and make sure `pnpm test` passes.

## Commands

- `pnpm dev` — dev build with hot reload (Chrome, `.output/chrome-mv3-dev`); `dev:edge` / `dev:firefox`
- `pnpm build` — production build; `build:edge` / `build:firefox`
- `pnpm test` — run all tests once (Vitest, happy-dom)
- `pnpm vitest run src/features/jev-api/jev-client.test.ts` — run a single test file (`-t "<name>"` to filter)
- `pnpm test:coverage` — tests with coverage report
- `pnpm compile` — type-check (`tsc --noEmit`)

## Architecture rules

- **`src/features/` is framework-free** (no React). Entrypoints (`src/entrypoints/popup`, `options`) and `src/hooks` call into features; features never import UI.
- Flow: `hooks/use-analyze-active-page.ts` → `features/analyze/analyze-page.ts` (load settings → capture text → fill template → `sendToJev`). Dependencies are injectable via `AnalyzeOptions.dependencies` for testing.
- `readSelectionOrPageText` in `features/page-capture` is serialized into the page via `scripting.executeScript` — it must stay self-contained (no imports or outer variables).
- `{{text}}` substitution happens on the **parsed JSON**, not the raw string, so page text can't break the request.
- Settings are `storage.defineItem` items in `features/settings/settings-storage.ts`, always in `local:` (never `sync:`).
- **WXT auto-imports are disabled** (`imports: false`): import everything explicitly, e.g. `browser` from `wxt/browser`, `storage` from `wxt/utils/storage`.
- Security invariants: the Jev endpoint is hard-coded, host permission is only `https://api.typesafe.ai/*`, no content scripts (uses `activeTab` + `scripting` on click), and Jev responses are rendered as text, never HTML.

## Testing

Tests sit next to source (`*.test.ts(x)`). Browser APIs use WXT's `fakeBrowser` (reset before each test in `vitest.setup.ts`).
