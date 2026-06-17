## Why

當有已結算但尚未完成全部轉帳的紀錄時，使用者在首頁或結算頁面中不容易察覺，需要主動切換至歷史列表才能看到狀態。此外，歷史分頁的舊名稱「歷史」不夠直觀，將其更名為「已結算」能與「未結算」分頁形成更好的對照。

## What Changes

- 將結算頁面中的「歷史」分頁標題，更換為「已結算」（英文版為「Settled」）。
- 當系統偵測到有已結算且尚未完成轉帳的紀錄時，在「已結算」分頁標籤上顯示一個未讀/提示紅點。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `settlement`: 系統應將結算歷史分頁重新命名為「已結算」，且當存在任何未完成全部轉帳的結算紀錄時，在該分頁標籤上顯示提示標記。

## Impact

- Affected specs: `settlement`
- Affected code:
  - Modified:
    - `apps/web/src/pages/account-books/[id]/settlement/index.tsx`
    - `apps/web/src/i18n/messages/zh-TW.json`
    - `apps/web/src/i18n/messages/en-US.json`
