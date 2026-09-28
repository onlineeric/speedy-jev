# Developing Speedy Jev

Speedy Jev is built with [WXT](https://wxt.dev) (Vite-based, cross-browser MV3/MV2), React,
TypeScript and Vitest. One codebase targets Chrome, Edge (MV3) and Firefox (MV2).

## Getting started

```bash
pnpm install
```

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev build with hot reload for Chrome (`.output/chrome-mv3-dev`) |
| `pnpm dev:edge` / `dev:firefox` | Same for Edge / Firefox |
| `pnpm build` | Production build for Chrome (`.output/chrome-mv3`) |
| `pnpm build:edge` / `build:firefox` | Production build for Edge / Firefox |
| `pnpm zip` (`:edge`, `:firefox`) | Zip a build for store upload |
| `pnpm test` | Run unit tests once |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests with coverage report |
| `pnpm compile` | Type-check |
| `pnpm icons` | Regenerate `public/icon/*.png` from `resources/speedy-jev-icon.svg` |

### Load the extension locally

**Chrome / Edge**

1. Run `pnpm dev` (or `pnpm build`).
2. Open `chrome://extensions` (or `edge://extensions`) and turn on **Developer mode**.
3. Click **Load unpacked** and pick `.output/chrome-mv3-dev` (or `.output/chrome-mv3`).
   On WSL the folder is at `\\wsl.localhost\<distro>\<path-to-repo>\.output\...`.
4. Pin Speedy Jev, open **Settings**, and paste your Jev API key.

**Firefox**

1. Run `pnpm build:firefox`.
2. Open `about:debugging#/runtime/this-firefox` → **Load Temporary Add-on…**
3. Pick `.output/firefox-mv2/manifest.json`.

By default `pnpm dev` opens a fresh browser with the extension installed. On WSL, where it
cannot launch a Windows browser, create a local (gitignored) `web-ext.config.ts`:

```ts
import { defineWebExtConfig } from 'wxt';

export default defineWebExtConfig({ disabled: true });
```

## How a click works

1. The popup reads the **selected text** from the active tab (via `activeTab` + `scripting`), or
   the **whole page text** when nothing is selected.
2. The text replaces every `{{text}}` placeholder in the request body template. Substitution
   happens on the **parsed JSON**, so quotes and newlines in the page text never break the request.
3. The body is POSTed to `https://api.typesafe.ai/v1/systemone` and the typed answers are shown.
4. The captured text is copied to the clipboard while the request runs (unless turned off).

The cost estimate uses the **Input price** setting, because TypeSafe has no pricing API
(`GET /v1/models` returns only names, descriptions and release dates).

## Security invariants

- The API key is saved in `browser.storage.local` (never `sync`).
- The key is only sent in the `Authorization` header to `https://api.typesafe.ai`. The endpoint is
  hard-coded, and the manifest only grants host access to `https://api.typesafe.ai/*`.
- No content scripts. The page is read with `activeTab` + `scripting`, only on click.
- Jev responses are rendered as text (React escaping), never as HTML.

## Architecture

```
src/
├── entrypoints/            # WXT entrypoints: one folder per extension page
│   ├── popup/              # Toolbar popup: runs the analysis and shows results
│   └── options/            # Settings page: API key + request template
├── features/               # Framework-free logic, grouped by domain
│   ├── analyze/            # Use case: capture → fill template → call Jev
│   ├── clipboard/          # Copy text to the clipboard
│   ├── jev-api/            # HTTP client, response types, errors, answer formatting
│   ├── page-capture/       # Read selection / page text from the active tab
│   ├── pricing/            # Request cost estimate and USD formatting
│   ├── request-template/   # Default template, validation, {{text}} substitution
│   └── settings/           # Typed storage items (API key, template, input price, clipboard)
├── components/             # Reusable React components
├── hooks/                  # Reusable React hooks
└── styles/                 # Shared CSS (theme tokens, light/dark)
```

Guidelines:

- **`features/` has no React.** UI entrypoints call into features; features never import UI.
  This keeps logic unit-testable and reusable from future entrypoints (context menu, side panel,
  keyboard shortcut, background worker).
- **One job per module.** E.g. `jev-client.ts` only does HTTP, `format-answer.ts` only formats.
- **Explicit imports.** WXT auto-imports are disabled (`imports: false`) so every dependency is
  visible.
- **Tests sit next to the code** (`*.test.ts(x)`). Browser APIs are faked with WXT's
  `fakeBrowser`, which is reset before every test.

### Extending

| To add… | Do this |
| --- | --- |
| A new setting | Add a `storage.defineItem` in `features/settings/settings-storage.ts` and a form in `entrypoints/options/` |
| A new way to trigger analysis (context menu, shortcut) | Add a WXT entrypoint (e.g. `entrypoints/background.ts`) that calls `features/analyze` |
| A new Jev answer type | Add the type to `jev-types.ts` and a case in `format-answer.ts` |
| Multiple templates | Change `requestTemplateSetting` to a list, add a storage `version` + migration |
