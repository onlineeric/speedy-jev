# Speedy Jev

A fast, lightweight browser extension that sends the selected text (or the whole page) to
[Jev by TypeSafe AI](https://docs.typesafe.ai) and shows the typed answers in the popup.
Bring your own API key.

Targets Chrome, Edge and Firefox from a single codebase.

## How it works

1. Click the toolbar icon.
2. The popup reads the **selected text** from the active tab, or the **whole page text** when
   nothing is selected.
3. The text replaces every `{{text}}` placeholder in your request body template.
4. The body is POSTed to `https://api.typesafe.ai/v1/systemone` and the answers are shown.

Configure your API key and the request template on the **Settings** page (Settings button in the
popup, or right-click the icon → Options).

The popup also shows the input token count and an estimated cost. TypeSafe has no pricing API
(`GET /v1/models` returns only names, descriptions and release dates), so the price comes from
the **Input price** setting. It defaults to Jev 1.13's $0.042 per million input tokens (output
tokens are free), and you can update it when [the price](https://docs.typesafe.ai/models)
changes.

## Getting started

```bash
npm install
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev build with hot reload for Chrome (`.output/chrome-mv3-dev`) |
| `npm run dev:edge` / `dev:firefox` | Same for Edge / Firefox |
| `npm run build` | Production build for Chrome (`.output/chrome-mv3`) |
| `npm run build:edge` / `build:firefox` | Production build for Edge / Firefox |
| `npm run zip` (`:edge`, `:firefox`) | Zip a build for store upload |
| `npm test` | Run unit tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run compile` | Type-check |

### Load the extension locally

**Chrome / Edge**

1. Run `npm run dev` (or `npm run build`).
2. Open `chrome://extensions` (or `edge://extensions`) and turn on **Developer mode**.
3. Click **Load unpacked** and pick `.output/chrome-mv3-dev` (or `.output/chrome-mv3`).
   On WSL the folder is at `\\wsl.localhost\<distro>\<path-to-repo>\.output\...`.
4. Pin Speedy Jev, open **Settings**, and paste your Jev API key.

**Firefox**

1. Run `npm run build:firefox`.
2. Open `about:debugging#/runtime/this-firefox` → **Load Temporary Add-on…**
3. Pick `.output/firefox-mv2/manifest.json`.

By default `npm run dev` opens a fresh browser with the extension installed. On WSL, where it
cannot launch a Windows browser, create a local (gitignored) `web-ext.config.ts`:

```ts
import { defineWebExtConfig } from 'wxt';

export default defineWebExtConfig({ disabled: true });
```

## Request template

The default template asks three example questions (one of each Jev question type):

```json
{
  "model": "jev-latest",
  "state": "{{text}}",
  "questions": {
    "sentiment": { "type": "score", "instructions": "...", "criteria": ["Very negative", "..."] },
    "content_type": { "type": "choice", "instructions": "...", "criteria": { "news": "..." } },
    "is_actionable": { "type": "noul", "instructions": "..." }
  }
}
```

- `{{text}}` can appear in any string value, any number of times, including inside a larger
  string (for example `"Title: {{text}}"`).
- Substitution happens on the parsed JSON, so quotes and newlines in the page text never break
  the request.
- See the [Jev API reference](https://docs.typesafe.ai/api) for question types.

## Security

- The API key is saved in `browser.storage.local`. Only this extension can read it, it stays on
  this device, and it is never synced to your browser account.
- The key is only ever sent in the `Authorization` header to `https://api.typesafe.ai`. The
  endpoint is hard-coded (not configurable), and the manifest only grants host access to
  `https://api.typesafe.ai/*`.
- The page is read with `activeTab` + `scripting`, and only when you click the extension. There
  are no content scripts running on every page.
- Jev's responses are rendered as text (React escaping), never as HTML.

## Architecture

Built with [WXT](https://wxt.dev) (Vite-based, cross-browser MV3/MV2), React, TypeScript and
Vitest.

```
src/
├── entrypoints/            # WXT entrypoints: one folder per extension page
│   ├── popup/              # Toolbar popup: runs the analysis and shows results
│   └── options/            # Settings page: API key + request template
├── features/               # Framework-free logic, grouped by domain
│   ├── analyze/            # Use case: capture → fill template → call Jev
│   ├── jev-api/            # HTTP client, response types, errors, answer formatting
│   ├── page-capture/       # Read selection / page text from the active tab
│   ├── pricing/            # Request cost estimate and USD formatting
│   ├── request-template/   # Default template, validation, {{text}} substitution
│   └── settings/           # Typed storage items (API key, template, input price)
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

## Known limitations (v1)

- One request template at a time.
- Only the top frame is read (text inside iframes is not captured).
- Text selected inside `<input>` / `<textarea>` fields is not treated as a selection.
- Closing the popup cancels an in-flight request.
- Uses WXT's placeholder icons.
