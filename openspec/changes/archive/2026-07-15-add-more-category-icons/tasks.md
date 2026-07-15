## 1. 新增常用分類圖示

- [x] 1.1 在 `apps/web/src/constants/categoryIcons.ts` 的 `CATEGORY_ICONS` 中新增寵物、用品、活動以及其他日常常用圖示（共 21 個，包括 paw-print, dog, cat, package, box, wrench, sparkles, calendar, ticket, trophy, activity, home, droplet, zap, phone, wifi, baby, plane, map-pin, receipt, scissors），以滿足 "Custom categories support visual metadata" 需求。驗證方式：執行 `pnpm test:web` 確保沒有編譯與測試錯誤。
- [x] 1.2 在 `apps/web/src/i18n/messages/zh-TW.json` 與 `apps/web/src/i18n/messages/en-US.json` 中，為新增的 21 個圖示名稱添加對應的 `iconOptions` 語系翻譯文字，以便網格圖示選擇器能正確顯示無障礙說明（`aria-label` 與 `title`）。驗證方式：開啟新增分類彈窗，懸停在新增的圖示上，確認顯示正確的提示說明文字。
