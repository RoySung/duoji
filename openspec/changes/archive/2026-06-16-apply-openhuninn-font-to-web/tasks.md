## 1. 字體套用與樣式調整

- [x] 1.1 在 `apps/web/src/pages/styles.css` 中宣告 `@font-face` 並更新 `html` 的 `font-family` 屬性，將 `'jf-openhuninn'` 設為首選字體。此任務將透過檢視樣式表宣告以驗證設定正確。
- [x] 1.2 修改 `apps/web/tailwind.config.js` 的 `theme.extend.fontFamily.sans` 配置，將 `'jf-openhuninn'` 加入至 sans-serif 字體清單的最前方。此任務將透過檢視 Tailwind 設定檔以驗證配置正確。

## 2. 驗證

- [x] 2.1 執行專案的生產環境建置 `pnpm build:web`，確保新的樣式表與 Tailwind 設定在 Next.js 的編譯過程中皆無任何錯誤或警告，順利完成編譯。
