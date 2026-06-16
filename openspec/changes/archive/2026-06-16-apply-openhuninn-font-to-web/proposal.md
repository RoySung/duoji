## Why

為改善 `apps/web` 的整體視覺美感與使用者體驗，套用新字體 `jf-openhuninn-2.1.ttf`（粉圓字體 2.1 版本），使應用程式的介面文字呈現更為精美且一致。

## What Changes

- 在 `apps/web/src/pages/styles.css` 中宣告 `@font-face` 載入本機字體檔 `jf-openhuninn-2.1.ttf`。
- 修改 `apps/web/src/pages/styles.css` 的 `html` 元素 `font-family` 屬性，將 `'jf-openhuninn'` 設為首選字體。
- 修改 `apps/web/tailwind.config.js` 的 `theme.extend.fontFamily`，將 `'jf-openhuninn'` 加入預設的 `sans` 字體清單中，以利 Tailwind CSS `font-sans` 工具類別自動套用。

## Non-Goals (optional)

- 不下載或更變現有字體檔案 `apps/web/public/fonts/jf-openhuninn-2.1.ttf` 的內容。
- 不影響 `apps/web` 以外其他子專案的字體設定。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

(none)

## Impact

- Affected code:
  - Modified:
    - apps/web/src/pages/styles.css
    - apps/web/tailwind.config.js
