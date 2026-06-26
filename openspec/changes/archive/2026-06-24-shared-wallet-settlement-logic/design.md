## Context

目前的結算（Settlement）演算法中，系統會將所有交易的代墊與分攤金額匯總，計算出每位成員的淨額（Net Amount），並透過貪婪演算法配對債權人與債務人，產生最少轉帳次數的建議（Minimum Transfers）。然而，共用錢包（Shared Wallet）在系統中的定位是一個「不追蹤餘額的公積金」，也就是說，如果共用錢包代為付款，成員不需要把錢「還」給系統；但如果某筆共用錢包的支出只有「部分成員」分攤，這筆「額外享受」的款項，特定成員必須另外計算並補回實體的公積金信封裡。現有演算法將共用錢包視為一般成員，會產生無效且混淆的債權紀錄，因此需要重構。

## Goals / Non-Goals

**Goals:**

- 結算時將「共用錢包」從一般的轉帳互轉（Peer-to-peer transfers）中獨立出來。
- 辨識出「由共用錢包支付，且非全體分攤」的款項，並計算這些特定成員應補足給共用錢包的金額。
- 在結算畫面上新增「共用錢包」專屬區塊，呈現總支出、每人平均以及個人的額外借款（應補足金額）。
- 當使用者確認結算時，這些補足款項能與一般互轉一併標記為完成。

**Non-Goals:**

- 不改變共用錢包作為「無餘額追蹤」實體的本質，我們只計算單次結算週期內的應付金額，不處理跨週期的共用錢包餘額結轉。
- 不改變 `report.tsx` 中的個人報表呈現邏輯，報表維持現狀，忠實反映每筆消費的源頭與分攤。

## Decisions

- **Decision 1: 從互轉演算法中剔除共用錢包**
  - 在 `computeMemberStatuses` 或進入 `computeMinimumTransfers` 之前，將共用錢包的 `userId` 過濾掉，不讓它成為一般債權人或債務人。
  - 理由：共用錢包的結算邏輯與一般人不同，它是單向的（只需補入，不需轉出），將其混入一般演算法會造成轉帳路徑混亂。
  
- **Decision 2: 計算「共用錢包個人借款 (Shared Wallet Borrowings)」**
  - 結算時，遍歷本次欲結算的 transactions，找出 `paidBy` 包含共用錢包，且 `splitBy` 成員數 < 該帳本總真實人數的交易。將這些交易中，每個真實成員應分攤的金額累加，成為該成員的「額外個人借款」。
  - 理由：這能明確反映出誰在未經全體同意下使用了公款，需要補回。
  
- **Decision 3: 結算資料結構新增 Shared Wallet 欄位**
  - 在結算確認時，原本只儲存 `transfers`，現在可能需要將「對共用錢包的補足款」轉換成一種類似 transfer 的紀錄，或者在 UI 上僅為顯示用途，實際建立 settlement record 時把這些補足款作為 `toUserId = SharedWallet` 的 `SettlementTransfer` 儲存，以便未來標記為已結清。
  - 決定採用：將其轉換為 `SettlementTransfer`，但 `toUserId` 設為共用錢包的 ID，且這些轉帳只會在新的「共用錢包」UI 區塊中顯示，不會混入一般轉帳列表。

## Implementation Contract

- **Behavior**: 執行結算時，使用者不會看到任何「轉帳給共用錢包」或「共用錢包轉帳給你」的常規項目。相反地，畫面上會多出一個「共用錢包」區塊，顯示這段期間共用錢包的總支出、全體平分後的平均值，以及若有部分成員獨自使用了共用錢包的錢，顯示他們應補回的金額。
- **Interface / Data Shape**: `useSettlement` hook 回傳的資料將新增 `sharedWalletSummary`，包含 `{ totalExpense: number, averagePerPerson: number, borrowings: { userId: string, amount: number }[] }`。建立結算紀錄時，`borrowings` 將轉換為 `toUserId` 為共用錢包的 `SettlementTransfer` 陣列。
- **Failure Modes**: 若帳本內無共用錢包，或共用錢包沒有任何支出，該區塊將隱藏或顯示為 0。
- **Acceptance Criteria**: 建立一筆由共用錢包代墊 100 元且僅由 A 與 B 分攤的紀錄（帳本共有 A, B, C），結算時 A 與 B 各顯示需補足 50 元給共用錢包，且一般互轉列表中不出現共用錢包。
- **Scope Boundaries**: 僅影響 `settlement` 頁面與結算核心邏輯，不影響 `report` 頁面與單筆交易的新增/編輯。

## Risks / Trade-offs

- [Risk] 計算總人數時可能會算錯（例如包含已刪除成員） → Mitigation: 確保使用 `allUsers.filter(u => !isDeletedUser(u) && !isSharedWalletUser(u))` 來取得真實的總人數。
- [Risk] 把補足款轉換為 `SettlementTransfer` 可能導致舊有的報表或紀錄顯示出現非預期結果 → Mitigation: 在顯示一般轉帳紀錄列表的組件（如 `SettlementRecordDetail`）中，過濾掉 `toUserId` 為共用錢包的紀錄，改由新的共用錢包區塊渲染。
