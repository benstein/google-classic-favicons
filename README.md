# Google Workspace Classic Favicons

A Chrome extension that puts the 2020-era Google Workspace favicons back on the seven core apps after the 2026 redesign:

- Gmail
- Calendar
- Drive
- Docs
- Sheets
- Slides
- Meet

## Install (unpacked)

1. Open `chrome://extensions` in Chrome.
2. Toggle **Developer mode** on (top right).
3. Click **Load unpacked** and pick this folder.
4. Reload any open Workspace tabs.

That's it. The old favicons should appear in the tab bar immediately.

## How it works

A content script runs at `document_start` on each Workspace app. It picks the right bundled PNG based on the hostname (and path, for the three Docs Editors), strips any favicon links the page injects, and adds its own pointing to a `chrome-extension://` URL. A `MutationObserver` keeps the swap in place when Google later re-injects or rewrites favicon links.

## Known limitations

- **Gmail unread badge**: the live unread-count number that Google overlays on the favicon is gone. The tab shows the classic Gmail M instead.
- **Calendar date number**: same trade-off. The favicon always shows the classic "31" graphic, not today's date.
- **Forms, Keep, Chat, Sites**: not covered. Add a content-script match and a bundled icon if you want them.
- **Chrome only**: Manifest V3 content scripts; should port to Edge unchanged, would need adaptation for Firefox.

## Files

```
manifest.json     # MV3 manifest
content.js        # the favicon-swapping content script
icons/            # 64x64 PNGs for each app + the extension's own icons
src-svg/          # source SVGs from Wikimedia Commons (not loaded at runtime)
```

## Updating an icon

Drop a replacement SVG into `src-svg/` and re-render:

```sh
magick -background none -density 384 src-svg/<app>.svg \
  -resize 64x64 -gravity center -extent 64x64 icons/<app>.png
```

## Source

Icons are the 2020 Workspace product logos from Wikimedia Commons. See `src-svg/` for the originals.
