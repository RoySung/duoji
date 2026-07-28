## Why

現有帳本的幣別選擇僅限於預設的三種幣別（USD, JPY, TWD），無法滿足使用者對其他常用國際貨幣（如 EUR, GBP, CNY, HKD, SGD, AUD, CAD, KRW 等）或自訂貨幣/記帳單位的需求。在帳本設定中擴充預設常用幣別選項並支援自訂幣別輸入，能提升使用者記帳的靈活度與彈性。

## What Changes

- 在帳本設定與新增帳本表單中擴充預設幣別選單，納入常見國際貨幣（例如 TWD, USD, JPY, EUR, GBP, CNY, HKD, SGD, AUD, CAD, KRW）。
- 支援「自訂幣別」輸入功能：使用者可從預設選單挑選，或選擇自訂輸入自訂的幣別名稱/代碼。
- 更新 `CurrencySchema` 與相關型別定義，使其支援字串型態的自訂幣別，並維持現有格式化與顯示邏輯相容性。

## Capabilities

### New Capabilities

- `custom-currency-settings`: 在帳本設定中提供擴充預設幣別選單與自訂幣別輸入功能，允許使用者選擇常用貨幣或自訂幣別代碼。

### Modified Capabilities

(none)

## Impact

- Affected specs: `custom-currency-settings`
- Affected code:
  - Modified:
    - `apps/web/src/entities/accountBook.ts`
    - `apps/web/src/components/accountBookSettings/AccountBookForm.tsx`
    - `apps/web/src/i18n/messages/zh-TW.json`
    - `apps/web/src/i18n/messages/en-US.json`
