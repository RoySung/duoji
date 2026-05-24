## Context

`defaultCategories.ts` 目前使用單一樹狀結構搭配 i18n lookup 來生成各語系的預設分類。所有語系共用相同的分類階層，僅名稱透過 `en-US.json` / `zh-TW.json` 的 `categories.defaults` 段落查找翻譯。

這個設計的問題：
1. 分類樹的結構被迫對所有語系相同，無法針對不同文化習慣調整
2. `defaultCategories.ts` import 了 i18n JSON，形成不必要的耦合
3. 預設分類只在帳本建立時使用一次，不需要動態 i18n

## Goals / Non-Goals

**Goals:**
- 各語系擁有獨立的分類資料，名稱和描述直接內嵌
- 移除 `defaultCategories.ts` 對 i18n JSON 的 import
- 移除 `en-US.json` / `zh-TW.json` 中的 `categories.defaults` 段落
- 維持現有公開介面（`getDefaultExpenseCategories`、`getDefaultIncomeCategories`）不變

**Non-Goals:**
- 不修改 Category entity 結構
- 不新增新語系支援
- 不影響使用者已建立的分類

## Decisions

### 各語系使用獨立的分類樹（inline data）

使用 `Record<Language, DefaultCategoryRaw[]>` 索引各語系的分類資料，每個節點直接含 `name`、`description` 欄位，不透過 key 查找。

**替代方案考慮：** locale extension（共用基礎樹 + 各語系擴充）—— 捨棄，因維護兩層資料結構比完全分開更複雜，且實際上 zh-TW 的分類結構和英文版差異足夠大（在地化分類），沒有必要強制共用基礎。

### 移除 lookupTranslation，簡化 buildCategories

`buildCategories` 直接接受含名稱的節點，不再需要 locale + key 的 lookup 步驟。

## Implementation Contract

**函式介面（不變）：**
```ts
getDefaultExpenseCategories(accountBookId: string, locale?: Language): Category[]
getDefaultIncomeCategories(accountBookId: string, locale?: Language): Category[]
```

**資料形狀（新增）：**
```ts
type DefaultCategoryRaw = {
  name: string
  description: string
  icon: keyof typeof CATEGORY_ICONS
  children?: DefaultCategoryRaw[]
}
```

**行為：**
- 呼叫 `getDefaultExpenseCategories(id, 'zh-TW')` 回傳含台灣在地化分類名稱的 Category[]
- 呼叫 `getDefaultExpenseCategories(id, 'en-US')` 回傳英文分類名稱的 Category[]
- 若傳入不支援的 locale，fallback 至 `en-US`

**i18n JSON 變更：**
- `en-US.json` 與 `zh-TW.json` 中的 `categories.defaults` 物件整段移除
- 若移除後 `categories` key 為空，連同移除

**驗收條件：**
- `defaultCategories.ts` 不再 import i18n JSON 檔案
- `defaultCategories.test.ts` 現有測試全數通過（或更新以符合新結構）
- TypeScript 編譯無錯誤

## Risks / Trade-offs

- [Risk] zh-TW 和 en-US 的分類資料須各自維護，未來新增分類要同步兩份 → Mitigation: 兩份資料放在同一檔案中相鄰位置，易於對照維護
- [Risk] 現有測試依賴 i18n JSON 的內容 → Mitigation: 更新測試直接斷言分類名稱字串，不再依賴 JSON key

## Migration Plan

1. 更新 `defaultCategories.ts`：新增各語系 inline 資料，移除 i18n lookup
2. 刪除 `en-US.json` 和 `zh-TW.json` 中的 `categories.defaults` 段落
3. 更新 `defaultCategories.test.ts`
4. 確認 TypeScript 編譯和測試通過
