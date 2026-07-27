## 1. 獨立封裝金額格式化工具 utils 與 React Hook

- [x] 1.1 實作 `formatAmount` 純函式，符合介面與資料結構與範圍邊界定義，支援進位模式 (`roundMode: 'ceil' | 'round' | 'floor' | 'none'`)、千分位格式化與貨幣符號輸出 (Unified amount formatting with optional rounding)。在 `apps/web/src/utils/amountUtils.ts` 實現，並撰寫 `apps/web/src/utils/amountUtils.test.ts`，執行 `npx vitest run apps/web/src/utils/amountUtils.test.ts` 滿足驗證條件。
- [x] 1.2 實作 `useFormatAmount` Hook 封裝金額格式化 (Unified amount formatting with optional rounding)。在 `apps/web/src/hooks/useFormatAmount.ts` 實現，由單元測試驗證介面與資料結構。

## 2. 結算頁面區域進位開關與 Markdown 同步設計

- [x] 2.1 在結算頁面 `UnsettledTransactionList` 區域新增「金額自動進位」切換開關（預設為 `true`）(System generates minimum-transfer suggestions)。在 `apps/web/src/components/settlement/UnsettledTransactionList.tsx` 與 `apps/web/src/pages/account-books/[id]/settlement/index.tsx` 實現，當開關開啟時使用 `Math.ceil` 顯示建議金額，型別檢查並驗證條件通過。
- [x] 2.2 擴充 `generateSettlementMarkdown` 支援 `autoRound` 參數 (System generates minimum-transfer suggestions)。更新 `apps/web/src/utils/settlementMarkdown.ts`，使產生的 Markdown 文字與畫面開關狀態一致，執行 `npm run test` 確保單元測試與驗證條件無錯誤。
