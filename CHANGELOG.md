# Changelog

All notable changes to Speedy Jev are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-10-10

### Added

- "Open Typesafe Console" button at the right of the popup header. It opens
  <https://console.typesafe.ai/home> in a new browser tab.

### Changed

- The popup header buttons are now icon-only, each with a tooltip: **Settings** uses a gear icon
  and **Run again** uses a refresh icon.

## [1.0.0] - 2026-09-29

First public release.

### Added

- One-click analysis from the toolbar popup: Speedy Jev captures the selected text, or the whole
  page when nothing is selected, and sends it to Jev by TypeSafe AI.
- Typed answers for yes/no, multiple-choice and score questions, shown with their probability or
  confidence.
- Editable JSON request template on the Settings page. `{{text}}` is replaced with the captured
  text.
- Example questions for sentiment, content type and call to action, used until you write your own.
- Settings page to store your own Jev API key on your device.
- Token usage and estimated cost for every result, with a configurable input price.
- Option to copy the captured text to the clipboard.
- Collapsible views of the captured text and the raw Jev response.
- Extension version shown in the popup.
- Builds for Chrome and Edge (Manifest V3) and Firefox (Manifest V2).
- Privacy policy ([PRIVACY.md](PRIVACY.md)).

[1.1.0]: https://github.com/onlineeric/speedy-jev/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/onlineeric/speedy-jev/releases/tag/v1.0.0
