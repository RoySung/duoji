## 1. 資料來源與快取一致性

- [x] 1.1 交付 Reuse the existing transaction list cache for tag suggestions，讓 Tag suggestions are scoped to the transaction form's selected account book 在 apps/web/src/hooks/useAccountBookTagSuggestions.ts 以表單 accountBookId 為唯一來源成立，並在切換帳本後只回傳新帳本的 suggestions；完成後以 apps/web/specs/useAccountBookTagSuggestions.spec.ts 覆蓋單一帳本來源與帳本切換案例驗證。
- [x] 1.2 交付 Normalize suggestion candidates for display only，讓 Tag suggestions are normalized for display 對空字串、前後空白、case-insensitive 重複值與已選 tags 都成立，且排序規則固定；完成後以 apps/web/specs/useAccountBookTagSuggestions.spec.ts 驗證去空值、trim、去重與排序行為。
- [x] 1.3 交付 Reuse the existing transaction list cache for tag suggestions，讓 Tag suggestions stay coherent with transaction mutations 在 create、update、delete 後不必等待 TTL 就能刷新 suggestions；完成後以 apps/web/specs/useAccountBookTagSuggestions.spec.ts 或等價的窄範圍 mutation 整合測試驗證新增新 tag 與移除最後一筆 tag 使用紀錄的刷新結果。

## 2. 表單與元件整合

- [x] 2.1 交付 Keep TagInput presentational and render suggestion chips below the input，讓 Transaction forms support tag suggestions without removing manual tag entry 在共用 TagInput 上成立，包含點選 suggestion 加入 tag、隱藏已選 suggestion，以及沒有 suggestions 時仍可手動輸入；完成後以 apps/web/specs/transactionFormTags.spec.tsx 驗證點選與手動輸入兩條路徑。
- [x] 2.2 交付 Scope suggestions by the form-selected account book instead of global current account book，讓 apps/web/src/components/TransactionModal/ExpenseForm.tsx 與 apps/web/src/components/TransactionModal/IncomeForm.tsx 在 create/edit flow 都從 value.accountBookId 接入同一套 suggestions 行為；完成後以 apps/web/specs/transactionFormTags.spec.tsx 驗證 expense 與 income 兩個表單都會隨 accountBookId 變更更新可見 suggestions。
- [x] 2.3 交付 Keep loading and failure states non-blocking，讓 Tag suggestion loading SHALL remain non-blocking 在 loading、refetch 與 account-book switch 中都保持 tags 欄位可輸入，且不顯示舊帳本 stale suggestions；完成後以 apps/web/specs/transactionFormTags.spec.tsx 驗證 non-blocking 行為，並以手動檢查確認 transaction modal 在手機 viewport 下仍可捲動到 tags 區塊。

## 3. 驗證與交付檢查

- [x] 3.1 交付完整的 change 驗證證據，確認 apps/web/specs/useAccountBookTagSuggestions.spec.ts、apps/web/specs/transactionFormTags.spec.tsx，以及受影響的 transaction form 渲染路徑都通過；完成後以 pnpm nx test web --runInBand --testPathPattern=useAccountBookTagSuggestions 與 pnpm nx test web --runInBand --testPathPattern=transactionFormTags 執行結果驗證。
- [x] 3.2 交付 proposal、design、specs 與 tasks 的一致性檢查，確認 Transaction forms support tag suggestions without removing manual tag entry 與四條 transaction-tag-suggestions requirements 都有對應實作與驗證目標；完成後以 spectra analyze add-transaction-tag-suggestions --json 與 spectra validate add-transaction-tag-suggestions 的通過結果驗證。
