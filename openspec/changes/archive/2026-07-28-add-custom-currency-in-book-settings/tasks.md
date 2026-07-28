## 1. 擴充 CurrencySchema 與定義常用幣別常數

- [x] 1.1 更新 `apps/web/src/entities/accountBook.ts` 的 `CurrencySchema` 為 `z.string().min(1)` 並導出 `DEFAULT_CURRENCIES` 常用幣別清單，確保支援自訂字串與擴充幣別，可經由單元測試或類型檢查 (tsc) 驗證。

## 2. AccountBookForm 下拉選單與自訂欄位 UI 互動設計

- [x] 2.1 於 `apps/web/src/components/accountBookSettings/AccountBookForm.tsx` 實現 Preset and custom currency selection in book settings，擴充預設選單包含常見貨幣與自訂選項，選取自訂時動態顯示文字輸入框，並加入空白輸入驗證，可經由 Next.js 開發伺服器與頁面手動操作或表單驗證進行確認。
- [x] 2.2 更新多國語言檔 `apps/web/src/i18n/messages/zh-TW.json` 與 `apps/web/src/i18n/messages/en-US.json` 新增自訂幣別與擴充幣別相關語意 key，經由 UI 渲染文字與多語系建置確認無缺漏。
