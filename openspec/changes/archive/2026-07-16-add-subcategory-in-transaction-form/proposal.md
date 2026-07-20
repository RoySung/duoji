## Why

在目前的設計中，使用者若在新增或編輯交易紀錄時發現需要的子分類不存在，必須先關閉表單，切換到帳本設定的「管理分類」頁面新增子分類，再返回交易表單重新輸入。這造成了記帳流程的中斷，影響使用者體驗。

## What Changes

- 在新增與編輯交易紀錄表單的分類選擇器（CategorySelector）中，於各個主分類的子分類列表末尾，新增一個「新增子分類」按鈕。
- 點擊該按鈕後，會開啟與分類設定頁面相同的「新增子分類」彈窗（AddCategoryModal），且自動帶入該主分類的類型（支出或收入）與 ParentId。
- 使用者輸入子分類名稱並選擇圖示後，點擊新增會直接調用 `addCategory` 寫入資料庫，並在成功後自動選中該新建立的子分類。

## Non-Goals (optional)

- 不在此表單中支援新增主分類群組。
- 不在此表單中支援編輯或刪除既有的分類（編輯/刪除分類仍須在分類設定頁面進行）。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `categories`: 允許使用者在新增/編輯交易紀錄的表單中，直接針對選取的主分類群組新增子分類。

## Impact

- Affected specs: `categories`
- Affected code:
  - Modified:
    - `apps/web/src/components/TransactionModal/CategorySelector.tsx`
