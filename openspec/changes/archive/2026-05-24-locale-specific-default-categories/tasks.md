## 1. 重構 defaultCategories.ts — 各語系使用獨立的分類樹（inline data）

- [x] 1.1 新增 `DefaultCategoryRaw` 型別（含 `name`、`description`、`icon`、`children?` 欄位），並建立 `EN_US_EXPENSE`、`EN_US_INCOME`、`ZH_TW_EXPENSE`、`ZH_TW_INCOME` 各語系分類樹 inline 資料（zh-TW 版加入便利商店、夜市攤販等台灣在地分類）；以 `Record<Language, DefaultCategoryRaw[]>` 取代原本的 `EXPENSE_TREE` / `INCOME_TREE`。驗證：TypeScript 編譯無錯誤，各語系資料結構完整。
- [x] 1.2 移除 lookupTranslation，簡化 buildCategories：移除對 en-US.json / zh-TW.json 的 import 及 lookupTranslation 函式，更新 buildCategories 直接使用 DefaultCategoryRaw 的 name/description。行為：`getDefaultExpenseCategories(id, 'zh-TW')` 回傳含中文名稱的分類，`getDefaultExpenseCategories(id, 'en-US')` 回傳英文名稱的分類，不支援的 locale fallback 至 `en-US`。驗證：`defaultCategories.test.ts` 全數通過。

## 2. 移除 i18n JSON 中的 categories.defaults

- [x] 2.1 刪除 `en-US.json` 與 `zh-TW.json` 中的 `categories.defaults` 物件（Default category names are managed through the i18n message catalog 此需求移除後，i18n 檔案不再含有此 key）；若移除後 `categories` 為空物件則一併移除。驗證：TypeScript 編譯無錯誤（無 missing key 型別錯誤），`pnpm test` 通過，且兩份 JSON 中均不再存在 `categories.defaults`。

## 3. 更新測試

- [x] 3.1 更新 `defaultCategories.test.ts`：移除依賴 i18n JSON key 的斷言，改為直接斷言分類名稱字串（e.g. `'Food & Dining'`、`'飲食'`）。驗證：`pnpm test --testPathPattern defaultCategories` 全數通過，無任何依賴 `categories.defaults` JSON 路徑的殘留斷言。
