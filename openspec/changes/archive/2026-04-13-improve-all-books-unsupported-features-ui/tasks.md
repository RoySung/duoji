## 1. AccountBookMenu 說明文字

- [x] 1.1 在 `apps/web/src/components/accountBook/AccountBookMenu.tsx` 的「All Account Books」卡片中，於現有描述文字下方新增第二行說明文字，內容說明 Settlement 與 Add Transaction 不支援此視圖（例如："Settlement and adding transactions are not available in this view."），以滿足「The "All Account Books" card communicates feature limitations」需求

## 2. NavBar 禁止遮罩 — Settlement

- [x] 2.1 在 `apps/web/src/components/layout/navbar.tsx` 中，為 settlement 標籤的 `<label>` 元素加上 `relative` 定位，並在 `isAggregateView` 為 `true` 時，在 `<label>` 內疊加一個絕對定位的禁止符號元素（例如 `<span>` 包含 🚫 或 CSS 繪製的禁止圓圈），取代原本僅使用 `opacity: 0.4` 的方式；移除或整合原有的 `opacity` 樣式，以滿足「Navbar includes a settlement tab」中關於「Settlement tab is disabled in aggregate view」的需求

## 3. NavBar 禁止遮罩 — Add Transaction

- [x] 3.1 在 `apps/web/src/components/layout/navbar.tsx` 中，為 Add Transaction `<Button>` 的外層容器加上 `relative` 定位，並在 `isAggregateView` 為 `true` 時，在按鈕上疊加一個絕對定位的禁止符號元素，視覺風格與 Settlement 遮罩保持一致；確保按鈕本身保持 `isDisabled={isAggregateView}` 以維持原有互動禁止邏輯，以滿足「Add Transaction button shows a prohibition overlay in aggregate view」需求
