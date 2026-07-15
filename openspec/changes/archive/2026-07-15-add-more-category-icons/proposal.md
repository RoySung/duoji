## Why

現有的分類圖示集合中缺少一些常見的生活消費分類圖示，例如「寵物」、「生活用品」、「休閒活動」以及其他居家與日常生活常見開銷（如水電費、電信費、育兒、美髮、旅遊等）。新增這些常用圖示能提升使用者在分類管理中標記分類時的精準度與自由度。

## What Changes

- 在 `apps/web/src/constants/categoryIcons.ts` 的 `CATEGORY_ICONS` 中新增 寵物、用品、活動 以及其他日常生活常見的 Lucide 圖示（共 21 個）。
- 在 `en-US.json` 與 `zh-TW.json` 語系檔中新增這些新圖示對應的 `iconOptions` 翻譯鍵值，確保無障礙輔助標籤（`aria-label` / `title`）的正確朗讀。

## Non-Goals (optional)

- 不修改分類選擇器的視覺排版（沿用上一版的 Grid 佈局）。
- 不更改既有分類的預設圖示對應。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `categories`: 新增並擴充可用分類圖示清單與對應語系鍵值。

## Impact

- Affected specs:
  - `categories`
- Affected code:
  - Modified:
    - `apps/web/src/constants/categoryIcons.ts`
    - `apps/web/src/i18n/messages/zh-TW.json`
    - `apps/web/src/i18n/messages/en-US.json`
