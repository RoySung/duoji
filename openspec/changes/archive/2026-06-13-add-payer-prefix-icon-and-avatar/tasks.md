<!--
Each task description MUST state:
- the behavior or contract being delivered (what is observably true when the
  task is complete), and
- the verification target that proves completion (test, CLI invocation,
  analyzer check, manual assertion, or content review).

File paths are supporting context for locating the work, never the task
itself. "Edit file X" is not a valid task — it is missing both behavior and
verification.
-->

## 1. 增加付款人/收款人顯示的 Icon 與頭像

- [x] 1.1 在 `apps/web/src/components/transaction/TransactionList.tsx` 中匯入 `PiHandCoinsBold` 圖示，並為付款人/收款人的 Chip 元件新增 `startContent`，包含 `PiHandCoinsBold` 動作圖示以及對應的使用者頭像（`Avatar`），以確保滿足 `Transactions are presented in an account-book-scoped list` 的顯示需求，並透過 Jest 單元測試與執行 `npm run test:web` 進行驗證。
- [x] 1.2 在 `apps/web/src/components/transaction/TransactionList.tsx` 中將付款人/收款人顯示晶片的前綴圖示從 `PiHandCoinsBold` 修改為使用 `LuDollarSign`（來自 `lucide-react`），並透過 Jest 單元測試與執行 `npm run test:web` 驗證其顯示邏輯與正確性。

