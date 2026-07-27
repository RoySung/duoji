## Why

在多幣別與日常分帳結算情境中，成員間進行 P2P 轉帳（如銀行轉帳、LINE Pay）時，包含小數點的金額常不便於實際轉帳操作。目前系統在結算頁面與各 UI 元件中缺乏統一的金額格式化處理方法，且結算轉帳欠缺「自動進位方便轉帳」的選項。

在結算頁面提供「金額自動進位」控制開關，並定義統一的金額格式化工具（`formatAmount`），能顯著提升結算轉帳便利性與介面呈現的一致性。

## What Changes

- 在結算頁面 (`/account-books/[id]/settlement`) 新增「金額自動進位」切換開關，預設為開啟 (`true`)，不需持久化儲存。
- 結算轉帳建議金額在開關開啟時自動進行無條件進位 (`Math.ceil`) 取整數，方便實際轉帳。
- 複製 Markdown 結算單時，轉帳建議金額同步跟隨開關狀態輸出進位後整數。
- 建立統一的金額格式化 utility（`formatAmount`）與 React hook（`useFormatAmount`），統一整合全站金額之千分位格式化、貨幣符號前綴與進位選項。
- 底層交易資料與 `SettlementRecord` 歷史紀錄仍維持精確浮點數儲存，不影響帳目精確度。

## Capabilities

### New Capabilities

- `amount-formatting`: 提供統一的金額顯示與格式化規則，包含進位選項、千分位與貨幣符號輸出。

### Modified Capabilities

- `settlement`: 在結算介面與 Markdown 導出中新增「結算金額自動進位」輔助轉帳功能。

## Impact

- Affected specs:
  - `openspec/specs/amount-formatting/spec.md`
  - `openspec/specs/settlement/spec.md`
- Affected code:
  - New:
    - `apps/web/src/utils/amountUtils.ts`
    - `apps/web/src/utils/amountUtils.test.ts`
    - `apps/web/src/hooks/useFormatAmount.ts`
  - Modified:
    - `apps/web/src/pages/account-books/[id]/settlement/index.tsx`
    - `apps/web/src/components/settlement/UnsettledTransactionList.tsx`
    - `apps/web/src/utils/settlementMarkdown.ts`
    - `apps/web/src/components/transaction/TransactionList.tsx`
    - `apps/web/src/components/report/ReportSummaryCards.tsx`
