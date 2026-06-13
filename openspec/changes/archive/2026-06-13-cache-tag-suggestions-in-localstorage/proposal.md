## Why

原本的標籤建議（tag suggestions）是直接從資料庫中撈取該帳本的所有交易紀錄來提取，當交易筆數過多時，會造成效能瓶頸與記憶體負擔。為了提升效能並減少不必要的資料撈取，我們將標籤建議改為從 LocalStorage 讀取，並在使用者新增或修改交易時，將該交易輸入的標籤記憶並快取至 LocalStorage 中。

## What Changes

- 將 `useAccountBookTagSuggestions` 的標籤來源從資料庫（`TransactionRepo`）改為 LocalStorage 快取。
- 在 `useAccountBookTransactions` 內的交易建立（`createTransaction`）與更新（`updateTransaction`）成功時，將交易輸入的標籤寫入對應帳本的 LocalStorage 快取中。
- 移除 `TransactionRepo` 與其 local 實作 `TransactionLocalRepo` 中的 `findTagsByAccountBookId` 方法，因為標籤建議已改用 LocalStorage，該方法已無調用需求。
- 修改相關測試，以驗證標籤快取在 LocalStorage 中的新增、更新與讀取行為，並確保刪除交易時標籤不會被自動移除（因為是記憶使用者曾輸入過的標籤）。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `transaction-tag-suggestions`: 標籤建議的資料來源改為 LocalStorage 快取，並由交易建立與更新流程寫入，而非每次皆從資料庫的所有交易紀錄中動態撈取與提取。
- `transaction-storage`: 移除 `TransactionRepo` 介面中的 `findTagsByAccountBookId` 方法。

## Impact

- Affected specs: transaction-tag-suggestions, transaction-storage
- Affected code:
  - Modified:
    - `apps/web/src/hooks/useAccountBookTagSuggestions.ts`
    - `apps/web/src/hooks/useAccountBookTransactions.ts`
    - `apps/web/specs/useAccountBookTagSuggestions.spec.ts`
    - `apps/web/src/entities/transaction.ts`
    - `apps/web/src/repositories/transactionRepo/transactionLocalRepo.ts`
