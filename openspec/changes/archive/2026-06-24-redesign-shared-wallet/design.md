## Context

目前的共用錢包是實作為一個 `VirtualUser` 且被允許作為分攤對象，但在實務上造成報表與結算邏輯的複雜化。為了更好支援「公積金」這種預繳並以公費支出的情境，我們需要將共用錢包重新定位為單純的付款方（資金池），並不再允許其作為分攤對象。

## Goals / Non-Goals

**Goals:**
- 在新增交易時，讓使用者可以選擇「共用錢包」作為付款人。
- 在選擇分攤對象時，排除「共用錢包」，並在切換付款人為「共用錢包」時自動全選活躍真實成員。
- 移除報表（Report）中針對共用錢包做平分的特例邏輯，使其單純依賴 `splitDetail` 的真實資料。

**Non-Goals:**
- 不修改既有的 `VirtualUser` 資料結構（`isSharedWallet` 欄位維持現狀）。
- 不實作資料庫中舊有包含共用錢包分攤紀錄的 Migration。
- 不更改現有的結算（Settlement）核心演算法。

## Decisions

### 1. 調整 Payer 與 Split Target 的選項邏輯
**Rationale:** 共用錢包本質上是一個資金池（付款方），不應該承擔實際消費。因此在選擇 Payer 時應該包含共用錢包，但在選擇 Split Target 時必須過濾掉它。
**Alternatives:** 允許共用錢包作為分攤對象，但在結算時特別處理（此為舊有設計，已證明過於複雜且容易產生 Bug）。

### 2. Payer 切換時的 UI 連動行為
**Rationale:** 當使用者選擇由共用錢包付款時，99% 的情境是「全體成員共同平分這筆公費」。為了提升體驗，系統應自動將分攤對象覆蓋並全選當前活躍的成員。使用者若需要微調（例如某人不參與平分），依然可以手動取消勾選。
**Alternatives:** 不做連動，讓使用者手動點選，但這在成員多時體驗不佳。

### 3. 移除報表端的平分特例
**Rationale:** 因為未來的交易中，共用錢包不再出現在 `splitDetail` 內，報表的 Member Filter 功能不再需要偵測共用錢包並把金額按人數均分。這大幅簡化了 `reportUtils` 或相關 Hook 內的計算邏輯。
**Alternatives:** 保持舊程式碼，這會造成沒必要的效能負擔與程式碼複雜度。

## Implementation Contract

- Behavior:
  - 建立/編輯交易表單中，Payer 選擇器會顯示共用錢包。
  - Split Targets 選擇器永遠不會顯示共用錢包。
  - 當 Payer 從其他人切換為「共用錢包」時，Split Targets 狀態自動重置為全選所有活躍成員。
  - 報表頁面的 Member Filter 單純依據交易中針對該成員的 `splitDetail` 金額計算收支，不再執行共用錢包金額平分。
- Scope boundaries:
  - In scope: `TransactionForm` 相關的 Payer/SplitTarget 選擇器元件、報表金額計算邏輯 (`apps/web/src/pages/account-books/[id]/report.tsx` 或其引用的 utils)。
  - Out of scope: 既有的 `isSharedWallet` 實體定義、歷史資料的轉換腳本。
- Acceptance criteria:
  - 手動測試：可成功使用共用錢包付款，且分攤對象自動帶入全體成員。
  - 手動測試：在報表中篩選特定成員時，其統計金額正確反映 `splitDetail`，未出現不預期的均分邏輯。

## Risks / Trade-offs

- [Risk] 舊有包含共用錢包分攤的交易在報表中可能會計算錯誤。
  → Mitigation: 由於目前在開發測試階段，不具備舊資料包袱，故接受此風險，無需撰寫 Migration。
