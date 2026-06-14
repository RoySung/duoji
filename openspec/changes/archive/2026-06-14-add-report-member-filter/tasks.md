## 1. 語系與核心組件開發

- [x] 1.1 在 `apps/web/src/i18n/messages/zh-TW.json` 與 `apps/web/src/i18n/messages/en-US.json` 中新增 `report.memberFilter` 的翻譯鍵值，包含標題、預設選項與空狀態文字。驗證方式：確認語系檔案 JSON 格式正確無損壞。
- [x] 1.2 根據設計中的「2. 成員篩選器 UI 組件設計」，建立 `apps/web/src/components/report/MemberFilterSelector.tsx` 組件。組件應能渲染成員列表按鈕，且點擊選項時能觸發單選回呼函數，此項修改對應 "Member filter is available on the report page" 的規範。驗證方式：通過單元測試 `apps/web/specs/reportMemberFilter.spec.tsx` 的渲染與行為測試。

## 2. 報表整合與金額邏輯計算

- [x] 2.1 根據設計中的「1. 成員分攤金額轉換邏輯」，在 `apps/web/src/pages/account-books/[id]/report.tsx` 中實作當選定特定成員時，將交易的 amount 轉換為該成員在 `splitDetail` 中的分攤額度（針對支出）或該成員收款金額（針對收入）的處理邏輯，此項修改對應 "Filtering by member calculates and displays the member's own share" 的規範。驗證方式：通過單元測試 `apps/web/specs/reportMemberFilter.spec.tsx` 的計算邏輯測試。
- [x] 2.2 在 `apps/web/src/pages/account-books/[id]/report.tsx` 中引入 `MemberFilterSelector` 組件，並動態提取有交易紀錄的成員清單傳遞給篩選器，此項修改對應 "Member filter options are derived from the current report dataset" 的規範。驗證方式：在瀏覽器中開啟報表頁面，確認下拉選單中的成員與該時間範圍內有交易記錄的成員完全一致，並在切換時間範圍使成員無交易時自動重置回「所有成員」。
