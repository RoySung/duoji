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

## 1. 修正 useUsersByAccountBook 與 useCategoriesByAccountBook 的載入狀態

- [x] 1.1 實作決策 `1. 修正 useUsersByAccountBook 與 useCategoriesByAccountBook 的載入狀態`，修改 `useUsersByAccountBook.ts` 與 `useCategoriesByAccountBook.ts` 以支持 `Prevent race condition on account book switch in transaction form`，在帳本變更後第一個 Render 立即返回 `isLoading: true` 直至資料載入完成，驗證方法是撰寫單體測試與執行 `npx nx test web` 確保測試通過。
- [x] 1.2 實作決策 `1. 修正 useUsersByAccountBook 與 useCategoriesByAccountBook 的載入狀態`，驗證手動在前端切換帳本時付款人與分攤人正確同步為目標帳本預設成員（付款人第一個，分攤人為所有成員），無競態條件問題。
