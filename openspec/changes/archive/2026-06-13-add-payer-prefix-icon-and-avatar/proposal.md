## Why

目前交易列表中的付款人/收款人僅以純文字晶片（Chip）顯示，缺乏直觀的視覺識別。增加前綴圖示（Prefix Icon）與使用者頭像（Avatar）可以提升使用者的辨識效率與整體的介面美觀度。

## What Changes

- 在交易列表的付款人/收款人顯示晶片中，增加前綴圖示（使用 `LuDollarSign`）。
- 在交易列表的付款人/收款人顯示晶片中，若為單一付款人/收款人，則顯示該使用者的頭像（Avatar）；若為多位付款人，則顯示對應的頭像或預設圖示。
- 調整相關 UI 樣式使其符合現代美學。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `transactions`: 在交易列表中顯示付款人/收款人時，增加前綴圖示與頭像顯示。

## Impact

- Affected code:
  - Modified:
    - apps/web/src/components/transaction/TransactionList.tsx
