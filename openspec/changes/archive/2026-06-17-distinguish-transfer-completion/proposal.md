## Why

目前結算紀錄列表與詳細頁面中，僅以細微的文字顯示已完成與總轉帳筆數（例如「1/2 筆轉帳已完成」），缺乏直觀且明顯的狀態標示。這使得使用者難以快速區分哪些結算紀錄已完全完成轉帳，哪些仍有待處理的轉帳項目。

## What Changes

- 在結算紀錄列表（`SettlementRecordList`）中，為每個結算項目新增明顯的狀態標章（如「已結算」綠色標章與「待處理」橘/黃色標章），讓使用者一目了然。
- 在結算紀錄詳細頁面（`SettlementRecordDetail`）的標題旁，同步新增該結算紀錄的整體狀態標章（「已結算」/「待處理」）。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `settlement`: 在結算紀錄歷史列表與詳細頁面中，系統應根據所有轉帳的完成狀態，顯示明顯的整體結算狀態標章。

## Impact

- Affected specs: `settlement`
- Affected code:
  - Modified:
    - `apps/web/src/components/settlement/SettlementRecordList.tsx`
    - `apps/web/src/components/settlement/SettlementRecordDetail.tsx`
    - `apps/web/src/i18n/messages/zh-TW.json`
    - `apps/web/src/i18n/messages/en-US.json`
