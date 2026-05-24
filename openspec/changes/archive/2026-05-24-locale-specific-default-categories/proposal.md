## Why

目前 `defaultCategories.ts` 依賴 i18n JSON 檔案做分類名稱的翻譯查找，導致預設分類的結構被迫在所有語系間共用，無法針對不同語系提供文化上更貼近的分類內容。將各語系的分類名稱直接內嵌於資料中，可移除不必要的 i18n 耦合，並讓各語系能獨立演化。

## What Changes

- `defaultCategories.ts` 移除對 `en-US.json` / `zh-TW.json` 的 import 以及 `lookupTranslation` 函式
- 新增各語系獨立的分類樹資料（`name`、`description` 直接內嵌），以 `Record<Language, DefaultCategoryRaw[]>` 索引
- zh-TW 分類可加入台灣在地化分類（如便利商店、夜市攤販）
- `en-US.json` 與 `zh-TW.json` 中 `categories.defaults` 段落可移除
- `getDefaultExpenseCategories` / `getDefaultIncomeCategories` 介面不變，仍接受 `locale` 參數

## Non-Goals (optional)

- 不引入新的 i18n key 或翻譯機制
- 不修改分類的 entity 結構
- 不異動使用者已建立的分類

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `i18n`: 移除 `categories.defaults` 翻譯 key，預設分類名稱不再透過 i18n 系統管理

## Impact

- Affected specs: `i18n`
- Affected code:
  - `apps/web/src/constants/defaultCategories.ts`
  - `apps/web/src/i18n/messages/en-US.json`
  - `apps/web/src/i18n/messages/zh-TW.json`
