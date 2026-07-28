## Context

目前的 `AccountBook` entity 將幣別 `CurrencySchema` 定義為固定的 Zod enum `z.enum(['USD', 'JPY', 'TWD'])`，前端 `AccountBookForm` 僅提供這三種選項。使用者如果需要使用其他常見幣別（例如歐元 EUR、英鎊 GBP、港幣 HKD、人民幣 CNY 等）或自訂單位，目前系統無法支援。

## Goals / Non-Goals

**Goals:**

- 將 `CurrencySchema` 擴充為支援任意非空字串 `z.string().min(1)`，維護動態與自訂幣別相容性。
- 提供常態幣別預設清單 (如 TWD, USD, JPY, EUR, GBP, CNY, HKD, SGD, AUD, CAD, KRW 等)。
- 在 `AccountBookForm` 中提供預設幣別下拉選單以及「自訂幣別」輸入欄位，使用者選擇自訂時可自行輸入幣別名稱或代碼。

**Non-Goals:**

- 不在 Phase 1 引入即時匯率換算或多幣別自動轉換計算功能。
- 不改變 `formatAmount` 現有的格式化邏輯（僅以傳入之貨幣代碼/名稱顯示）。

## Decisions

### 擴充 CurrencySchema 與定義常用幣別常數

- **決策**: 將 `CurrencySchema` 改為 `z.string().min(1)`，並定義 `DEFAULT_CURRENCIES` 常數陣列（包含 TWD, USD, JPY, EUR, GBP, CNY, HKD, SGD, AUD, CAD, KRW）。
- **理由**: 使型別具備自由輸入的彈性，同時保留現有與常見幣別的集中定義。
- **替代方案**: 繼續使用擴充的 static enum（如增至 20 種）。但這無法解決使用者欲使用更冷門或自訂記帳單位的需求。

### AccountBookForm 下拉選單與自訂欄位 UI 互動設計

- **決策**: 在 `AccountBookForm` 中，下拉選單選項包含 `DEFAULT_CURRENCIES` 以及「自訂... (custom)」。當使用者選取「自訂...」或目前帳本幣別不在 `DEFAULT_CURRENCIES` 清單中時，開啟自訂幣別文字輸入框供使用者輸入與修改。
- **理由**: 符合直覺的操作流程，常見幣別可一鍵挑選，特殊或自訂幣別亦能順暢輸入與編輯。
- **替代方案**: 將 Select 元件改為完全可編輯的 ComboBox。但考慮到 UI 元件庫現有元件與一致性，Select + Conditional Input 更加穩定且容易實現。

## Implementation Contract

- **Behavior**:
  - 新增/編輯帳本時，幣別下拉選單預設列出常見貨幣清單（TWD, USD, JPY, EUR, GBP, CNY, HKD, SGD, AUD, CAD, KRW）及「自訂」選項。
  - 當選取「自訂」或編輯既有含有非預設幣別的帳本時，表單顯示文字輸入框，儲存時將輸入之字串作為 `accountBook.currency` 存入。
  - 帳本列表、結算頁面、報表頁面顯示該帳本幣別時，正常渲染傳入之幣別字串。
- **Interface / data shape**:
  - `CurrencySchema`: `z.string().min(1)`
  - `DEFAULT_CURRENCIES`: `readonly string[]` (例如 `['TWD', 'USD', 'JPY', 'EUR', 'GBP', 'CNY', 'HKD', 'SGD', 'AUD', 'CAD', 'KRW']`)
- **Failure modes**:
  - 當使用者輸入空白字串作為自訂幣別時，表單驗證提示「幣別不可為空」並阻止提交。
- **Acceptance criteria**:
  - 使用者可以在建立或編輯帳本時從選單中選取歐元 (EUR)、港幣 (HKD) 等常用幣別並成功儲存。
  - 使用者可以選擇「自訂」並輸入字串（例如 "BTC" 或 "點"），帳本建立/編輯成功後全域皆能正確顯示該幣別。
- **Scope boundaries**:
  - 範疇內：`AccountBook` 幣別 Schema 更新、`AccountBookForm` 幣別 UI 選項與自訂輸入、i18n 語系檔更新。
  - 範疇外：匯率換算、多幣別報表彙整換算。

## Risks / Trade-offs

- [Risk] 使用者可能輸入過長的自訂幣別字串導致 UI 跑版 → Mitigation: 表單限制自訂幣別長度上限（例如 10 個字元）並於 UI 呈現適當截斷或換行。
