## Why

提示紅點目前是與分頁標題文字水平排列。為了提升視覺美感與符合主流未讀標記設計（像是訊息未讀紅點在右上角），需要將紅點調整至標題文字的右上角。

## What Changes

- 將「已結算」分頁上的提示紅點，從水平排列改為絕對定位，顯示在分頁標題文字的右上角。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `settlement`: 系統在「已結算」分頁顯示提示標記時，應將其置於標籤文字的右上角。

## Impact

- Affected specs: `settlement`
- Affected code:
  - Modified:
    - `apps/web/src/pages/account-books/[id]/settlement/index.tsx`
