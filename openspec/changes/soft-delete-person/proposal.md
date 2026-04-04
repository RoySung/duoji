## Why

當帳本成員被刪除後，所有引用該成員的過往帳務記錄應維持資料完整性，同時在新增與編輯帳務時給予清晰的操作限制，避免誤用已刪除的成員。

## What Changes

- 成員刪除改為軟刪除，新增 `deletedAt` 欄位取代實際刪除
- 新增帳務的人員 selector 不顯示已軟刪除的成員
- 查閱過往帳務時，已刪除成員保留顯示但加上刪除線樣式
- 編輯過往帳務時，人員 selector 顯示已刪除成員（供移除用），但禁止重新選取該成員

## Capabilities

### New Capabilities

- `person-soft-delete`: 成員軟刪除機制，包含 `deletedAt` 欄位、過濾邏輯、以及在帳務 UI 中針對已刪除成員的顯示與互動規則

### Modified Capabilities

- `transactions`: 新增帳務人員選擇需過濾已刪除成員；編輯帳務時已刪除成員只可移除不可新增；顯示帳務時已刪除成員以刪除線樣式呈現

## Impact

- Affected specs: `person-soft-delete` (new), `transactions` (modified)
- Affected code:
  - `apps/web/src/entities/person.ts` — 新增 `deletedAt` 欄位
  - `apps/web/src/stores/people/` — 更新刪除邏輯為軟刪除
  - `apps/web/src/components/accountBookSettings/PeopleSection.tsx` — 更新刪除操作
  - `apps/web/src/components/TransactionModal/PaidByDetailModal.tsx` — 人員 selector 過濾邏輯
  - `apps/web/src/components/TransactionModal/SplitDetailModal.tsx` — 人員 selector 過濾邏輯
  - `apps/web/src/components/transaction/TransactionList.tsx` — 已刪除成員刪除線顯示
