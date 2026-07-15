## Why

當使用者建立新的交易（例如記帳）並開啟交易模組的分類選擇器（Category Selector）時，若帳本中存在使用者自訂的分類，預設的分類選擇會直接選取該自訂分類。然而，預期的正確行為應該是預設選取第一個主分類（大分類）底下的第一個子分類（小分類），例如「餐飲食品」下的「早餐」。

## What Changes

修改 `getDefaultTransactionCategoryId` 函數的選取邏輯，確保在初始化交易草稿（Transaction Draft）或切換交易類型（支出/收入）時，預設選取的分類 ID 是符合「第一個主分類下的第一個小分類」。

## Non-Goals (optional)

- 不調整分類在資料庫中的排序欄位（`sortOrder`）的計算方式。
- 不調整 `CategorySelector` 元件在畫面上的渲染邏輯或分頁排序。

## Capabilities

### New Capabilities

(無)

### Modified Capabilities

- `categories`: 修改預設選取分類的行為，確保當有自訂分類存在時，預設仍會選擇第一個大分類下的第一個小分類。

## Impact

- Affected code:
  - Modified:
    - apps/web/src/utils/transactionUtils.ts
    - apps/web/specs/transactionUtils.spec.ts
