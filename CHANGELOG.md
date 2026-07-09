# Changelog

## 1.1.0

- Change: default autosave delay is now 10 seconds (was 1s) — fewer surprise saves while typing; adjust it in Options
- Under the hood: extension size cut from 2.26MB to 0.87MB — icon fonts replaced by a 2.7KB subset of the icons actually used
- Under the hood: Playwright end-to-end test suite (7 scenarios) and GitLab CI on every merge request
- Under the hood: build output moved from `.output/` to `dist/` (WXT `outDir`)

## 1.0.0

Full rewrite for Manifest V3 (Chrome removes MV2 extensions from the store on Aug 31, 2026).

- **Breaking: styles saved in 0.x versions are not carried over.** Storage starts fresh on update.
- Rewritten with WXT + TypeScript; background page replaced by a service worker
- New Material 3 UI (Beer CSS): Editor / Options / FAQ / About tabs
- Editor upgraded to CodeMirror 6 — autocomplete, css-tree-based linting, bracket matching
- Live preview: the open page restyles as you type (auto-save)
- Removed: Google sign-in / Firebase profiles, Log tab, omnibox keyword
- Permissions reduced to `storage` + host access only

## 0.2.3

- Under the hood: Changed few permissions and background page for operate with Google Firebase
- Added: Profile page, with Google login
- Added: Google Firebase, for store accounts/options, now only store profiles

## 0.2.2

- Added: Alert message if storage for page are full, or text too long
- Change: Now icon change right after save or clear blink style

## 0.2.1

- Fix: Correct strings save in storage

## 0.2.0

- Under the hood: Started options page. Added settings versions feature for future updates
- Added: Auto-save feature, by default
- Added: Loading Progress bar for Auto-save
- Change: Editor font size now 14px, by default
- Change: Removed Submit button

## 0.1.7

- Change: Removed Load button
- Change: Now Notifications messages appear less often
- Added: Script will try load page first time if it real url page only
- Added: Now when load page with Blink styles, extension icon will be changed

## 0.1.6

- Publish to store and added git home page

## 0.1.5

- Added: context menu dropdown in modal
- Added: action to clear all data from storage
- Added: action to clear only current data from storage
- Added: action to log all storage data to console
- Updated screens

## 0.1.1

- Start rewrite app
- Now added Chrome synchronization
- Start saving data in storage

## 0.1.0

- Refactored code
- When popup opened it try load exist Blink styles from page

## 0.0.1

- First version, it no save data after page reload
