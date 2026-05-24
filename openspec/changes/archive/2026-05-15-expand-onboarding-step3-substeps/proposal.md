## Why

目前 onboarding step 3「記錄一筆交易」只用單一 coachmark 指向交易頁的「建立」按鈕，新使用者點開建立 modal 後就失去引導，必須自行摸索「金額在哪輸入、分類怎麼選、誰付款、怎麼分攤」。將 step 3 拆成可逐步指引的子步驟，可在新使用者第一次建立交易時把整段流程帶完，明顯降低首次完成交易的失敗率與摩擦。

## What Changes

- 將 onboarding step 3 從單一 coachmark 擴展為 6 個子步驟：(1) 點擊「建立」按鈕、(2) 輸入金額、(3) 選擇分類、(4) 設定誰付款、(5) 設定分攤、(6) 送出建立。
- 子步驟全部可略過：每個子步驟提供「跳過」按鈕；跳過時整段 step 3 結束、流程前進到 step 4，不會只跳過單一子步驟。沿用既有「step 3 整體可略過」的語意，不引入「子步驟層級略過」的新語意。
- 子步驟 2–6 的 coachmark 錨點在交易建立 modal/表單內，DOM 在 modal 開啟前不存在。引導器需在每個子步驟等待對應 selector 出現後再渲染，selector 等待逾時則自動結束 step 3。
- 子步驟之間透過使用者的實際操作驅動推進（例如按下「建立」按鈕後自動進到「輸入金額」子步驟），不由 coachmark 自身的「下一步」按鈕推進；唯一例外是當對應 UI 操作不存在明確完成事件時（例如「選擇分類」），允許使用「下一步」按鈕。
- 實作層用 `@reactour/tour` 原生多步驟（step 3 內含多個 `StepType`），不為子步驟新增全域 step 編號或變更 onboarding 進度顯示（仍為 5 步）。
- 新增交易建立 modal/表單內必要的 `data-onboarding-anchor` DOM 標記（金額輸入、分類選擇器、付款人、分攤、送出按鈕）。

## Non-Goals

- 不為 step 4（settlement）、step 5（reports）拆子步驟，僅針對 step 3。
- 不變更 onboarding 全域步數（5 步進度顯示維持不變）。
- 不引入「子步驟層級的個別略過」UX；跳過任一子步驟即視為跳過整段 step 3。
- 不為 step 3 加上「上一步」回到前一子步驟的能力，避免處理表單回填的複雜度。
- 不變更交易建立 modal/表單本身的欄位、版面或行為，只新增 `data-onboarding-anchor` 標記。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `onboarding`: 修改現有 step 3 的引導粒度需求，從「單一 coachmark 指向建立按鈕」變更為「6 個子步驟的引導序列、子步驟由使用者實際操作推進、跳過任一子步驟即離開 step 3」。

## Impact

- Affected specs: `onboarding`（修改 step 3 相關的 tutorial 需求）。
- Affected code:
  - `apps/web/src/components/onboarding/OnboardingTutorial.tsx`：支援同一個 step 內多個 `StepType`、為 step 3 處理 selector 等待與時序。
  - `apps/web/src/components/onboarding/TransactionTutorial.tsx`：改為定義 6 個子步驟，並指向 modal/表單內的錨點。
  - 交易建立頁與 modal/表單元件：新增 `data-onboarding-anchor` DOM 標記（金額、分類、付款人、分攤、送出按鈕）。
  - i18n message catalogs（`en-US`、`zh-TW`）：新增 6 個子步驟的標題與描述文案 key。
- 依賴：本變更建立在 `add-i18n-and-onboarding`（目前 34/35、尚未 archive）之上，假設其完成後 `onboarding` 規格已寫入 `openspec/specs/onboarding/`。若該變更尚未 archive，本變更的 delta 仍以 modified 形式撰寫，archive 時須在其後處理。
