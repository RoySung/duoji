## Context

當前系統在分帳結算時，計算出的成員轉帳建議金額可能包含小數（如 $150.5 元），使用者在進行實際銀行或行動支付轉帳時，希望能自動無條件進位為整數（$151 元）以利轉帳。同時全站元件亦需要統一的金額格式化處理。

為此，我們需要：
1. 在結算頁面提供「金額自動進位」 Switch 切換開關（預設 `true`），即時計算與顯示進位後的轉帳建議金額，並同步於 Markdown 結算單導出。
2. 設計單一權威的金額格式化工具函式（`formatAmount`）與 React hook（`useFormatAmount`），供全站統一引用。

## Goals / Non-Goals

**Goals:**

- 在結算頁面轉帳建議區域新增「金額自動進位」切換開關，預設開啟。
- 當進位開關開啟時，轉帳建議金額採用無條件進位 (`Math.ceil`) 取至整數。
- `generateSettlementMarkdown` 導出文字同步配合當前進位開開狀態輸出金額。
- 實現單一權威的金額格式化函式 `formatAmount`，支援千分位分隔、進位模式（`ceil` / `round` / `none`）與貨幣符號。
- 確保 `SettlementRecord` 與交易數據庫維持精確浮點數保存。

**Non-Goals:**

- 不改變資料庫中交易原始金額 (`amount`) 的儲存精確度。
- 不將結算進位開關持久化至全域 `Settings`（維持區域元件狀態）。

## Decisions

### 1. 結算頁面區域進位開關與 Markdown 同步設計

在結算頁面與 `UnsettledTransactionList` 區域維護 `autoRound: boolean` 狀態（預設 `true`）。
當 `autoRound === true` 時，轉帳建議清單之顯示金額與 `generateSettlementMarkdown({ autoRound: true })` 同步渲染無條件進位數值（如 `Math.ceil(suggestedAmount)`）。

權衡考量：不將此開關寫入持久化 `Settings`，可避免複雜的全域狀態耦合，並精準滿足「結算轉帳時即時切換」的情境。

### 2. 獨立封裝金額格式化工具 utils 與 React Hook

在 `apps/web/src/utils/amountUtils.ts` 提供純函式 `formatAmount(amount, options)`，並在 `apps/web/src/hooks/useFormatAmount.ts` 提供 React Hook。
`formatAmount` 支援以下參數：
- `roundMode?: 'ceil' | 'round' | 'floor' | 'none'`: 進位模式。
- `decimals?: number`: 保留小數位數。
- `showCurrency?: boolean`: 是否顯示貨幣符號。
- `currencySymbol?: string`: 貨幣符號（預設為空字串或 NT$）。

權衡考量：統一格式化工具，降低各元件自行編寫 `.toFixed(2)` 或自訂千分位正則表達式的混亂。

## Implementation Contract

### 介面與資料結構

1. **`formatAmount` 簽名**:
   - `formatAmount(amount: number, options?: AmountFormatOptions): string`
   - `AmountFormatOptions`: `{ roundMode?: 'ceil' | 'round' | 'floor' | 'none'; decimals?: number; showCurrency?: boolean; currencySymbol?: string }`
   - 進位行為：當 `roundMode: 'ceil'` 時，使用 `Math.ceil(amount)` 取整數；預設 `roundMode: 'none'` 保留小數點並加上千分位號。

2. **`generateSettlementMarkdown` 簽名擴充**:
   - `generateSettlementMarkdown(params: { ...; autoRound?: boolean }): string`

### 驗證條件

- 在結算頁面開啟「金額自動進位」時，建議轉帳金額 `150.2` 顯示為 `151`。
- 切換關閉時，建議轉帳金額恢復顯示為 `150.2`。
- 點擊複製 Markdown 時，複製出來的文字內容與畫面進位狀態一致。
- `SettlementRecord` 寫入資料庫的 `suggestedAmount` 仍維持原始精確數值（如 `150.2`）。

### 範圍邊界

- **In Scope**: 結算頁面進位開關、Markdown 導出同步、`amountUtils` 實作與單元測試。
- **Out of Scope**: 修改資料庫交易數值、修改 CSV 導出數據。

## Risks / Trade-offs

- [Risk] 使用者誤以為進位會修改結算紀錄歷史數據 → Mitigation: 在 UI 開關旁標示「僅影響轉帳建議金額顯示，不改變原始數據」。
