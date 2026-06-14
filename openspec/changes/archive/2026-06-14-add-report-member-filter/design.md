## Context

現有報表頁面展示了特定帳本或所有帳本的收支匯總與分類細項，但目前所有的統計皆以交易的總金額（Transaction.amount）來計算。當帳本有多人參與且有分攤（splitDetail）時，各成員無法直接在報表看見屬於「自己個人」的花費與收入。

## Goals / Non-Goals

**Goals:**

- 提供報表頁面的成員篩選器，支援選取單一成員。
- 在選取特定成員後，將報表的所有匯總數據（包含總收支卡片、分類圓餅圖、月趨勢圖、點擊分類後的明細列表）調整為該成員個人的「分攤份額」或「收款金額」。
- 僅顯示當前篩選範圍內有交易記錄的成員選項（包含已刪除的虛擬成員）。

**Non-Goals:**

- 支援複選成員。
- 將成員篩選狀態保存至 URL（應為 page-local 狀態）。
- 成員篩選器影響 CSV 匯出（CSV 匯出應維持導出完整資料）。

## Decisions

### 1. 成員分攤金額轉換邏輯

當選定成員 $M$ 時，單筆交易 $T$ 對該成員所產生的實質收支計算如下：
- 若交易類型為支出（`type === 'expense'`）：
  - 尋找 `T.splitDetail` 中 `userId === M` 的項目。
  - 若找到，則該成員的支出份額為該項目的 `amount`。
  - 若未找到，則該項目對該成員的支出份額為 $0$。
- 若交易類型為收入（`type === 'income'`）：
  - 若 `T.receivedByUserId === M`，則該成員的收入份額為 `T.amount`。
  - 若非，則為 $0$。

對數據集進行預先處理，重組為一組新的交易對象（覆寫 `amount` 屬性），可以讓現有的下游組件（`summarize`, `groupByCategory`, `groupByMonth`）完全無縫重用，而不需要修改各組件內部深層的累加邏輯。

### 2. 成員篩選器 UI 組件設計

新增 `MemberFilterSelector` 組件，採用與標籤篩選器（`TagFilterSelector`）一致的 Popover 與樣式設計。
- 展開後顯示「所有成員」選項及所有可用成員清單。
- 每個成員選項顯示頭像與名稱。
- 點擊成員直接進行切換（單選）。

## Implementation Contract

- **行為**：選取特定成員時，報表卡片、分類圓餅圖、月趨勢圖與分類交易詳情抽屜顯示該成員對應的收支。
- **介面/數據格式**：
  - 新增 `MemberFilterSelector` 組件，介面定義為：
    ```typescript
    type MemberFilterSelectorProps = {
      availableMembers: User[]
      selectedMemberId: string | null
      onChange: (memberId: string | null) => void
    }
    ```
  - 金額調整轉換函數：
    ```typescript
    function getTransactionAmountForMember(tx: Transaction, memberId: string): number
    ```
- **失敗模式**：若選取成員在某分類下無交易明細，分類明細抽屜應顯示無交易。若篩選器切換時間範圍後該成員無交易，自動重置選取狀態至「所有成員」。
- **驗證標準**：
  - 單元測試中驗證成員篩選器選取時統計金額是否調整。
  - 手動操作確認篩選器下拉選項與數值同步更新。
  - 匯出 CSV 確認仍是完整帳本交易。
- **範圍邊界**：僅限前端報表頁面處理，不修改 IndexedDB/Dexie 的持久化資料，亦不影響其他記帳或結算頁面。

## Risks / Trade-offs

- **[Risk] 成員篩選與標籤篩選疊加時的邊界情況**：當同時使用標籤篩選和成員篩選時，可能導致可用成員列表縮減。
  - *Mitigation*：`availableMembers` 應以 `bookFilteredTransactions`（僅經帳本篩選，未經標籤篩選）為基礎進行提取，確保篩選器選項不受標籤篩選的互相干擾，且選單內容保持穩定。
