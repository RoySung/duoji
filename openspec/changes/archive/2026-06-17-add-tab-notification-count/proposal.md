## Why

分頁上的提示紅點雖然能提醒使用者有未完成的項目，但無法顯示具體的未完成結算紀錄筆數。在紅點中加入數字可以讓使用者在不切換分頁的情況下，直接知道有多少筆已結算但尚未完成轉帳的紀錄。

## What Changes

- 將「已結算」分頁上的提示紅點，修改為內含未完成結算紀錄筆數的數字標章（Badge）。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `settlement`: 當有已結算且尚未完成轉帳的紀錄時，系統在「已結算」分頁的提示標記上應顯示具體的未完成紀錄筆數。

## Impact

- Affected specs: `settlement`
- Affected code:
  - Modified:
    - `apps/web/src/pages/account-books/[id]/settlement/index.tsx`
