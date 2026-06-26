## Why

當前系統在分帳（Settlement）時，將「共用錢包」視為一般成員參與轉帳計算，導致共用錢包的支出也會產生債權債務關係。由於我們的設計原則是「不處理共用錢包有多少錢」，共用錢包實質上是一個不計餘額的公積金。如果某筆消費是由共用錢包支出且由全體成員分攤，則不需要再額外向成員收取費用；但若該筆消費僅由「部分成員」分攤，則這些特定成員必須補足他們應負擔的金額給共用錢包。因此，我們需要重新設計分帳演算法與 UI，將共用錢包的處理邏輯與一般成員互轉脫鉤。

## What Changes

- 在結算最佳化演算法中，將「共用錢包」的餘額獨立計算，不將其視為一般轉帳的債權人或債務人。
- 對於由共用錢包支出且分攤對象為「全體成員」的交易，在分帳時完全忽略（無需成員還款給共用錢包）。
- 對於由共用錢包支出但分攤對象「非全體成員」的交易，計算這些特定成員應補給共用錢包的金額。
- 在結算 UI 中新增獨立的「共用錢包」區塊，顯示共用錢包的「總支出」、「每人平均」以及「額外個人借款」（即部分成員應補給共用錢包的款項）。
- 確保系統在建立交易時，不允許將「共用錢包」選為分攤對象（此規則已在其他流程中確立，此處作為前提確保不產生共用錢包身為債務人的情況）。
- 完成結算後，這些「應付給共用錢包」的紀錄將隨一般轉帳紀錄一同標記為完成，不影響共用錢包本身的餘額追蹤。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `settlement`: 修改結算演算法與 UI，排除共用錢包的一般轉帳計算，並新增共用錢包獨立顯示區塊，以處理非全體分攤的共用支出補足邏輯。

## Impact

- Affected specs: `settlement`
- Affected code:
  - Modified: `apps/web/src/utils/settlementUtils.ts` (結算演算法)
  - Modified: `apps/web/src/pages/account-books/[id]/settlement/index.tsx` (結算 UI 畫面)
  - Modified: `apps/web/src/components/settlement/SettlementConfirmModal.tsx` 或相關組件 (顯示共用錢包區塊)
  - Modified: `apps/web/src/hooks/useSettlement.ts` (結算資料整理與完成邏輯)
