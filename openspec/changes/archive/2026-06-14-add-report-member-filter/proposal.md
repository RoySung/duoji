## Why

現有報表頁面僅支援時間範圍、帳本與標籤篩選，無法針對特定成員進行數據篩選。這使得共同記帳的使用者難以了解「自己個人的實際花費與收入」，因此需要新增成員篩選功能來改善此項體驗。

## What Changes

- **新增成員篩選器**：在報表頁面工具列中新增一個成員篩選下拉選單，預設為「所有成員」。
- **動態成員清單**：篩選器選項僅顯示在當前報表範圍（時間範圍與帳本）內有交易紀錄的成員（包括已刪除的虛擬成員，只要其存在於歷史交易中）。
- **調整統計金額**：選取特定成員時，報表總額、分類圓餅圖、趨勢圖及交易明細均會調整為該成員個人的「分攤份額」（針對支出）或「收款金額」（針對收入），而非顯示交易的總金額。
- **本地狀態維護**：成員篩選狀態為頁面本地狀態，重新整理或切換頁面後會重置，且不影響 CSV 匯出的資料範圍。

## Capabilities

### New Capabilities

- `report-member-filter`: 提供報表頁面的成員篩選功能，並可將統計數據自動調整為該成員個人的收支份額。

### Modified Capabilities

(none)

## Impact

- Affected specs:
  - New capability: `report-member-filter`
- Affected code:
  - New:
    - `apps/web/src/components/report/MemberFilterSelector.tsx`
  - Modified:
    - `apps/web/src/pages/account-books/[id]/report.tsx`
    - `apps/web/src/i18n/messages/zh-TW.json`
    - `apps/web/src/i18n/messages/en-US.json`
